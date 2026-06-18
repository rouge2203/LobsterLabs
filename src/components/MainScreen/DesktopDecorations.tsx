import { useLanguage } from "../i18n/LanguageContext";

export function DesktopDecorations() {
  const { t } = useLanguage();

  return (
    <>
      {/* Bottom-left technical stamp (à la "UI / UX — 2017.") */}
      <div className="absolute left-10 bottom-8 z-20 font-mono text-[10px] uppercase tracking-[0.24em] text-white/35">
        AI / Automation — CR 2026.
      </div>

      {/* Center-bottom scroll indicator */}
      <div className="absolute left-1/2 bottom-7 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
        <span className="text-white/40 text-base animate-noir-bob">↓</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/55">
          {t.explore}
        </span>
      </div>

      {/* Bottom-right socials */}
      <div className="absolute right-10 bottom-8 z-20 flex gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        <a
          href="https://www.linkedin.com/in/alejandro-ruiz-a5622a278/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/rouge2203"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          GitHub
        </a>
      </div>
    </>
  );
}
