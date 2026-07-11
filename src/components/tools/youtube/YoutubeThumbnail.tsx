import React, { useState } from "react";
import { Youtube, Search, Download, Copy, Check, FileImage, ExternalLink, RefreshCw } from "lucide-react";

export default function YoutubeThumbnail() {
  const [videoUrl, setVideoUrl] = useState("");
  const [extractedId, setExtractedId] = useState<string | null>(null);
  const [copiedRes, setCopiedRes] = useState<string | null>(null);

  // Parse YouTube video ID from URL
  const extractVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    // Try matching raw 11 character IDs as fallback
    const rawIdMatch = url.trim().match(/^([a-zA-Z0-9_-]{11})$/);
    if (rawIdMatch) {
      return rawIdMatch[1];
    }
    return null;
  };

  const handleExtract = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(videoUrl);
    setExtractedId(id);
  };

  const handleClear = () => {
    setVideoUrl("");
    setExtractedId(null);
  };

  const copyToClipboard = (text: string, resKey: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedRes(resKey);
      setTimeout(() => setCopiedRes(null), 1500);
    });
  };

  const resolutionTiers = extractedId ? [
    {
      key: "max",
      name: "Ultra HD (1280x720)",
      description: "Ideal crisp quality for high-resolution screens and print graphics.",
      url: `https://img.youtube.com/vi/${extractedId}/maxresdefault.jpg`
    },
    {
      key: "hq",
      name: "High Quality (480x360)",
      description: "Optimized resolution for standard web displays and fast loading speed.",
      url: `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`
    },
    {
      key: "mq",
      name: "Medium Quality (320x180)",
      description: "Compact web resolution commonly used in lateral search listings.",
      url: `https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`
    },
    {
      key: "default",
      name: "Default Quality (120x90)",
      description: "Miniature thumbnail asset size perfect for widgets and small layouts.",
      url: `https://img.youtube.com/vi/${extractedId}/default.jpg`
    }
  ] : [];

  return (
    <div className="space-y-8 animate-fade-in" id="youtube-thumbnail-tool">
      
      {/* Tool Header */}
      <div className="border-b border-gray-100 dark:border-gray-800 pb-5">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">YouTube Thumbnail Extractor</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Instantly extract and download cover thumbnails from any YouTube video in multiple high-definition resolutions. 100% free and client-side.</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* URL Input Area */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
          <form onSubmit={handleExtract} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">
                Paste YouTube Video Link or Video ID
              </label>
              <div className="flex gap-2 flex-col sm:flex-row">
                <div className="relative flex-1">
                  <Youtube className="w-5 h-5 text-red-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none text-xs font-semibold"
                    placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 shrink-0">
                  {extractedId && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-4 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold border border-gray-100 dark:border-gray-700 cursor-pointer transition"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 shadow-sm"
                  >
                    <Search className="w-4 h-4" />
                    Extract Images
                  </button>
                </div>
              </div>
            </div>
          </form>

          {videoUrl && !extractedId && (
            <div className="text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-1.5 px-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>Supports shorts, channel uploads, embedding formats, and simple 11-char strings.</span>
            </div>
          )}
        </div>

        {/* Extracted Thumbnails Display */}
        {extractedId ? (
          <div className="space-y-6">
            
            {/* ID Extracted Banner */}
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-100 dark:border-emerald-900/50 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <FileImage className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">Extracted Video ID:</span>
                <span className="font-mono bg-white dark:bg-gray-800 px-2 py-0.5 rounded border border-emerald-100 dark:border-gray-700 text-[11px] select-all font-semibold">
                  {extractedId}
                </span>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${extractedId}`}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
              >
                Watch Video
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Resolutions Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {resolutionTiers.map((tier) => (
                <div
                  key={tier.key}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-4 border-b border-gray-50 dark:border-gray-850">
                    <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{tier.name}</span>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">{tier.description}</p>
                  </div>

                  {/* Thumbnail Preview Area */}
                  <div className="bg-gray-100 dark:bg-gray-950 aspect-video relative group overflow-hidden flex items-center justify-center">
                    <img
                      src={tier.url}
                      alt={tier.name}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain transition duration-200 group-hover:scale-102"
                      onError={(e) => {
                        // Some videos don't have maxresdefault. Fallback image message
                        (e.currentTarget as HTMLImageElement).src = "https://placehold.co/600x400/1e293b/94a3b8?text=Resolution+Not+Available";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition duration-200">
                      <a
                        href={tier.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white rounded-full text-gray-800 hover:text-blue-600 transition"
                        title="View Fullsize"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="p-4 flex gap-2">
                    <button
                      onClick={() => copyToClipboard(tier.url, tier.key)}
                      className="flex-1 py-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedRes === tier.key ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Link
                        </>
                      )}
                    </button>
                    <a
                      href={tier.url}
                      download={`youtube_thumbnail_${extractedId}_${tier.key}.jpg`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer text-center"
                    >
                      <Download className="w-3.5 h-3.5" />
                      View Image
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* Static Tips / Guidance Panel when empty */
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">Thumbnail Specifications Checklist</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-gray-700 dark:text-gray-200 block">Recommended Dimensions</span>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">YouTube thumbnails should have a pixel size of <strong>1280x720</strong> (minimum width of 640 pixels). Try to stick to an aspect ratio of <strong>16:9</strong>.</p>
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-gray-700 dark:text-gray-200 block">Format & File Weight Limits</span>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Thumbnails must be saved in standard image formats such as <strong>JPG, GIF, BMP, or PNG</strong>. The maximum allowed file weight is <strong>2MB</strong>.</p>
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-gray-700 dark:text-gray-200 block">Contrasts & Safe Text Boundaries</span>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Always place important text overlays away from the bottom right corner, as the <strong>timestamp bubble</strong> will overlay and cover up text.</p>
              </div>
              <div className="space-y-1.5">
                <span className="font-bold text-gray-700 dark:text-gray-200 block">How extraction works</span>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">We process links client-side to find the Video ID, fetching from YouTube's raw public CDN server, ensuring your actions are never logged.</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
