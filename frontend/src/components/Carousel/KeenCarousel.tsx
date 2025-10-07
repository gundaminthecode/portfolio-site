// components/Carousel/KeenCarousel.tsx

// 3D cylinder carousel using Keen Slider with vertical mouse wheel control

import { useKeenSlider } from "keen-slider/react"
import type { KeenSliderPlugin } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

import ProjectSlide from "../Projects/ProjectSlide"
import type { Repo } from "../Projects/ProjectCard"
import "../../styles/carousel.css"

type Props = { repos: Repo[] }

const carousel: KeenSliderPlugin = (slider) => {
  let z = 300

  const layout = () => {
    const n = Math.max(slider.slides.length, 1)
    const container = slider.container as HTMLElement
    const scene = container.parentElement as HTMLElement

    // Measure actual face height so CSS media queries and JS stay in sync
    const first = slider.slides[0] as HTMLElement | undefined
    const faceH =
      (first && first.clientHeight) ||
      (scene?.clientHeight || container.clientHeight || 200) * 0.6

    if (n > 1) {
      z = Math.round((faceH / 2) / Math.tan(Math.PI / n))
    }

    const step = 360 / n
    slider.slides.forEach((el, idx) => {
      const node = el as HTMLElement
      node.style.transform = `translate(-50%, -50%) rotateX(${step * idx}deg) translateZ(${z}px)`
      node.style.transformOrigin = "50% 50%"
      node.style.backfaceVisibility = "hidden"
      node.style.position = "absolute"
      node.style.top = "50%"
      node.style.left = "50%"
    })
    rotate()
  }

  const rotate = () => {
    const deg = 360 * slider.track.details.progress
    const container = slider.container as HTMLElement
    container.style.transform = `translateZ(-${z}px) rotateX(${deg}deg)`
    container.style.transformStyle = "preserve-3d"
  }

  slider.on("created", layout)
  slider.on("updated", layout)
  slider.on("slideChanged", layout)
  slider.on("detailsChanged", rotate)
}

export default function RepoCylinderCarousel({ repos }: Props) {
  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      selector: ".carousel__cell",
      renderMode: "custom",
      mode: "free-snap",
      rubberband: false,
      vertical: true, // make the slider vertical
    },
    [
      carousel,
      // mouse wheel control
      (slider) => {
        function onWheel(e: WheelEvent) {
          e.preventDefault()
          const dir = e.deltaY > 0 ? 1 : -1
          slider.moveToIdx(slider.track.details.rel + dir, true)
        }
        slider.on("created", () => {
          slider.container.addEventListener("wheel", onWheel, { passive: false })
        })
        slider.on("destroyed", () => {
          slider.container.removeEventListener("wheel", onWheel)
        })
      },
    ]
  )

  return (
    <div className="wrapper">
      <div className="scene">
        <div className="carousel keen-slider" ref={sliderRef}>
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="keen-slider__slide carousel__cell"
            >
              <div className="carousel__card">
                <ProjectSlide repo={repo} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
