import React, { useState } from "react";
import { Copy, Check, Palette, Contrast, AlertCircle } from "lucide-react";

export default function ColorPickerTool() {
  const [color, setColor] = useState("#2563eb");
  const [textColor, setTextColor] = useState("#ffffff");
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Conversion Helpers
  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;
    let k = Math.min(c, m, y);

    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    c = Math.round(((c - k) / (1 - k)) * 100);
    m = Math.round(((m - k) / (1 - k)) * 100);
    y = Math.round(((y - k) / (1 - k)) * 100);
    k = Math.round(k * 100);

    return { c, m, y, k };
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
  const cmykString = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

  const handleCopy = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Contrast Ratio Calculations (WCAG 2.1 Guidelines)
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const getContrastRatio = (color1: string, color2: string) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
    const brightest = Math.max(l1, l2);
    const darkest = Math.min(l1, l2);
    return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
  };

  const contrastRatio = Number(getContrastRatio(color, textColor));

  const getContrastAssessment = () => {
    if (contrastRatio >= 7) return { text: "Passes AAA Standards Excellent Contrast ✨", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
    if (contrastRatio >= 4.5) return { text: "Passes AA Standards Normal Body Text ✔", color: "text-blue-600 bg-blue-50 border-blue-100" };
    if (contrastRatio >= 3) return { text: "Passes Large Text Only (3.0+ Baseline)", color: "text-amber-600 bg-amber-50 border-amber-100" };
    return { text: "Fails WCAG Contrast Requirements ❌", color: "text-red-600 bg-red-50 border-red-100" };
  };

  const assessment = getContrastAssessment();

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm" id="color-picker-card">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Picker & Spectrum Output */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-800 text-sm">Interactive Color Spectrum</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <input
              type="color"
              className="w-32 h-32 rounded-2xl border border-gray-200 cursor-pointer shadow-sm p-1.5 bg-white"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <div className="flex-1 w-full space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Adjust Hex Value</label>
                <input
                  type="text"
                  maxLength={7}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 outline-none text-sm font-mono text-gray-800 uppercase"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div
                className="h-12 rounded-xl border border-gray-100 shadow-inner flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: color, color: hsl.l > 55 ? "#111827" : "#ffffff" }}
              >
                Color Swatch Preview
              </div>
            </div>
          </div>

          {/* Formats Copy list */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block">
              Color Format Output Values
            </span>

            {[
              { label: "HEX Code", val: color.toUpperCase(), name: "hex" },
              { label: "RGB Format", val: rgbString, name: "rgb" },
              { label: "HSL Format", val: hslString, name: "hsl" },
              { label: "CMYK Print", val: cmykString, name: "cmyk" }
            ].map((f) => (
              <div key={f.name} className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-sm">
                <div>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 block">{f.label}</span>
                  <span className="font-mono font-medium text-gray-800">{f.val}</span>
                </div>
                <button
                  onClick={() => handleCopy(f.val, f.name)}
                  className="p-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg shadow-sm transition active:scale-95"
                >
                  {copiedFormat === f.name ? (
                    <Check className="w-3.5 h-3.5 text-green-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-gray-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: WCAG Contrast Ratio Checker */}
        <div className="space-y-6 lg:border-l lg:border-gray-100 lg:pl-8">
          <div className="flex items-center gap-3">
            <Contrast className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-gray-800 text-sm">WCAG 2.1 Contrast Checker</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Background Color</label>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <input
                  type="color"
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
                <span className="font-mono text-xs uppercase font-medium">{color}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Text Color</label>
              <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-100">
                <input
                  type="color"
                  className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
                <span className="font-mono text-xs uppercase font-medium">{textColor}</span>
              </div>
            </div>
          </div>

          {/* Interactive Contrast Card */}
          <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-8 text-center" style={{ backgroundColor: color, color: textColor }}>
              <p className="text-xl font-bold">Contrast Sample Title</p>
              <p className="text-sm mt-2 opacity-90">
                This block validates text legibility in real-time. Adjust colors to view standards scoring.
              </p>
            </div>
          </div>

          {/* Assessment metrics */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-500 font-semibold">Contrast Ratio:</span>
              <span className="font-mono font-black text-xl text-gray-800 bg-gray-50 px-3 py-1 rounded-xl border border-gray-100">
                {contrastRatio} : 1
              </span>
            </div>

            <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${assessment.color}`}>
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{assessment.text}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
