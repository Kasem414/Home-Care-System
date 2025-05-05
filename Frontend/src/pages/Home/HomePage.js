import React from "react";
import HeroSection from "../../components/home/HeroSection";
import FeaturedServices from "../../components/home/FeaturedServices";
import HowItWorks from "../../components/home/HowItWorks";
import TopProviders from "../../components/home/TopProviders";
import Testimonials from "../../components/home/Testimonials";
import CallToAction from "../../components/home/CallToAction";

function HomePage() {
  return (
    <main className="home-page">
      <HeroSection />
      <FeaturedServices />
      <HowItWorks />
      <TopProviders />
      <Testimonials />
      <CallToAction />
    </main>
  );
}

export default HomePage;
