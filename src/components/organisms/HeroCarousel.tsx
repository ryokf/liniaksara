import { useState, useEffect, useCallback } from 'react';
import HeroSlide from '../molecules/HeroSlide';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroItem {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    image: string;
    rating?: string;
}

interface HeroCarouselProps {
    items: HeroItem[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    }, []);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((current) => (current - 1 + items.length) % items.length);
        setIsAutoPlaying(false);
    }, [items.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((current) => (current + 1) % items.length);
        setIsAutoPlaying(false);
    }, [items.length]);

    const handleMouseEnter = useCallback(() => setIsAutoPlaying(false), []);
    const handleMouseLeave = useCallback(() => setIsAutoPlaying(true), []);

    useEffect(() => {
        if (!isAutoPlaying || items.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((current) => (current + 1) % items.length);
        }, 6000); // Change slide every 6 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying, items.length]);

    if (items.length === 0) return null;

    return (
        <div
            className="relative hidden sm:block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Slides */}
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {items.map((item) => (
                        <div className="min-w-full" key={item.id}>
                            <HeroSlide
                                {...item}
                                isActive
                                onWatch={() => console.log('Watch:', item.title)}
                                onAdd={() => console.log('Add to list:', item.title)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center space-x-2">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                            ? 'w-4 bg-white'
                            : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
