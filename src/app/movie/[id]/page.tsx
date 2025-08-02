import MovieDetailTemplate from '@/components/templates/MovieDetailTemplate';

// Mock data - nanti bisa diganti dengan data dari API
const mockMovieData = {
    title: "Judul Anime",
    category: "Anime & Drama",
    releaseDate: "12 Desember 2024",
    duration: "24m per episode",
    rating: "4.8",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    coverImage: "https://images.unsplash.com/photo-1753808645481-070fba323120?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genres: ["Action", "Adventure", "Fantasy"],
    cast: "John Doe, Jane Smith, Bob Wilson",
    director: "Christopher Nolan",
    studio: "Studio Ghibli",
    seasons: [
        {
            number: 1,
            episodes: [
                {
                    id: "1",
                    seasonNumber: 1,
                    episodeNumber: 1,
                    title: "Bagian 1: judul bagian",
                    thumbnail: "/images/movies/ep1.jpg",
                    duration: "24:00",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
                },
                {
                    id: "2",
                    seasonNumber: 1,
                    episodeNumber: 2,
                    title: "Bagian 2: judul bagian",
                    thumbnail: "/images/movies/ep2.jpg",
                    duration: "24:00",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
                }
            ]
        },
        {
            number: 2,
            episodes: [
                {
                    id: "3",
                    seasonNumber: 2,
                    episodeNumber: 1,
                    title: "Bagian 1: judul bagian",
                    thumbnail: "/images/movies/ep3.jpg",
                    duration: "24:00",
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
                }
            ]
        }
    ]
};

export default function MovieDetailPage() {
    return <MovieDetailTemplate {...mockMovieData} />;
}
