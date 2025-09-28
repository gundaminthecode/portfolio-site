// import React from "react"
import { useKeenSlider } from "keen-slider/react"
import type { KeenSliderPlugin } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"

import ProjectSlide from "../Projects/ProjectSlide"
import type { Repo } from "../Projects/ProjectCard"
import "../../styles/carousel.css" // keep your styles

type Props = { repos: Repo[] }

const carousel: KeenSliderPlugin = (slider) => {
  let z = 300

  const layout = () => {
    const n = slider.slides.length || 1
    const first = slider.slides[0] as HTMLElement | undefined
    if (first && n > 1) {
      const h = first.clientHeight || 200 // use slide height for vertical ring
      z = Math.round((h / 2) / Math.tan(Math.PI / n))
    }

    const step = 360 / n
    slider.slides.forEach((el, idx) => {
      const node = el as HTMLElement
      node.style.transform = `rotateX(${step * idx}deg) translateZ(${z}px)`  // rotate around X
      node.style.transformOrigin = "50% 50%"
      node.style.backfaceVisibility = "hidden"
    })
    rotate()
  }

  const rotate = () => {
    const deg = 360 * slider.track.details.progress
    slider.container.style.transform = `translateZ(-${z}px) rotateX(${deg}deg)` // was rotateX(${-deg}deg)
    slider.container.style.transformStyle = "preserve-3d"
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
      // optional: mouse wheel control
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
