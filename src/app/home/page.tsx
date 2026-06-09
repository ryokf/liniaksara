"use client";

import HomeTemplate from "@/components/templates/HomeTemplate";
import Navbar from '@/components/molecules/Navbar';
import Footer from '../../components/molecules/Footer';

export default function HomePage() {

  return (
    <>
      <Navbar />
      <HomeTemplate />
      <Footer></Footer>
    </>
  );
}