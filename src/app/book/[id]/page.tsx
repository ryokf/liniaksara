import ComicDetailTemplate from '../../../components/templates/ComicDetailTemplate';


// Mock data - nanti bisa diganti dengan data dari API
const mockComicData = {
    title: "Judul Komik",
    category: "Comic",
    releaseDate: "12 Desember 2024",
    rating: "4.8",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "/images/comics/cover.jpg",
    genres: ["Action", "Adventure", "Fantasy"],
    artist: "Jane Doe",
    author: "John Smith",
    publisher: "Elex Media",
    seasons: [
        {
            number: 1,
            episodes: [
                {
                    id: "1",
                    chapterNumber: 1,
                    title: "Chapter 1: The Beginning",
                    thumbnail: "/images/comics/ch1.jpg",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                },
                {
                    id: "2",
                    chapterNumber: 2,
                    title: "Chapter 2: The Journey",
                    thumbnail: "/images/comics/ch2.jpg",
                    description: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                }
            ]
        },
        {
            number: 2,
            episodes: [
                {
                    id: "3",
                    chapterNumber: 3,
                    title: "Chapter 3: New Arc",
                    thumbnail: "/images/comics/ch3.jpg",
                    description: "Ut enim ad minim veniam, quis nostrud exercitation."
                }
            ]
        }
    ]
};

export default function ComicDetailPage() {
    return <ComicDetailTemplate {...mockComicData} />;
}
