import { useEffect, useState } from "react";
import Header from "../molecules/landingPage/Header";
import { FaArrowUp } from "react-icons/fa";
import Button from "../atoms/Button";
import Hero from "../molecules/landingPage/Hero";
import WhyLiniAksara from "../molecules/landingPage/WhyLiniAksara";
import ContentShowcase from "../molecules/landingPage/ContentShowcase";
import Footer from "../molecules/landingPage/Footer";
import FeaturedFeatures from "../molecules/landingPage/FeaturedFeatures";


export default function LandingPage() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isDark = localStorage.getItem("theme") === "dark";
            setIsDarkMode(isDark);
            document.documentElement.classList.toggle("dark", isDark);
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", newMode ? "dark" : "light");
            document.documentElement.classList.toggle("dark", newMode);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const onOpen = (type: "login" | "signup") => {
        console.log(`Opening ${type} modal`);
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <Header
                onOpen={onOpen}
            />

            <Button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 z-50"
                ariaLabel="Scroll to Top"
            >
                <FaArrowUp />
            </Button>

            <Hero onOpen={onOpen} />

            <FeaturedFeatures />

            <WhyLiniAksara />

            <ContentShowcase />

            <Footer />
        </div>
    );
}
