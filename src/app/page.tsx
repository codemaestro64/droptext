import HeroSection from "@/components/Home/HeroSection";
import EditorSection from "@/components/Home/EditorSection";
import FeaturesSection from "@/components/Home/FeaturesSection";

export default function Home() {
  return (
    <div className="py-6">
      <HeroSection />
      <EditorSection />
      <FeaturesSection />
    </div>
  );
}
