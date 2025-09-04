import os, time, requests
from typing import Any, Dict, List
from flask import Flask, jsonify, request, abort
from flask_cors import CORS

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
CACHE_TTL = 600  # 10 minutes
cache: Dict[str, Dict[str, Any]] = {}  # {key: {"ts": int, "data": list}}

app = Flask(__name__)
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN")  # e.g. https://your-frontend.onrender.com
CORS(app, resources={r"/api/*": {"origins": [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://portfolio-site-i5hj.onrender.com",
    "https://portfolio-site-frontend-h6ci.onrender.com"
]}})

def gh_headers() -> Dict[str, str]:
    h = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if GITHUB_TOKEN:
        h["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return h

def url_is_live(url: str, timeout: float = 4.0) -> bool:
    try:
        r = requests.head(url, allow_redirects=True, timeout=timeout)
        if 200 <= r.status_code < 400:
            return True
        # some hosts don’t love HEAD → fallback to tiny GET
        r = requests.get(url, allow_redirects=True, timeout=timeout, stream=True)
        return 200 <= r.status_code < 400
    except requests.RequestException:
        return False

@app.get("/api/repos")
def repos():
    username = request.args.get("username", "").strip()
    include_forks = request.args.get("includeForks", "false").lower() == "true"
    include_archived = request.args.get("includeArchived", "false").lower() == "true"
    sort_by = request.args.get("sortBy", "updated")

    if not username:
        abort(400, "username is required")

    key = f"{username}:{include_forks}:{include_archived}:{sort_by}"
    now = int(time.time())

    if key in cache and now - cache[key]["ts"] < CACHE_TTL:
        return jsonify(cache[key]["data"])

    # 1) fetch repos
    url = f"https://api.github.com/users/{username}/repos?per_page=100&sort=updated"
    res = requests.get(url, headers=gh_headers(), timeout=10)
    if not res.ok:
        abort(res.status_code, f"GitHub error: {res.status_code} {res.reason}")

    repos: List[Dict[str, Any]] = res.json()

    # 2) filter & sort
    repos = [r for r in repos if (include_forks or not r.get("fork")) and (include_archived or not r.get("archived"))]
    if sort_by == "stars":
        repos.sort(key=lambda r: r.get("stargazers_count", 0), reverse=True)
    else:
        repos.sort(key=lambda r: r.get("updated_at", ""), reverse=True)

    # 3) enrich with live_url (GitHub Pages check)
    out = []
    for r in repos:
        owner = r["owner"]["login"]
        name = r["name"]
        homepage = (r.get("homepage") or "").strip() or None
        guessed = f"https://{owner}.github.io/{name}/"

        live_url = None
        if homepage and url_is_live(homepage):
            live_url = homepage
        elif url_is_live(guessed):
            live_url = guessed

        out.append({
            "id": r["id"],
            "name": name,
            "description": r.get("description"),
            "html_url": r["html_url"],
            "language": r.get("language"),
            "stargazers_count": r.get("stargazers_count", 0),
            "forks_count": r.get("forks_count", 0),
            "updated_at": r.get("updated_at"),
            "archived": r.get("archived", False),
            "fork": r.get("fork", False),
            "live_url": live_url,   # ← None if not live
        })

    cache[key] = {"ts": now, "data": out}
    return jsonify(out)
