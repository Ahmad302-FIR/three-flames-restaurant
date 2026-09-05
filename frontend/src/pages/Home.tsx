import React from 'react';
import { Hero } from '../components/home/Hero';
import { RestaurantIntro } from '../components/home/RestaurantIntro';
import { SignatureDishes } from '../components/home/SignatureDishes';
import { MenuPreview } from '../components/home/MenuPreview';
import { WhyThreeFlames } from '../components/home/WhyThreeFlames';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CTASection } from '../components/home/CTASection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080604] text-[#FFF7ED]">
      <Hero />
      <RestaurantIntro />
      <SignatureDishes />
      <MenuPreview />
      <WhyThreeFlames />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};
