import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download, Copy, RotateCcw, Check, QrCode } from "lucide-react";

export default function QRCodeGenerator() {
  const [text, setText] = useState("https://toolmora.com");
  const [qrUrl, setQrUrl] = useState("");
  const [size, setSize] = useState(256);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#000000");
  const [margin, setMargin] = useState(2);
  const [copied, setCopied] = useState(false);

  const generateQRCode = async () => {
    if (!text.trim()) {
      setQrUrl("");
      return;
    }
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [text, size, bgColor, fgColor, margin]);

  const handleDownload = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `toolmora-qr-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = async () => {
    if (!qrUrl) return;
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleReset = () => {
    setText("https://toolmora.com");
    setSize(256);
    setBgColor("#ffffff");
    setFgColor("#000000");
    setMargin(2);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="qr-code-generator-card">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Text or URL
            </label>
            <textarea
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition duration-150 font-sans text-sm resize-none"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste link or type text here..."
              id="qr-input-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                QR Code Size
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
              >
                <option value={128}>128 x 128 px</option>
                <option value={256}>256 x 256 px</option>
                <option value={512}>512 x 512 px</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiet Zone (Margin)
              </label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
              >
                <option value={1}>Small (1)</option>
                <option value={2}>Default (2)</option>
                <option value={4}>Wide (4)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foreground Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-xs font-mono uppercase"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-xs font-mono uppercase"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm transition duration-150 font-medium active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Settings
            </button>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-200 min-h-[300px]">
          {qrUrl ? (
            <div className="space-y-6 text-center">
              <div className="bg-white p-4 rounded-2xl shadow-sm inline-block border border-gray-100">
                <img
                  src={qrUrl}
                  alt="QR Code Preview"
                  className="mx-auto rounded-lg"
                  style={{ width: "200px", height: "200px" }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition duration-150 shadow-sm active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  Download PNG
                </button>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-medium text-sm transition duration-150 shadow-sm active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Data URL
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
              <QrCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
              Enter text to generate a preview
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
