import os, time, requests
from typing import Any, Dict, List
from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from flask_caching import Cache

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGIN", "*")}})

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
CACHE_TTL = int(os.getenv("CACHE_TTL", "600"))  # 10 minutes

# Shared cache (Redis in prod, SimpleCache fallback for dev)
cache = Cache(app, config={
    "CACHE_TYPE": "RedisCache" if os.getenv("REDIS_URL") else "SimpleCache",
    "CACHE_REDIS_URL": os.getenv("REDIS_URL"),
    "CACHE_DEFAULT_TIMEOUT": CACHE_TTL,
})

def with_cache_headers(resp, seconds=CACHE_TTL):
    resp.headers["Cache-Control"] = f"public, max-age={seconds}"
    return resp

def gh_headers(extra: Dict[str, str] | None = None) -> Dict[str, str]:
    h = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if GITHUB_TOKEN:
        h["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    if extra:
        h.update(extra)
    return h

# ---- API ----

@app.get("/api/commits")
def commits():
    owner = request.args.get("owner", "").strip()
    repo = request.args.get("repo", "").strip()
    since = request.args.get("since", "").strip()  # ISO
    if not owner or not repo or not since:
        abort(400, "owner, repo and since are required")

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
    return with_cache_headers(jsonify(data))

@app.get("/api/progress-md")
def progress_md():
    owner = request.args.get("owner", "").strip()
    repo = request.args.get("repo", "").strip()
    if not owner or not repo:
        abort(400, "owner and repo are required")

    @cache.memoize(timeout=CACHE_TTL)
    def _fetch(owner: str, repo: str) -> Dict[str, str]:
        for path in ["progress.md", "Progress.md", "docs/progress.md"]:
            url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
            r = requests.get(url, headers=gh_headers({"Accept": "application/vnd.github.v3.raw"}), timeout=15)
            if r.ok:
                return {"path": path, "content": r.text}
            if r.status_code == 403:
                abort(403, "GitHub rate limit. Set GITHUB_TOKEN on the server.")
        abort(404, "progress.md not found")

    data = _fetch(owner, repo)
    return with_cache_headers(jsonify(data))

@app.get("/api/case-study")
def case_study():
    owner = request.args.get("owner", "").strip()
    repo = request.args.get("repo", "").strip()
    if not owner or not repo:
        abort(400, "owner and repo are required")

    @cache.memoize(timeout=CACHE_TTL)
    def _fetch(owner: str, repo: str) -> Dict[str, str]:
        candidates = [
            "docs/CASESTUDY.md",
            "docs/casestudy.md",
            "CASESTUDY.md",
            "casestudy.md",
            "CASE_STUDY.md",
        ]
        for path in candidates:
            url = f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"
            r = requests.get(
                url,
                headers=gh_headers({"Accept": "application/vnd.github.v3.raw"}),
                timeout=15,
            )
            if r.ok:
                return {"path": path, "content": r.text}
            if r.status_code == 403:
                abort(403, "GitHub rate limit. Set GITHUB_TOKEN on the server.")
        abort(404, "case study not found")

    data = _fetch(owner, repo)
    return with_cache_headers(jsonify(data))

@app.get("/api/repos")
def list_repos():
    username = request.args.get("username", "").strip()
    includeForks = request.args.get("includeForks", "false").lower() == "true"
    includeArchived = request.args.get("includeArchived", "false").lower() == "true"
    sortBy = request.args.get("sortBy", "updated")

    if not username:
        abort(400, "username is required")

    @cache.memoize(timeout=CACHE_TTL)
    def _fetch(username: str, includeForks: bool, includeArchived: bool, sortBy: str):
        per_page = 100
        page = 1
        all_items: List[Dict[str, Any]] = []
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
            all_items.extend(data)
            if len(data) < per_page:
                break
            page += 1

        # filters
        items = [
            r for r in all_items
            if (includeForks or not r.get("fork")) and (includeArchived or not r.get("archived"))
        ]

        # sort: stars or updated
        if sortBy == "stars":
            items.sort(key=lambda r: (r.get("stargazers_count") or 0, r.get("updated_at") or ""), reverse=True)
        else:  # updated
            items.sort(key=lambda r: r.get("updated_at") or "", reverse=True)

        # trim fields we actually use
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
    return with_cache_headers(jsonify(data))

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=int(os.getenv("PORT", "8000")), debug=bool(os.getenv("DEBUG")))
