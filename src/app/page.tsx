import { Hero } from "@/components/home/hero";
import { Highlights } from "@/components/home/highlights";
import { About } from "@/components/home/about";
import { FeaturedServices } from "@/components/home/featured-services";
import { Team } from "@/components/home/team";
import { GalleryPreview } from "@/components/home/gallery-preview";
import { Testimonials } from "@/components/home/testimonials";
import { CtaBanner } from "@/components/home/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Highlights />
      <About />
      <FeaturedServices />
      <Team />
      <GalleryPreview />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
