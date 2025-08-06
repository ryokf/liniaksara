"use client";

import HomeTemplate from "@/components/templates/HomeTemplate";
import Navbar from '@/components/molecules/Navbar';
import Footer from '../../components/molecules/landingPage/Footer';
// Lakukan ini di komponen client (file dengan 'use client')
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Di dalam komponen React Anda
const supabase = createClientComponentClient()
export default function HomePage() {

  return (
    <>
      <Navbar />
      <HomeTemplate />
      <Footer></Footer>
    </>
  );
}