// SwiperCarousel.tsx
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination, Autoplay, Mousewheel } from 'swiper/modules'

import ProjectSlide from '../Projects/ProjectSlide'
import type { Repo } from '../Projects/ProjectCard'
import '../../styles/carousel.css'

type Props = { repos: Repo[] }

export default function SwiperCarousel({ repos }: Props) {
  return (
    <Swiper
      direction="vertical"
      slidesPerView="auto"         // respect fixed slide width/height
      spaceBetween={18}
      centeredSlides={false}
      loop
      // loopedSlides={repos.length}
      loopAdditionalSlides={2}
      speed={700}
      grabCursor
      mousewheel
      autoplay={{ delay: 1000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      watchSlidesProgress
      onBeforeInit={(swiper) => { swiper.params.watchSlidesProgress = true }}
      onSetTranslate={(swiper) => {
        const radius = 220; // “wheel” radius in px
        swiper.slides.forEach((slideEl: any) => {
          const el = slideEl as HTMLElement
          const p = (slideEl as any).progress || 0 // -… 0 …+
          // Angle per step (tweak for tighter/looser wheel)
          const angle = p * 65 // deg, rotate around X for vertical rolodex
          // Vertical spacing influenced by progress
          const ty = p * (swiper.height * 0.33)
          // Push away from camera then slightly vary with progress
          const tz = -radius + Math.min(Math.abs(p) * 40, 80)

          el.style.transform = `translate3d(0, ${ty}px, ${tz}px) rotateX(${angle}deg)`
          el.style.transformOrigin = '50% 50%'
          el.style.opacity = String(1 - Math.min(Math.abs(p) * 0.55, 0.85))
          el.style.zIndex = String(1000 - Math.abs(Math.round(p * 100)))
          el.style.backfaceVisibility = 'hidden'
        })
      }}
      onSetTransition={(swiper, duration) => {
        swiper.slides.forEach((slideEl: any) => {
          (slideEl as HTMLElement).style.transitionDuration = `${duration}ms`
        })
      }}
      modules={[Pagination, Autoplay, Mousewheel]}
      className="rolodexSwiper"
    >
      {repos.map((repo) => (
        <SwiperSlide key={(repo as any).id ?? repo.name}>
          <ProjectSlide repo={repo} variant="carousel" />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
