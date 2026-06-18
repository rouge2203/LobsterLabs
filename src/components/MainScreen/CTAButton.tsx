import { useLanguage } from "../i18n/LanguageContext";

export function CTAButton({
  desktop = false,
  onClick,
}: {
  desktop?: boolean;
  onClick?: () => void;
}) {
  const { t } = useLanguage();

  if (desktop) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group mt-9 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] pl-6 pr-2.5 py-2.5 font-mono text-[12px] uppercase tracking-[0.18em] text-white transition-colors hover:border-accentBright/60 hover:bg-accent/20 cursor-pointer"
      >
        {t.cta}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-0.5 group-hover:bg-accentBright group-hover:text-white">
          →
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full rounded-xl bg-white py-3 text-center font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-black transition-colors active:bg-white/90 cursor-pointer"
    >
      {t.cta}
    </button>
  );
}
