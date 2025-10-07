// hooks/deriveLiveUrl.ts

// Derive a live URL for a GitHub repository based on its homepage or GitHub Pages settings

export function deriveLiveUrl(repo: {
  name: string;
  owner?: { login?: string | null } | null;
  homepage?: string | null;
  has_pages?: boolean | null;
}) {
  const homepage = repo.homepage?.trim();
  if (homepage) {
    // prefer explicit homepage if it looks like a real URL
    try {
      const u = new URL(homepage.includes("://") ? homepage : `https://${homepage}`);
      return u.toString();
    } catch {
      // ignore invalid homepage values
    }
  }

  // fallback to GitHub Pages if enabled
  const owner = repo.owner?.login;
  if (repo.has_pages && owner) {
    return `https://${owner}.github.io/${repo.name}/`;
  }

  return null;
}
