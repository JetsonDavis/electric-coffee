import { useRef, useState, useEffect } from "react";
import ReactPlayer from "react-player/vimeo";

export default function AdminPage() {
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentVideo, setCurrentVideo] = useState("https://vimeo.com/1151293346");
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", artist: "", description: "" });
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

  const handleEdit = (video) => {
    setEditingId(video.id);
    setEditForm({
      title: video.title,
      artist: video.artist,
      description: video.description
    });
  };

  const handleSave = async (id) => {
    try {
      await fetch(`http://localhost:8005/api/videos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      
      setVideos(videos.map(v => 
        v.id === id ? { ...v, ...editForm } : v
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating video:', error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({ title: "", artist: "", description: "" });
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
        {/* Admin Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-white text-3xl font-bold">Admin Panel</h1>
          <a href="/" className="text-blue-400 hover:text-blue-300">View Public Page</a>
        </div>

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
              className="flex gap-4 bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              {/* Thumbnail - 300px width, 4:3 aspect ratio (225px height) */}
              <div 
                className="flex-shrink-0 border-4 border-white cursor-pointer hover:opacity-80 transition-opacity" 
                style={{ width: '300px' }}
                onClick={() => handleVideoClick(video.vimeo_url)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  style={{ aspectRatio: '4/3' }}
                />
              </div>

              {/* Video Description */}
              <div className="flex-1 p-4 flex flex-col justify-start items-start">
                {editingId === video.id ? (
                  <>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full bg-gray-700 text-white text-lg font-semibold mb-2 px-3 py-2 rounded"
                      placeholder="Video Title"
                    />
                    <input
                      type="text"
                      value={editForm.artist}
                      onChange={(e) => setEditForm({ ...editForm, artist: e.target.value })}
                      className="w-full bg-gray-700 text-gray-300 mb-3 px-3 py-2 rounded"
                      placeholder="Artist Name"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full bg-gray-700 text-gray-400 text-sm px-3 py-2 rounded mb-3"
                      rows="4"
                      placeholder="Description"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSave(video.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-white text-lg font-semibold mb-2">
                      {video.title}
                    </h3>
                    <p className="text-gray-400 mb-3">
                      Artist: <span className="text-gray-300">{video.artist}</span>
                    </p>
                    <p className="text-gray-400 text-sm line-clamp-4 mb-3">
                      {video.description}
                    </p>
                    <button
                      onClick={() => handleEdit(video)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-sm rounded transition-colors"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
