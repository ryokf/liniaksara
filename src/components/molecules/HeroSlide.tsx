import UnsplashImage from '../atoms/UnsplashImage';

interface HeroSlideProps {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    rating?: string;
    isActive: boolean;
    onWatch: () => void;
    onAdd: () => void;
}

export default function HeroSlide({
    title,
    subtitle,
    description,
    rating,
    isActive,
    onWatch,
    onAdd
}: HeroSlideProps) {
    return (
        <div
            className={`relative w-full h-screen transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <UnsplashImage
                    query={``}
                    fill
                    className="object-cover "
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full max-w-10/12 mx-auto px-6 lg:px-8 flex flex-col justify-center">
                <div className="max-w-3xl space-y-6">
                    {subtitle && (
                        <p className="text-lg font-semibold text-gray-300">
                            {subtitle}
                        </p>
                    )}

                    <h1 className="text-4xl md:text-6xl font-bold text-white">
                        {title}
                    </h1>

                    {rating && (
                        <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-gray-800/80 text-white text-sm rounded">
                                {rating}
                            </span>
                        </div>
                    )}

                    <p className="text-lg text-gray-300 line-clamp-3">
                        {description}
                    </p>

                    <div className="flex items-center space-x-4 pt-4">
                        <button
                            onClick={onWatch}
                            className="px-8 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-100 transition-colors"
                        >
                            ▶ Watch Now
                        </button>

                        <button
                            onClick={onAdd}
                            className="p-3 bg-gray-800/80 text-white rounded-full hover:bg-gray-700/80 transition-colors"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
