import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { 
  FileText, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  FileCode,
  Sliders,
  Type
} from "lucide-react";

export default function TextToPdf() {
  const [title, setTitle] = useState("Professional Document Title");
  const [subtitle, setSubtitle] = useState("An elegant summary or subtitle for this report");
  const [author, setAuthor] = useState("Jane Doe");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [bodyText, setBodyText] = useState(
    "Type or paste your main content paragraphs here.\n\n" +
    "This PDF tool automatically wraps your text and segments it into clean page breaks if the content exceeds a single page format. " +
    "You can customize layout themes to style your document for different professional needs.\n\n" +
    "FEATURES:\n" +
    "• Multiple visual themes (Corporate Navy, Minimal Editorial, Technical Draft)\n" +
    "• Auto text-wrapping & line segmenting\n" +
    "• Smart multi-page break handling\n" +
    "• Optional page numbering and running footers\n" +
    "• Clean modern typographic pairings"
  );

  const [theme, setTheme] = useState<"corporate" | "editorial" | "mono">("corporate");
  const [fontSize, setFontSize] = useState<"10" | "12" | "14">("12");
  const [includePageNumbers, setIncludePageNumbers] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const generatePdf = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    // Minor delay for UI smoothness
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4"
      });

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      
      const margin = 54; // 0.75 in
      const usableWidth = pageWidth - margin * 2;
      
      let currentY = margin;

      // Font pairings depending on theme
      const fontHeader = theme === "editorial" ? "times" : theme === "mono" ? "courier" : "helvetica";
      const fontBody = theme === "editorial" ? "times" : theme === "mono" ? "courier" : "helvetica";

      // Styles
      const primaryColor = theme === "corporate" ? [14, 116, 144] : theme === "editorial" ? [10, 10, 10] : [75, 85, 99]; // RGB

      // HELPER: DRAW HEADER/FOOTER FOR NEW PAGE
      let pageNum = 1;
      const drawHeaderFooter = (targetDoc: jsPDF, isFirstPage: boolean) => {
        // Draw page border or line if needed
        if (theme === "corporate") {
          targetDoc.setDrawColor(229, 231, 235);
          targetDoc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
        }

        // Draw page numbers
        if (includePageNumbers) {
          targetDoc.setFont(fontBody, "normal");
          targetDoc.setFontSize(9);
          targetDoc.setTextColor(156, 163, 175);
          
          const footerStr = `Page ${pageNum}`;
          const strWidth = targetDoc.getTextWidth(footerStr);
          targetDoc.text(footerStr, pageWidth - margin - strWidth, pageHeight - 25);
          
          if (!isFirstPage && author) {
            targetDoc.text(`${title} • ${author}`, margin, pageHeight - 25);
          }
        }
      };

      // --- PAGE 1: TITLE & DETAILS ---
      // Primary accent line (Corporate theme)
      if (theme === "corporate") {
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(margin, currentY, 6, 45, "F");
        currentY += 5;
      }

      // 1. Draw Title
      doc.setFont(fontHeader, "bold");
      doc.setFontSize(24);
      doc.setTextColor(17, 24, 39);
      const wrappedTitle = doc.splitTextToSize(title, theme === "corporate" ? usableWidth - 15 : usableWidth);
      doc.text(wrappedTitle, theme === "corporate" ? margin + 15 : margin, currentY + 15);
      currentY += (wrappedTitle.length * 28) + 10;

      // 2. Draw Subtitle
      if (subtitle) {
        doc.setFont(fontHeader, "italic");
        doc.setFontSize(13);
        doc.setTextColor(107, 114, 128);
        const wrappedSubtitle = doc.splitTextToSize(subtitle, usableWidth);
        doc.text(wrappedSubtitle, margin, currentY);
        currentY += (wrappedSubtitle.length * 18) + 15;
      }

      // 3. Draw Metadata (Author, Date)
      doc.setFont(fontBody, "normal");
      doc.setFontSize(10);
      doc.setTextColor(156, 163, 175);
      doc.text(`By ${author || "Anonymous"}  |  Date: ${date}`, margin, currentY);
      currentY += 15;

      // Divider line
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 30;

      // 4. Draw Body Content paragraphs
      const bodyFontSize = parseInt(fontSize, 10);
      doc.setFont(fontBody, "normal");
      doc.setFontSize(bodyFontSize);
      doc.setTextColor(55, 65, 81);
      
      const paragraphs = bodyText.split("\n");
      const lineHeight = bodyFontSize * 1.5;

      drawHeaderFooter(doc, true);

      for (const paragraph of paragraphs) {
        const pText = paragraph.trim();
        
        // Handle spacing for empty paragraphs
        if (pText === "") {
          currentY += lineHeight * 0.8;
          continue;
        }

        const wrappedLines = doc.splitTextToSize(pText, usableWidth);
        
        for (const line of wrappedLines) {
          // Check for overflow before printing line
          if (currentY + lineHeight > pageHeight - 65) {
            doc.addPage();
            pageNum++;
            drawHeaderFooter(doc, false);
            currentY = margin + 20;
            doc.setFont(fontBody, "normal");
            doc.setFontSize(bodyFontSize);
            doc.setTextColor(55, 65, 81);
          }
          
          doc.text(line, margin, currentY);
          currentY += lineHeight;
        }
        
        // Add paragraph gap
        currentY += lineHeight * 0.4;
      }

      doc.save(`${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.pdf`);
      setSuccess("Successfully generated and downloaded PDF document!");
    } catch (err: any) {
      console.error(err);
      setError("Failed to compile text into PDF. Please check your content.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6" id="text-to-pdf-tool">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">Convert Text to PDF</h2>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Paste text or compose documents, adjust styles and themes, and generate formatted PDF publications instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Editor Settings - Left */}
        <div className="md:col-span-1 space-y-4 p-5 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/80 rounded-2xl h-fit text-xs">
          <div className="flex items-center gap-1.5 pb-2 border-b border-gray-100 dark:border-gray-800">
            <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider">Document Settings</span>
          </div>

          {/* Theme */}
          <div className="space-y-1.5">
            <label className="font-bold text-gray-600 dark:text-gray-400">Document Layout Theme</label>
            <select
              value={theme}
              onChange={(e: any) => setTheme(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
            >
              <option value="corporate">Corporate Navy (Clean & Modern)</option>
              <option value="editorial">Minimal Editorial (Serif Typography)</option>
              <option value="mono">Technical Draft (Monospace)</option>
            </select>
          </div>

          {/* Font size */}
          <div className="space-y-1.5">
            <label className="font-bold text-gray-600 dark:text-gray-400">Body Font Size</label>
            <div className="grid grid-cols-3 gap-2">
              {([["10", "Small"], ["12", "Medium"], ["14", "Large"]] as const).map(([size, label]) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`py-2 border rounded-lg font-bold transition cursor-pointer ${
                    fontSize === size
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {label} ({size}pt)
                </button>
              ))}
            </div>
          </div>

          {/* Include page numbers */}
          <div className="flex items-center justify-between py-2 border-t border-b border-gray-100 dark:border-gray-800">
            <span className="font-bold text-gray-600 dark:text-gray-400">Show Page Numbers & Footer</span>
            <input
              type="checkbox"
              checked={includePageNumbers}
              onChange={(e) => setIncludePageNumbers(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={generatePdf}
            disabled={isProcessing || !bodyText.trim()}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition text-xs shadow-md shadow-blue-500/10 hover:shadow-blue-500/20"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Compiling PDF...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Generate & Download PDF
              </>
            )}
          </button>
        </div>

        {/* Text Input Fields - Right */}
        <div className="md:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Document Title"
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Subtitle / Abstract</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="E.g. Monthly progress summary report"
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Author Name</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="E.g. Jane Doe"
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Publication Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200"
              />
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center">
              <label className="font-bold text-gray-700 dark:text-gray-300">Main Body Content</label>
              <span className="text-[10px] text-gray-600 dark:text-gray-400">Characters: {bodyText.length}</span>
            </div>
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder="Paste or write your document content here..."
              rows={12}
              className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-800 dark:text-gray-200 leading-relaxed font-sans"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-400 rounded-xl text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 rounded-xl text-xs flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
