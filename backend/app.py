import os
from typing import Any, Dict, List
import requests
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_caching import Cache

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGIN", "*")}})

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
CACHE_TTL = int(os.getenv("CACHE_TTL", "600"))  # seconds

cache = Cache(
    app,
    config={
        "CACHE_TYPE": "RedisCache" if os.getenv("REDIS_URL") else "SimpleCache",
        "CACHE_REDIS_URL": os.getenv("REDIS_URL"),
        "CACHE_DEFAULT_TIMEOUT": CACHE_TTL,
    },
)

def gh_headers(extra: Dict[str,str] | None = None) -> Dict[str,str]:
    h = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "portfolio-site-backend",   # NEW
    }
    if GITHUB_TOKEN:
        h["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    if extra: h.update(extra)
    return h

def with_cache_headers(resp, seconds=CACHE_TTL):
    resp.headers["Cache-Control"] = f"public, max-age={seconds}"
    return resp

def cache_hit_response(data, ttl=CACHE_TTL):
    resp = jsonify(data)
    resp.headers["X-Cache"] = "HIT"
    resp.headers["Cache-Control"] = f"public, max-age={ttl}"
    return resp

def cache_miss_response(key, data, ttl=CACHE_TTL):
    cache.set(key, data, timeout=ttl)
    resp = jsonify(data)
    resp.headers["X-Cache"] = "MISS"
    resp.headers["Cache-Control"] = f"public, max-age={ttl}"
    return resp

def respond(data, cache_state="MISS"):
    resp = jsonify(data)
    resp.headers["X-Cache"] = cache_state
    return with_cache_headers(resp)

@app.get("/api/repos")
def list_repos():
    username = request.args.get("username", "").strip()
    includeForks = request.args.get("includeForks", "false").lower() == "true"
    includeArchived = request.args.get("includeArchived", "false").lower() == "true"
    sortBy = request.args.get("sortBy", "updated")
    if not username:
        abort(400, "username is required")

    ck = f"repos:{username}:{int(includeForks)}:{int(includeArchived)}:{sortBy}"
    cached = cache.get(ck)
    if cached is not None:
        return cache_hit_response(cached)

    @cache.memoize(timeout=CACHE_TTL)
    def _fetch(username: str, includeForks: bool, includeArchived: bool, sortBy: str):
        per_page = 100
        page = 1
        items: List[Dict[str, Any]] = []
        while page <= 5:
            url = f"https://api.github.com/users/{username}/repos"
            r = requests.get(
                url,
                headers=gh_headers(),
                params={"per_page": per_page, "page": page, "type": "owner", "sort": "updated"},
                timeout=15,
            )
            if r.status_code == 403:
                abort(403, "GitHub rate limit. Set GITHUB_TOKEN on the server.")
            if not r.ok:
                abort(r.status_code, f"GitHub error: {r.status_code} {r.reason}")
            data = r.json()
            if not isinstance(data, list) or not data:
                break
            items.extend(data)
            if len(data) < per_page:
                break
            page += 1

        items = [r for r in items if (includeForks or not r.get("fork")) and (includeArchived or not r.get("archived"))]

        if sortBy == "stars":
            items.sort(key=lambda r: (r.get("stargazers_count") or 0, r.get("updated_at") or ""), reverse=True)
        else:
            items.sort(key=lambda r: r.get("updated_at") or "", reverse=True)

        def pick(r: Dict[str, Any]) -> Dict[str, Any]:
            o = r.get("owner") or {}
            return {
                "id": r.get("id"),
                "name": r.get("name"),
                "full_name": r.get("full_name"),
                "html_url": r.get("html_url"),
                "description": r.get("description"),
                "language": r.get("language"),
                "topics": r.get("topics") or [],
                "stargazers_count": r.get("stargazers_count"),
                "forks_count": r.get("forks_count"),
                "archived": r.get("archived"),
                "fork": r.get("fork"),
                "updated_at": r.get("updated_at"),
                "pushed_at": r.get("pushed_at"),
                "owner": {"login": o.get("login")},
                "homepage": r.get("homepage"),
                "default_branch": r.get("default_branch"),
                "license": r.get("license"),
                "open_issues_count": r.get("open_issues_count"),
            }

        return [pick(r) for r in items]

    data = _fetch(username, includeForks, includeArchived, sortBy)
    trimmed = data
    return cache_miss_response(ck, trimmed)

@app.get("/api/commits")
def commits():
    owner = request.args.get("owner","").strip()
    repo = request.args.get("repo","").strip()
    since = request.args.get("since","").strip()  # ISO
    if not owner or not repo or not since:
        abort(400, "owner, repo and since are required")

    # Normalize cache key to the day so reloads share cache
    since_day = since[:10]                        # YYYY-MM-DD
    ck = f"commits:{owner}:{repo}:{since_day}"
    cached = cache.get(ck)
    if cached is not None:
        resp = jsonify(cached); resp.headers["X-Cache"] = "HIT"; return with_cache_headers(resp)

    @cache.memoize(timeout=CACHE_TTL)
    def _fetch(owner: str, repo: str, since: str) -> List[Dict[str, Any]]:
        per_page = 100
        page = 1
        out: List[Dict[str, Any]] = []
        while page <= 10:
            url = f"https://api.github.com/repos/{owner}/{repo}/commits"
            r = requests.get(url, headers=gh_headers(), params={"since": since, "per_page": per_page, "page": page}, timeout=15)
            if r.status_code == 403:
                abort(403, "GitHub rate limit. Set GITHUB_TOKEN on the server.")
            if not r.ok:
                abort(r.status_code, f"GitHub error: {r.status_code} {r.reason}")
            data = r.json()
            if not isinstance(data, list) or not data:
                break
            for c in data:
                out.append({
                    "sha": c.get("sha"),
                    "html_url": c.get("html_url"),
                    "message": (c.get("commit") or {}).get("message", "") or "",
                    "author": {
                        "name": ((c.get("commit") or {}).get("author") or {}).get("name")
                                or (c.get("author") or {}).get("login") or "unknown",
                        "date": ((c.get("commit") or {}).get("author") or {}).get("date")
                                or (c.get("committer") or {}).get("date") or "",
                    },
                })
            if len(data) < per_page:
                break
            page += 1
        return out

    data = _fetch(owner, repo, since)
    out = data
    return cache_miss_response(ck, out)

@app.get("/api/progress-md")
def progress_md():
    owner = request.args.get("owner","").strip()
    repo = request.args.get("repo","").strip()
    if not owner or not repo:
        abort(400, "owner and repo are required")

    key = f"progressmd:{owner}:{repo}"
    cached = cache.get(key + ":data")
    etag = cache.get(key + ":etag")
    candidates = [
        "progress.md","Progress.md","PROGRESS.md",
        "docs/progress.md","docs/Progress.md","docs/PROGRESS.md",
        ".github/progress.md",".github/PROGRESS.md",
    ]
    for path in candidates:
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        headers = gh_headers({"Accept": "application/vnd.github.v3.raw"})
        if etag:
            headers["If-None-Match"] = etag
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code == 304 and cached is not None:
            return respond({"path": cache.get(key + ":path"), "content": cached}, "REVALIDATED")
        if r.ok:
            new_etag = r.headers.get("ETag")
            cache.set(key + ":data", r.text, timeout=CACHE_TTL)
            cache.set(key + ":path", path, timeout=CACHE_TTL)
            if new_etag:
                cache.set(key + ":etag", new_etag, timeout=CACHE_TTL)
            return respond({"path": path, "content": r.text}, "MISS")
        if r.status_code == 403:
            abort(403, "GitHub rate limit. Set GITHUB_TOKEN on the server.")

    # none found → cache empty result
    cache.set(key + ":data", "", timeout=CACHE_TTL)
    cache.set(key + ":path", None, timeout=CACHE_TTL)
    return respond({"path": None, "content": ""}, "MISS")

@app.get("/api/case-study")
def case_study():
    owner = request.args.get("owner","").strip()
    repo = request.args.get("repo","").strip()
    if not owner or not repo:
        abort(400, "owner and repo are required")

    key = f"casestudy:{owner}:{repo}"
    cached = cache.get(key + ":data")
    etag = cache.get(key + ":etag")
    for path in ["docs/CASESTUDY.md","docs/casestudy.md","CASESTUDY.md","casestudy.md","CASE_STUDY.md"]:
        url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
        headers = gh_headers({"Accept": "application/vnd.github.v3.raw"})
        if etag:
            headers["If-None-Match"] = etag
        r = requests.get(url, headers=headers, timeout=15)
        if r.status_code == 304 and cached is not None:
            return respond({"path": cache.get(key + ":path"), "content": cached}, "REVALIDATED")
        if r.ok:
            new_etag = r.headers.get("ETag")
            cache.set(key + ":data", r.text, timeout=CACHE_TTL)
            cache.set(key + ":path", path, timeout=CACHE_TTL)
            if new_etag:
                cache.set(key + ":etag", new_etag, timeout=CACHE_TTL)
            return respond({"path": path, "content": r.text}, "MISS")
        if r.status_code == 403:
            abort(403, "GitHub rate limit. Set GITHUB_TOKEN on the server.")
    return respond({"path": None, "content": ""}, "MISS")

@app.get("/api/health")
def health():
    # Report whether token is loaded and current rate limit
    try:
        r = requests.get("https://api.github.com/rate_limit", headers=gh_headers(), timeout=10)
        data = r.json() if r.ok else {"error": r.text}
        return jsonify({
            "token_present": bool(bool(GITHUB_TOKEN)),
            "status": r.status_code,
            "rate": data.get("rate") or data,
            "core_remaining": r.headers.get("x-ratelimit-remaining"),
            "core_reset": r.headers.get("x-ratelimit-reset"),
        })
    except Exception as e:
        return jsonify({"token_present": bool(GITHUB_TOKEN), "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=bool(os.getenv("DEBUG")))
