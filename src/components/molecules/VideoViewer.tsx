import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Play, 
    Pause, 
    Volume2, 
    VolumeX,
    Settings,
    Maximize,
    SkipBack,
    SkipForward,
    List
} from 'lucide-react';
import { Episode } from '@/types/episode';
import NextEpisodeOverlay from './NextEpisodeOverlay';
import '@/styles/video-player.css';

interface VideoViewerProps {
    episode: Episode;
}

export default function VideoViewer({
    episode
}: VideoViewerProps) {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');
    const [showNextEpisode, setShowNextEpisode] = useState(false);

    // Register ended handler and cleanup
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.addEventListener('ended', handleEnded);
        return () => {
            video.removeEventListener('ended', handleEnded);
        };
    }, []);

    const handleEnded = () => {
        setShowNextEpisode(true);
        setShowControls(true);
        setIsPlaying(false);
        if (videoRef.current) {
            setProgress(100);
            setCurrentTime(formatTime(videoRef.current.duration || 0));
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
            setCurrentTime(formatTime(videoRef.current.currentTime));
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(formatTime(videoRef.current.duration));
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (progressRef.current && videoRef.current) {
            const rect = progressRef.current.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            videoRef.current.currentTime = percent * videoRef.current.duration;
        }
    };

    const handleFullscreen = () => {
        const container = videoRef.current?.parentElement;
        if (container) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                container.requestFullscreen();
            }
        }
    };

    console.log("episode:", episode);

    return (
        <div className="min-h-screen bg-black flex flex-col w-full">
            {/* Top Navigation */}
            <nav className={`
                fixed top-0 left-0 right-0 z-50 transition-transform duration-300
                ${showControls ? 'translate-y-0' : '-translate-y-full'}
            `}>
                <div className="bg-gray-900/80 backdrop-blur-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-4">
                                <h1 className="text-white font-medium">
                                    {episode?.title || episode?.work?.title || 'Loading...'}
                                </h1>
                                <span className="text-gray-400">
                                    Episode {episode?.part_order || '-'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Video Container */}
            <div 
                className="flex-1 w-full relative flex items-center justify-center bg-black"
                onMouseMove={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
            >
                <video
                    ref={videoRef}
                    src={episode?.content_url}
                    className="max-h-screen w-screen"
                    onClick={togglePlay}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    poster={episode?.thumbnail_url}
                    onEnded={handleEnded}
                />

                {/* Video Controls */}
                <div className={`
                    absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent
                    px-4 py-4 transition-opacity duration-300
                    ${showControls ? 'opacity-100' : 'opacity-0'}
                `}>
                    {/* Progress Bar */}
                    <div 
                        ref={progressRef}
                        className="relative h-1 bg-gray-600 cursor-pointer mb-4"
                        onClick={handleProgressClick}
                    >
                        <div 
                            className="absolute h-full bg-primary"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Play/Pause */}
                            <button 
                                onClick={togglePlay}
                                className="text-white hover:text-primary transition-colors"
                            >
                                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                            </button>

                            {/* Skip Buttons */}
                            {episode?.previous_part_id && episode?.work_id && (
                                <button 
                                    onClick={() => router.push(`/watch/${episode.work_id}/${episode.previous_part_id}`)}
                                    className="text-white hover:text-primary transition-colors"
                                >
                                    <SkipBack size={24} />
                                </button>
                            )}
                            
                            {episode?.next_part_id && episode?.work_id && (
                                <button 
                                    onClick={() => router.push(`/watch/${episode.work_id}/${episode.next_part_id}`)}
                                    className="text-white hover:text-primary transition-colors"
                                >
                                    <SkipForward size={24} />
                                </button>
                            )}

                            {/* Volume */}
                            <button 
                                onClick={toggleMute}
                                className="text-white hover:text-primary transition-colors"
                            >
                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                            </button>

                            {/* Time */}
                            <div className="text-white text-sm">
                                <span>{currentTime}</span>
                                <span className="mx-1">/</span>
                                <span>{duration}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Settings */}
                            <button className="text-white hover:text-primary transition-colors">
                                <Settings size={24} />
                            </button>

                            {/* Fullscreen */}
                            <button 
                                onClick={handleFullscreen}
                                className="text-white hover:text-primary transition-colors"
                            >
                                <Maximize size={24} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Next Episode Overlay */}
                {showNextEpisode && episode?.next_part_id && (
                    <NextEpisodeOverlay
                        nextEpisodeId={episode.next_part_id}
                        workId={episode.work_id}
                        title={`${episode.work?.title} - Episode ${Number(episode.part_order) + 1}`}
                        thumbnailUrl={episode.thumbnail_url}
                        onDismiss={() => setShowNextEpisode(false)}
                    />
                )}
            </div>
        </div>
    );
}
