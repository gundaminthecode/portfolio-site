import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import "../../styles/portfolio-project-page.css"
import { useState } from "react"

type Props = {
  images: string[]
  alt?: string
  onImageClick?: (src: string, alt?: string) => void
}

export default function KeenImageCarousel({ images, alt = "carousel image", onImageClick }: Props) {
  const [current, setCurrent] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1, spacing: 12 },
    mode: "snap",
    drag: true,
    rubberband: false,
    slideChanged(s) {
      setCurrent(s.track.details.rel)
    },
  })

  const goTo = (idx: number) => instanceRef.current?.moveToIdx(idx)
  const prev = () => instanceRef.current?.prev()
  const next = () => instanceRef.current?.next()

  return (
    <div className="keen-image-carousel">
      <div ref={sliderRef} className="keen-slider">
        {images.map((src, i) => (
          <div className={`keen-slider__slide horizontal-keen-slider__slide`} key={i}>
            <img
              src={src}
              alt={alt}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
                objectFit: "contain",
                background: "#fff",
                cursor: onImageClick ? "pointer" : undefined,
              }}
              onClick={() => onImageClick?.(src, alt)}
            />
          </div>
        ))}
        <button
          className="keen-arrow keen-arrow--left"
          onClick={prev}
          aria-label="Previous image"
        >
          {"<"}
        </button>
        <button
          className="keen-arrow keen-arrow--right"
          onClick={next}
          aria-label="Next image"
        >
          {">"}
        </button>
      </div>
      <div className="keen-pagination">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`keen-dot${current === idx ? " is-active" : ""}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}