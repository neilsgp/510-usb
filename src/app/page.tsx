"use client";

import { useEffect, useState } from "react";

type Song = {
  id: number;
  title: string | null;
  originalLink: string;
  youtubeLink: string | null;
  timestamp: string;
};

export default function Home() {
  const [downloading, setDownloading] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchSongs = () => {
      fetch("/api/songs")
        .then((res) => res.json())
        .then((data) => setSongs(data));
    };
    fetchSongs();
    const interval = setInterval(fetchSongs, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    setDownloading(true);
    const originalLinks = songs.map((song) => song.originalLink);
    const blob = new Blob([JSON.stringify(originalLinks, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "songs-original-links.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-10 px-4 flex flex-col items-center text-white">
      <h1 className="text-3xl font-bold mb-6">510 USB 💾</h1>
      <div className="w-full max-w-xl bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">🍒</h2>
        <ul className="divide-y divide-gray-700">
          {songs.length === 0 ? (
            <li className="py-4 text-gray-400">No songs found.</li>
          ) : (
            songs.map((song) => (
              <li key={song.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {(song.originalLink.includes("spotify.com") || song.originalLink.includes("music.apple.com") || song.originalLink.includes("soundcloud.com")) ? (
                    <div style={{ maxWidth: "100%", overflow: "hidden", borderRadius: "8px", margin: "10px 0" }}>
                      {song.originalLink.includes("spotify.com") && (
                        <iframe
                          src={`https://open.spotify.com/embed/track/${song.originalLink.split("/track/")[1]?.split("?")[0]}`}
                          width="100%"
                          height="80"
                          frameBorder="0"
                          allow="encrypted-media"
                        ></iframe>
                      )}
                      {song.originalLink.includes("music.apple.com") && (
                        <iframe
                          src={`https://embed.music.apple.com/us/album/${song.originalLink.split("/album/")[1]?.split("?")[0]}`}
                          width="100%"
                          height="150"
                          frameBorder="0"
                          allow="encrypted-media"
                        ></iframe>
                      )}
                      {song.originalLink.includes("soundcloud.com") && (
                        <iframe
                          width="100%"
                          height="166"
                          scrolling="no"
                          frameBorder="no"
                          allow="autoplay"
                          src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(song.originalLink)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                        ></iframe>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-white">{song.title || song.originalLink}</div>
                      <div className="text-sm text-gray-300">{song.originalLink}</div>
                    </div>
                  )}
                  <div className="text-xs text-gray-400">{new Date(song.timestamp).toLocaleString()}</div>
                </div>
                {song.youtubeLink && (
                  <a
                    href={song.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 sm:mt-0 text-blue-400 hover:underline text-sm"
                  >
                    YouTube Link
                  </a>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="bg-blue-700 text-white px-6 py-2 rounded shadow hover:bg-blue-800 disabled:opacity-50"
      >
        {downloading ? "Downloading..." : "Export .json 🪩"}
      </button>
    </div>
  );
}
