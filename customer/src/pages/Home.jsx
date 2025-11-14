import HeroSlider from "../components/HeroSlider";
import BookSection from "../components/BookSection";
import Newsletter from "../components/Newsletter";

import { HERO_BANNERS } from "../data/heroBanners";
import { NEW_RELEASES } from "../data/newReleases";
import { BESTSELLERS } from "../data/bestsellers";

import "./Home.css";

export default function Home() {
  return (
    <div className="page home-page">
      <HeroSlider slides={HERO_BANNERS} />

      <main className="home-main-content">
        <BookSection title="Mới phát hành" books={NEW_RELEASES} withCta />

        <BookSection title="Bán chạy nhất" books={BESTSELLERS} withCta />

        <Newsletter />
      </main>
    </div>
  );
}
