import Image from 'next/image';

interface UnsplashImageProps {
    query: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    alt?: string;
}

export default function UnsplashImage({
    query,
    width,
    height,
    fill = false,
    className = '',
    alt = 'Unsplash Image'
}: UnsplashImageProps) {
    // Construct Picsum URL
    const baseUrl = 'https://picsum.photos';
    const dimensions = fill ? '/1920/1080' : `/${width || 400}/${height || 300}`;
    const seed = query ? `?${encodeURIComponent(query)}` : '';
    const imageUrl = `${baseUrl}${dimensions}${seed}`;

    if (fill) {
        return (
            <Image
                src={imageUrl}
                alt={alt}
                className={className}
                fill
                sizes="100vw"
            />
        );
    }

    return (
        <Image
            src={imageUrl}
            alt={alt}
            width={width || 400}
            height={height || 300}
            className={className}
        />
    );
}
