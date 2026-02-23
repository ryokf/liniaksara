import Image from 'next/image';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
    className?: string;
}

export default function Logo({
    size = 'md',
    showText = true,
    className = '',
}: LogoProps) {
    const sizeMap = {
        sm: { img: 32, text: 'text-xl' },
        md: { img: 40, text: 'text-2xl' },
        lg: { img: 48, text: 'text-3xl' },
    };

    return (
        <div className={`flex items-center space-x-3 flex-shrink-0 ${className}`}>
            <Image
                src="/logo.png"
                alt="Logo Inkura"
                width={sizeMap[size].img}
                height={sizeMap[size].img}
            />
            {showText && (
                <span className={`${sizeMap[size].text} font-bold text-gray-800 dark:text-white tracking-wide`}>
                    LINIAKSARA
                </span>
            )}
        </div>
    );
}
