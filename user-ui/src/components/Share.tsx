import { useState } from "react";
import { Link2, Copy, Check, ImageDown, FileDown, KeyRound } from "lucide-react";

type ShareProps = {
  /** The shareable link shown at the top of the panel */
  link?: string;
  /** Short join code, e.g. a room code (optional — hidden if not passed) */
  code?: string;
  /** Called when the user clicks "Export as image". Wire this up to your own
   *  canvas/board snapshot logic (e.g. html2canvas, toDataURL, etc). */
  onExportImage?: () => void;
  /** Called when the user clicks "Export as PDF". Wire this up to your own
   *  PDF export logic (e.g. jsPDF). */
  onExportPDF?: () => void;
};

function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    } catch {
      // Clipboard API unavailable — fail silently, button just won't flip to "Copied"
    }
  };

  return { copiedKey, copy };
}

export default function Share({
  link = "https://drawforge.app/b/9f8a2c",
  code = "FOX-2891",
  onExportImage,
  onExportPDF,
}: ShareProps) {
  const { copiedKey, copy } = useCopy();

  return (
    <div
      className="w-full max-w-sm bg-white border-2 border-[#2B2B2A] p-6"
      style={{
        fontFamily: "'Patrick Hand', cursive",
        borderRadius: "255px 15px 225px 15px / 15px 225px 15px 255px",
        boxShadow: "6px 6px 0 #4FC1CF",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&family=Patrick+Hand&display=swap');
        .share-font-doodle { font-family: 'Caveat', cursive; }
        .share-doodle-input { border-radius: 14px 60px 14px 60px / 60px 14px 60px 14px; }
        .share-doodle-btn { border-radius: 200px 15px 190px 15px / 15px 190px 15px 200px; }
      `}</style>

      <h2 className="share-font-doodle text-3xl font-bold mb-4">Share this board</h2>

      {/* Link */}
      <div className="flex items-center border-2 border-[#2B2B2A] share-doodle-input bg-white pl-3 pr-1 py-1 mb-3">
        <Link2 size={16} className="text-[#8a8a86] shrink-0" />
        <input
          readOnly
          value={link}
          className="flex-1 bg-transparent outline-none px-2 py-1.5 text-sm text-[#2B2B2A]"
        />
        <button
          onClick={() => copy(link, "link")}
          className="shrink-0 flex items-center gap-1 bg-[#FFC53D] border-2 border-[#2B2B2A] px-3 py-1.5 text-sm font-bold share-doodle-btn hover:-translate-y-px transition-transform"
        >
          {copiedKey === "link" ? <Check size={14} /> : <Copy size={14} />}
          {copiedKey === "link" ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Room code */}
      {code && (
        <div className="flex items-center justify-between border-2 border-dashed border-[#2B2B2A]/40 rounded-2xl px-4 py-2.5 mb-5">
          <div className="flex items-center gap-2 text-[#5b5b58]">
            <KeyRound size={16} />
            <span className="text-sm">Room code</span>
          </div>
          <button
            onClick={() => copy(code, "code")}
            className="share-font-doodle text-xl font-bold tracking-wide flex items-center gap-2 hover:text-[#4FC1CF] transition-colors"
          >
            {code}
            {copiedKey === "code" ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      )}

      {/* Export actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onExportImage}
          className="flex flex-col items-center gap-1.5 border-2 border-[#2B2B2A] share-doodle-btn py-3 hover:bg-[#FF6B6B]/10 transition-colors"
        >
          <ImageDown size={20} />
          <span className="text-sm font-bold">Export image</span>
        </button>
        <button
          onClick={onExportPDF}
          className="flex flex-col items-center gap-1.5 border-2 border-[#2B2B2A] share-doodle-btn py-3 hover:bg-[#4FC1CF]/10 transition-colors"
        >
          <FileDown size={20} />
          <span className="text-sm font-bold">Export PDF</span>
        </button>
      </div>
    </div>
  );
}