import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player/vimeo";

export default function VideoFirstPage() {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("https://vimeo.com/1151293346");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch('http://localhost:8005/api/videos');
      const data = await response.json();
      setVideos(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  const handleVideoClick = (vimeoUrl) => {
    setCurrentVideo(vimeoUrl);
    setPlaying(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setPlaying(true);
    }, 800);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-center text-white mb-6 font-['Pacifico']" style={{ fontSize: '72px' }}>
          Electric Coffee
        </h1>
        
        {/* Video Player Container */}
        <div className="bg-black rounded-lg overflow-hidden shadow-2xl mb-8">
          <div className="relative" style={{ paddingBottom: '56.25%' }}>
            <div className="absolute inset-0">
              <ReactPlayer
                ref={playerRef}
                url={currentVideo}
                playing={playing}
                controls={true}
                width="100%"
                height="100%"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                config={{
                  vimeo: {
                    playerOptions: {
                      byline: false,
                      portrait: false,
                      title: false,
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section - Video Details */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-xl mb-8">
          <div className="text-white font-['Caveat'] text-2xl leading-relaxed text-center">
            <p className="mb-6">
              Between the decade of greed and the birth of the World Wide Web, there was a moment when creativity and ideation converged on a burgeoning scene of independent coffee houses across America. New music, new ideas, new art blossomed as the last, short-lived new wave of American culture in the 20th century, and the last surge of expression before the electronic age. This television show, produced and presented entirely by volunteers in 1994, puts you there, in 1994 Los Angeles, in the middle of "the scene that's on caffeine"...
            </p>
            <p className="text-3xl font-bold">
              Electric Coffee
            </p>
          </div>
        </div>

        {/* Video Thumbnails Section */}
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex gap-4 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:bg-gray-750 transition-colors cursor-pointer"
              onClick={() => handleVideoClick(video.vimeo_url)}
            >
              {/* Thumbnail - 300px width, 4:3 aspect ratio (225px height) */}
              <div className="flex-shrink-0 border-4 border-white" style={{ width: '300px' }}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>

              {/* Video Description */}
              <div className="flex-1 p-4 flex flex-col justify-start items-start">
                <h3 className="text-white text-lg font-semibold mb-2">
                  {video.title}
                </h3>
                <p className="text-gray-400 mb-3">
                  Artist: <span className="text-gray-300">{video.artist}</span>
                </p>
                <p className="text-gray-400 text-sm line-clamp-4">
                  {video.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
