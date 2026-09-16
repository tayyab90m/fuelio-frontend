import React, { useRef, useEffect } from 'react';
import vid1 from '../../assets/images/vid1.mp4'
import vid2 from '../../assets/images/vid2.mp4';
import vid3 from '../../assets/images/vid3.mp4';

interface VideoPlayerProps {
  isUserInteracted: boolean;
  onUserInteraction: () => void;
}


const VideoPlayer: React.FC<VideoPlayerProps> = ({
  isUserInteracted,
  onUserInteraction,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoSources = [vid1, vid2, vid3];
  const [currentVideoIndex, setCurrentVideoIndex] = React.useState(0);

  const handleVideoEnd = () => {
    if (currentVideoIndex < videoSources.length - 1) {
      setCurrentVideoIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentVideoIndex(0); // Loop back to the first video
    }
  };

  useEffect(() => {
    if (isUserInteracted && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => console.error('Play failed:', err));
    }
  }, [currentVideoIndex, isUserInteracted]);

  return (
    <div
      className="fixed inset-0 z-[-1] flex items-center justify-center"
      onClick={onUserInteraction}
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
      >
        <source src={videoSources[currentVideoIndex]} type="video/mp4" />
      </video>
    </div>

  );
};

export default VideoPlayer;
