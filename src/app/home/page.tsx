"use client";

import HomeTemplate from "@/components/templates/HomeTemplate";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from '@/components/molecules/Navbar';
import Footer from '../../components/molecules/landingPage/Footer';

export default function HomePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/");
//     }
//   }, [status, router]);

//   if (status === "loading") {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

  return (
    <>
      <Navbar />
      <HomeTemplate />
      <Footer></Footer>
    </>
  );
}