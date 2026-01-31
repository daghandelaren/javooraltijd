"use client";

interface PreviewWatermarkProps {
  className?: string;
}

export function PreviewWatermark({ className }: PreviewWatermarkProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className || ''}`}>
      {/* Diagonal watermark pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            rgba(0,0,0,0.02) 80px,
            rgba(0,0,0,0.02) 160px
          )`,
        }}
      />

      {/* Center watermark */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] whitespace-nowrap select-none">
        <span className="text-4xl sm:text-5xl font-bold text-black/[0.08] tracking-widest">
          VOORBEELD
        </span>
      </div>

      {/* Additional corner watermarks */}
      <div className="absolute top-4 left-4 -rotate-12 select-none">
        <span className="text-lg font-semibold text-black/[0.05]">PREVIEW</span>
      </div>
      <div className="absolute bottom-4 right-4 rotate-12 select-none">
        <span className="text-lg font-semibold text-black/[0.05]">PREVIEW</span>
      </div>
    </div>
  );
}
