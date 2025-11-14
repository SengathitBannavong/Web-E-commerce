import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import "./HeroSlider.css";

export default function HeroSlider({ slides = [], autoPlayInterval = 6000 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = slides.length;

  useEffect(() => {
    if (totalSlides === 0) {
      return undefined;
    }

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [totalSlides, autoPlayInterval]);

  useEffect(() => {
    if (activeIndex >= totalSlides) {
      setActiveIndex(0);
    }
  }, [activeIndex, totalSlides]);

  if (totalSlides === 0) {
    return null;
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <section className="hero-slider" aria-label="Chương trình nổi bật">
      <div className="hero-slide-track">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <article
              key={slide.id ?? index}
              className={`hero-slide${isActive ? " is-active" : ""}`}
              aria-hidden={!isActive}
            >
              <div className="hero-slide-media">
                <img
                  src={slide.image}
                  alt={`Banner ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            </article>
          );
        })}
      </div>

      {totalSlides > 1 ? (
        <>
          <button
            className="hero-nav hero-nav-prev"
            type="button"
            aria-label="Slide trước"
            onClick={handlePrev}
          >
            <ChevronLeft size={36} strokeWidth={2.5} />
          </button>
          <button
            className="hero-nav hero-nav-next"
            type="button"
            aria-label="Slide tiếp theo"
            onClick={handleNext}
          >
            <ChevronRight size={36} strokeWidth={2.5} />
          </button>

          <div className="hero-dots" role="tablist" aria-label="Chọn slide">
            {slides.map((slide, index) => (
              <button
                key={slide.id ?? index}
                type="button"
                className={`hero-dot${
                  index === activeIndex ? " is-active" : ""
                }`}
                aria-label={`Chọn slide ${index + 1}`}
                aria-pressed={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
