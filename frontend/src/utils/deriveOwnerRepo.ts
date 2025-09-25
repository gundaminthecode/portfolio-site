// src/utils/deriveOwnerRepo.ts
export function deriveOwnerRepo(repo: any, fallbackOwner?: string) {
  // Try owner.login → full_name → html_url → fallback
  const owner =
    repo?.owner?.login ||
    (typeof repo?.full_name === "string" ? repo.full_name.split("/")[0] : undefined) ||
    (repo?.html_url ? new URL(repo.html_url).pathname.split("/")[1] : undefined) ||
    fallbackOwner;

  const name =
    repo?.name ||
    (typeof repo?.full_name === "string" ? repo.full_name.split("/")[1] : undefined) ||
    (repo?.html_url ? new URL(repo.html_url).pathname.split("/")[2] : undefined);

  return { owner, name };
}