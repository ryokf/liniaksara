import { useState, useRef, useEffect } from 'react';
import { useMotionValue, motion, animate, AnimatePresence } from 'framer-motion';
import CarouselButton from '../atoms/CarouselButton';
import CarouselDot from '../atoms/CarouselDot';
import MediaCard, { MediaItemProps } from '../molecules/MediaCard';
import Heading from '../atoms/Heading';

interface MediaCarouselProps {
    title: string;
    items: MediaItemProps[];
}

export default function MediaCarousel({ title, items }: MediaCarouselProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [constraintLeft, setConstraintLeft] = useState(0);
    const [constraintRight, setConstraintRight] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);

    const ITEMS_PER_PAGE = 5;
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);

    useEffect(() => {
        if (carouselRef.current) {
            const { width } = carouselRef.current.getBoundingClientRect();
            const maxScroll = -(items.length * 220 - width); // 200px width + 20px gap
            setConstraintLeft(0);
            setConstraintRight(maxScroll);
        }
    }, [items.length]);

    const slideTo = (page: number) => {
        const newPage = Math.max(0, Math.min(page, totalPages - 1));
        setCurrentPage(newPage);

        if (carouselRef.current) {
            const { width } = carouselRef.current.getBoundingClientRect();
            const targetX = -newPage * width;
            animate(x, targetX, {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            });
        }
    };

    return (
        <div className="py-8">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6">
                    <Heading level={2} className="text-gray-900 dark:text-white">
                        {title}
                    </Heading>

                    <div className="flex items-center space-x-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <CarouselDot
                                key={i}
                                isActive={currentPage === i}
                                onClick={() => slideTo(i)}
                            />
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <div
                        ref={carouselRef}
                        className="overflow-hidden"
                    >
                        <motion.div
                            style={{ x }}
                            drag="x"
                            dragConstraints={{
                                left: constraintRight,
                                right: constraintLeft,
                            }}
                            className="flex space-x-5"
                        >
                            {items.map((item) => (
                                <MediaCard key={item.id} {...item} className='!w-[200px]' />
                            ))}
                        </motion.div>
                    </div>

                    <AnimatePresence>
                        {currentPage > 0 && (
                            <CarouselButton
                                direction="prev"
                                onClick={() => slideTo(currentPage - 1)}
                            />
                        )}
                        {currentPage < totalPages - 1 && (
                            <CarouselButton
                                direction="next"
                                onClick={() => slideTo(currentPage + 1)}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
