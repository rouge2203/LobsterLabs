import { useLanguage } from "../i18n/LanguageContext";
import type { Language } from "../i18n/translations";

export function TopBar({
  desktop = false,
  onMenuClick,
  onLogoClick,
  showFlags = true,
  dialogOpen = false,
}: {
  desktop?: boolean;
  onMenuClick?: () => void;
  onLogoClick?: () => void;
  showFlags?: boolean;
  dialogOpen?: boolean;
}) {
  const { language, setLanguage } = useLanguage();

  if (desktop) {
    return (
      <div className="relative z-50 flex items-center justify-between px-10 h-20 w-full">
        <button type="button" onClick={onLogoClick} className="flex items-center gap-3">
          <img
            src="/lobsterlogo.png"
            alt="Lobster Labs"
            className="h-6 invert brightness-0"
          />
        </button>

        <div className="flex items-center gap-6">
          {showFlags && (
            <LanguageToggleButtons language={language} setLanguage={setLanguage} />
          )}
          <MenuTrigger onClick={onMenuClick} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-50 flex items-center justify-between px-4 pt-2 pb-1 min-h-[46px]">
      <button
        className="p-2 -ml-2 flex-shrink-0"
        aria-label="Menu"
        type="button"
        onClick={onMenuClick}
      >
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16" />
        </svg>
      </button>
      <button type="button" onClick={onLogoClick} className="flex-1 flex justify-center">
        <img
          src="/lobsterlogo.png"
          alt="Lobster Labs"
          className="h-5 object-contain invert brightness-0"
        />
      </button>
      {showFlags ? (
        <div className="flex items-center gap-1 w-12 justify-end flex-shrink-0">
          <LanguageToggleButtons language={language} setLanguage={setLanguage} />
        </div>
      ) : (
        <div className="w-12 flex-shrink-0" />
      )}
    </div>
  );
}

function MenuTrigger({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Menu"
      className="group flex items-center gap-2.5"
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-accentBright transition-colors group-hover:text-white">
        Menu
      </span>
      <span className="flex flex-col gap-[5px]">
        <span className="block h-px w-6 bg-white transition-all group-hover:w-7" />
        <span className="block h-px w-4 bg-white/60 transition-all group-hover:w-7" />
      </span>
    </button>
  );
}

function LanguageToggleButtons({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (l: Language) => void;
}) {
  return (
    <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-full p-0.5 backdrop-blur-sm">
      {(["en", "es"] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => setLanguage(lng)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide transition-all duration-200 ${
            language === lng
              ? "bg-white text-black"
              : "text-white/45 hover:text-white/80"
          }`}
          aria-label={lng === "en" ? "English" : "Español"}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
