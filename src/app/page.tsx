"use client";

import { redirect } from "next/navigation";
import LandingPage from "@/components/organisms/LandingPage";
import { useAuth } from "@/contexts/AuthContext";

export default function RootPage() {
  const { userLogin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (userLogin) {
    return redirect("/home");
  }

  return <LandingPage />;

}