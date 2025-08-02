import NovelDetailTemplate from '@/components/templates/NovelDetailTemplate';

// Mock data - nanti bisa diganti dengan data dari API
const mockNovelData = {
    title: "Judul Novel",
    category: "Novel",
    releaseDate: "12 Desember 2024",
    rating: "4.8",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "/images/novels/cover.jpg",
    genres: ["Romance", "Drama", "Slice of Life"],
    author: "John Doe",
    publisher: "Gramedia",
    chapters: [
        {
            id: "1",
            chapterNumber: 1,
            title: "judul bab"
        },
        {
            id: "2",
            chapterNumber: 2,
            title: "judul bab"
        },
        {
            id: "3",
            chapterNumber: 3,
            title: "judul bab"
        },
        {
            id: "4",
            chapterNumber: 4,
            title: "judul bab"
        },
        {
            id: "5",
            chapterNumber: 5,
            title: "judul bab"
        }
    ]
};

export default function NovelDetailPage() {
    return <NovelDetailTemplate {...mockNovelData} />;
}
