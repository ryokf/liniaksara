import { useState, useRef } from 'react';
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

interface VideoViewerProps {
    videoUrl: string;
    title: string;
    episodeNumber: number;
    onNavigateEpisode?: (direction: 'prev' | 'next') => void;
    hasNextEpisode?: boolean;
    hasPrevEpisode?: boolean;
}

export default function VideoViewer({
    videoUrl,
    title,
    episodeNumber,
    onNavigateEpisode,
    hasNextEpisode = false,
    hasPrevEpisode = false,
}: VideoViewerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [currentTime, setCurrentTime] = useState('0:00');
    const [duration, setDuration] = useState('0:00');

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
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col">
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
                                    {title}
                                </h1>
                                <span className="text-gray-400">
                                    Episode {episodeNumber}
                                </span>
                            </div>

                            <button 
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                title="Episodes List"
                            >
                                <List size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Video Container */}
            <div 
                className="flex-1 relative flex items-center justify-center bg-black"
                onMouseMove={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
            >
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="max-h-screen w-full"
                    onClick={togglePlay}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
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
                            <button 
                                onClick={() => onNavigateEpisode?.('prev')}
                                disabled={!hasPrevEpisode}
                                className="text-white hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <SkipBack size={24} />
                            </button>
                            
                            <button 
                                onClick={() => onNavigateEpisode?.('next')}
                                disabled={!hasNextEpisode}
                                className="text-white hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <SkipForward size={24} />
                            </button>

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
            </div>
        </div>
    );
}
