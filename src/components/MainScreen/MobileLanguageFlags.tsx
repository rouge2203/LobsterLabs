import { useLanguage } from "../i18n/LanguageContext";

export function MobileLanguageFlags() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="fixed right-3 flex flex-col gap-0.5 z-10 bg-white/[0.06] border border-white/10 backdrop-blur-sm rounded-full p-0.5"
      style={{ bottom: "40%" }}
    >
      {(["en", "es"] as const).map((lng) => (
        <button
          key={lng}
          type="button"
          onClick={() => setLanguage(lng)}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-mono font-medium tracking-wide transition-all duration-200 ${
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
