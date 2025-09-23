// GithubProjects.tsx

import { useEffect, useMemo, useState } from "react";
import { type Repo } from "./ProjectCard.tsx";
// import ProjectCarouselInfinite from "./ProjectCarouselInfinite";
// import ProjectCarouselSimple from "./ProjectCarouselSimple.tsx";
// import EmblaCarousel from '../Carousel/EmblaCarousel.tsx'
import SwiperCarousel from '../Carousel/SwiperCarousel.tsx'


const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");

type Props = {
  username: string;
  includeForks?: boolean;
  includeArchived?: boolean;
  max?: number;
  sortBy?: "updated" | "stars";
};

export default function GithubProjects({
  username,
  includeForks = false,
  includeArchived = false,
  max,
  sortBy = "updated",
}: Props) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const OPTIONS: EmblaOptionsType = { loop: true, slidesToScroll: 1, align: 'center' };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = `${API_BASE}/api/repos?username=${encodeURIComponent(username)}&includeForks=${includeForks}&includeArchived=${includeArchived}&sortBy=${sortBy}`;
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject(`${r.status} ${r.statusText}`))
      .then((data: Repo[]) => setRepos(data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));

    return () => { };
  }, [username, includeForks, includeArchived, sortBy]);

  const filtered = useMemo(() => {
    let list = repos; // server already filtered & sorted, but keep client options
    return typeof max === "number" ? list.slice(0, max) : list;
  }, [repos, max]);

  if (loading) return <p>Loading repositories…</p>;
  if (error) return <p style={{ color: "crimson" }}>Error: {error}</p>;
  if (filtered.length === 0) return <p>No repositories to display.</p>;

  return (
    <div id="projects" className="projects-carousel-wrapper">
      <h2>My Projects</h2>
      <p>Public GitHub repositories for @{username}</p>
      <SwiperCarousel repos={filtered} />
    </div>
  );
}
