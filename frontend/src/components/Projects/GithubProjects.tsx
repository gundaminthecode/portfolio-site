// GithubProjects.tsx

import { useMemo } from "react";
import SwiperCarousel from '../Carousel/SwiperCarousel.tsx'
import { useGithubRepos } from "../../hooks/useGithubRepos";

type Props = {
  username: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  max?: number;
  sortBy?: "updated" | "stars";
};

export default function GithubProjects(props: Props) {
  const { repos, loading, error } = useGithubRepos({
    username: props.username,
    includeForks: props.includeForks,
    includeArchived: props.includeArchived,
    sortBy: props.sortBy,
  });

  const filtered = useMemo(() => {
    let list = repos; // server already filtered & sorted, but keep client options
    return typeof props.max === "number" ? list.slice(0, props.max) : list;
  }, [repos, props.max]);

  if (loading) return <p>Loading repositories…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;
  if (filtered.length === 0) return <p>No repositories to display.</p>;

  return (
    <div id="projects" className="projects-carousel-wrapper">
      <h2>My Projects</h2>
      <p>Public GitHub repositories for @{props.username}</p>
      <SwiperCarousel repos={filtered} />
    </div>
  );
}
