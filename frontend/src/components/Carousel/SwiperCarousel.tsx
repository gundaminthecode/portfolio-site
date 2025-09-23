// SwiperCarousel.tsx
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import ProjectSlide from '../Projects/ProjectSlide'
import type { Repo } from '../Projects/ProjectCard'

type Props = { repos: Repo[] }

export default function SwiperCarousel({ repos }: Props) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView={3}
      spaceBetween={2}
      loop
      centeredSlides
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3500, disableOnInteraction: true }}
      breakpoints={{
        900: { slidesPerView: 3 },
        600: { slidesPerView: 2 },
        0:   { slidesPerView: 1 },
      }}
      style={{ padding: '1rem 0' }}
    >
      {repos.map((repo) => (
        <SwiperSlide key={repo.id}>
          <ProjectSlide repo={repo} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
