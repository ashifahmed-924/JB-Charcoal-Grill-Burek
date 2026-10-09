import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import KineticStrip from "@/components/sections/KineticStrip";
import FoodCategories from "@/components/sections/FoodCategories";
import FeaturedDishes from "@/components/sections/FeaturedDishes";
import OurStory from "@/components/sections/OurStory";
import MenuBoard from "@/components/sections/MenuBoard";
import FireExperience from "@/components/sections/FireExperience";
import BurekFeature from "@/components/sections/BurekFeature";
import FoodGallery from "@/components/sections/FoodGallery";
import Reviews from "@/components/sections/Reviews";
import VisitUs from "@/components/sections/VisitUs";
import OrderCTA from "@/components/sections/OrderCTA";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <KineticStrip />
        <FoodCategories />
        <FeaturedDishes />
        <OurStory />
        <MenuBoard />
        <FireExperience />
        <BurekFeature />
        <FoodGallery />
        <Reviews />
        <VisitUs />
        <OrderCTA />
      </main>
      <Footer />
    </>
  );
}
