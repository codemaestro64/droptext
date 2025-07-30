import HeroSection from "@/components/HomePage/HeroSection";
import EditorSection from "@/components/HomePage/EditorSection";
import FeaturesSection from "@/components/HomePage/FeaturesSection";

const Home = () => {
  return (
    <div className="py-6">
      <HeroSection />
      <EditorSection />
      <FeaturesSection />
    </div>
  );
}

export default Home
