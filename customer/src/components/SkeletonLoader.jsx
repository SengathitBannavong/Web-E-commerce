import './SkeletonLoader.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton--image"></div>
      <div className="skeleton-card__body">
        <div className="skeleton skeleton--title"></div>
        <div className="skeleton skeleton--text"></div>
        <div className="skeleton skeleton--text skeleton--text--short"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="skeleton-detail">
      <div className="skeleton-detail__image">
        <div className="skeleton skeleton--image-large"></div>
      </div>
      <div className="skeleton-detail__content">
        <div className="skeleton skeleton--title skeleton--title--large"></div>
        <div className="skeleton skeleton--text"></div>
        <div className="skeleton skeleton--text skeleton--text--short"></div>
        <div className="skeleton skeleton--button"></div>
        <div className="skeleton skeleton--paragraph"></div>
        <div className="skeleton skeleton--paragraph"></div>
        <div className="skeleton skeleton--paragraph skeleton--paragraph--short"></div>
      </div>
    </div>
  );
}
