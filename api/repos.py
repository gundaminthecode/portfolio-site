# api/repos.py
import os, requests, json

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

def _gh(url):
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    return requests.get(url, headers=headers, timeout=10)

def handler(request, response):
    # Read ?user=gundaminthecode
    user = request.query.get("user", [""])[0]
    if not user:
        response.status_code = 400
        return response.send(b'{"error":"missing user"}', "application/json")

    # 1) Fetch repos
    r = _gh(f"https://api.github.com/users/{user}/repos?per_page=100&sort=updated")
    if not r.ok:
        response.status_code = r.status_code
        return response.send(json.dumps({"error":"github error","status":r.status_code}).encode(), "application/json")

    repos = r.json()

    # 2) Build candidate live URLs and check which ones work
    out = []
    for repo in repos:
        if repo.get("archived") or repo.get("fork"):
            continue

        owner = repo["owner"]["login"]
        name  = repo["name"]
        homepage = (repo.get("homepage") or "").strip() or None
        guesses = [homepage] if homepage else []
        guesses.append(f"https://{owner}.github.io/{name}/")

        live_url = None
        for url in guesses:
            if not url:
                continue
            try:
                h = requests.head(url, allow_redirects=True, timeout=4)
                if 200 <= h.status_code < 400:
                    live_url = url
                    break
                # some hosts block HEAD; try a lightweight GET
                g = requests.get(url, allow_redirects=True, timeout=4, stream=True)
                if 200 <= g.status_code < 400:
                    live_url = url
                    break
            except requests.RequestException:
                pass

        out.append({
            "id": repo["id"],
            "name": name,
            "description": repo.get("description"),
            "html_url": repo["html_url"],
            "language": repo.get("language"),
            "stargazers_count": repo.get("stargazers_count", 0),
            "forks_count": repo.get("forks_count", 0),
            "updated_at": repo.get("updated_at"),
            "live_url": live_url,  # null if not live
        })

    response.set_header("Content-Type", "application/json")
    return response.send(json.dumps(out).encode(), "application/json")
