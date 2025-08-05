import ProfileTemplate from '@/components/templates/ProfileTemplate';

type WorkType = 'book' | 'image' | 'video';

const mockProfile = {
    name: "Nama kreator",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    avatar: "/images/avatars/creator.jpg",
    worksCount: 20,
    followersCount: 20,
    followingCount: 20
};

const mockWorks = [
    {
        id: "1",
        title: "React Project Practical Tutorial",
        type: "Novel",
        workType: "book" as WorkType,
        thumbnail: "/images/works/novel1.jpg",
        date: "15 september 2024",
        href: "/novel/1"
    },
    {
        id: "2",
        title: "React Project Practical Tutorial",
        type: "Komik",
        workType: "book" as WorkType,
        thumbnail: "/images/works/comic1.jpg",
        date: "15 september 2024",
        href: "/comic/1"
    },
    {
        id: "3",
        title: "Beautiful Landscape",
        type: "Illustration",
        workType: "image" as WorkType,
        thumbnail: "/images/works/art1.jpg",
        date: "15 september 2024",
        href: "/art/1"
    },
    {
        id: "4",
        title: "Adventure Series",
        type: "Series",
        workType: "video" as WorkType,
        thumbnail: "/images/works/video1.jpg",
        date: "15 september 2024",
        href: "/video/1"
    }
];

export default function ProfilePage() {
    return (
        <ProfileTemplate 
            profile={mockProfile}
            works={mockWorks}
        />
    );
}
