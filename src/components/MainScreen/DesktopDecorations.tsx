export function DesktopDecorations() {
  return (
    <>
      <div
        className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
        style={{ color: "#ccc" }}
      >
        <span className="text-[10px] font-mono">01</span>
        <div className="w-px h-24 bg-gray-300" />
        <span className="text-[10px] font-mono">03</span>
      </div>
      <div
        className="absolute right-8 bottom-8 flex gap-6 text-[11px] font-inter tracking-[2px] text-gray-500"
      >
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 transition-colors"
        >
          Instagram
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 transition-colors"
        >
          GitHub
        </a>
      </div>
    </>
  );
}
