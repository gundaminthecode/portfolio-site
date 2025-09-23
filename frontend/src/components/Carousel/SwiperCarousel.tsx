// SwiperCarousel.tsx
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import ProjectSlide from '../Projects/ProjectSlide'
import type { Repo } from '../Projects/ProjectCard'

import '../../styles/carousel.css'

type Props = { repos: Repo[] }

export default function SwiperCarousel({ repos }: Props) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      slidesPerView="auto"
      spaceBetween={8}
      centeredSlides={false}
      loop
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 3500, disableOnInteraction: true }}
      // 🔸 remove slidesPerView numbers from breakpoints
      breakpoints={{}} 
      style={{ padding: '1rem 0' }}
    >
      {repos.map((repo) => (
        <SwiperSlide key={repo.id} className="project-slide">
          <ProjectSlide repo={repo} />
        </SwiperSlide>
      ))}
    </Swiper>

  )
}
