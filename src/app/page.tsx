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
    const youtubeLinks = songs.map((song) => song.youtubeLink);
    const blob = new Blob([JSON.stringify(youtubeLinks, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "songs-youtube.json";
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
        <h2 className="text-xl font-semibold mb-4">Saved Songs</h2>
        <ul className="divide-y divide-gray-700">
          {songs.length === 0 ? (
            <li className="py-4 text-gray-400">No songs found.</li>
          ) : (
            songs.map((song) => (
              <li key={song.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-medium text-white">{song.title || "Untitled"}</div>
                  <div className="text-sm text-gray-300">{song.originalLink}</div>
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
        {downloading ? "Downloading..." : "Download YouTube JSON"}
      </button>
    </div>
  );
}
