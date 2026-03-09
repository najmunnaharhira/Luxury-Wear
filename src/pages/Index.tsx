import Header from "@/components/Header";
import HeroSlideshow from "@/components/HeroSlideshow";
import MarqueeBanner from "@/components/MarqueeBanner";
import FeaturedSection from "@/components/FeaturedSection";
import NewArrivals from "@/components/NewArrivals";
import CategorySection from "@/components/CategorySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSlideshow />
        <MarqueeBanner />
        <FeaturedSection />
        <NewArrivals />
        <CategorySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;