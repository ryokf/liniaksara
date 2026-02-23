import Image from 'next/image';

interface CreatorAvatarProps {
    imageUrl: string;
    alt: string;
}

export default function CreatorAvatar({ imageUrl, alt }: CreatorAvatarProps) {
    return (
        <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden">
            <Image
                src={imageUrl}
                alt={alt?.trim() ? alt : "Profile picture of the creator"}
                width={112}
                height={112}
                className="w-full h-full object-cover"
            />
        </div>
    );
}
