// components/Projects/ProjectCard.tsx

// Project card component for defining GitHub repository info

// Export Repo type
export type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
  archived: boolean;
  live_url?: string | null;
  owner?: { login?: string };
  default_branch?: string;
};
