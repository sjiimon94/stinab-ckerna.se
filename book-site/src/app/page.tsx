import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ValueProps from "@/components/ValueProps";
import BookDescription from "@/components/BookDescription";
import HowToBuy from "@/components/HowToBuy";
import PricingShipping from "@/components/PricingShipping";
import Policies from "@/components/Policies";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ValueProps />
        <BookDescription />
        <HowToBuy />
        <PricingShipping />
        <Policies />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
