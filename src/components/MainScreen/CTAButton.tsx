import { useLanguage } from "../i18n/LanguageContext";

export function CTAButton({
  desktop = false,
  onClick,
}: {
  desktop?: boolean;
  onClick?: () => void;
}) {
  const { t } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className={
        desktop
          ? "inline-block px-8 py-3 bg-gray-900 text-white rounded-md font-bold text-sm uppercase tracking-wide font-inter mt-6 cursor-pointer"
          : "block bg-gray-900 text-white font-bold text-[13px] uppercase tracking-wide py-2.5 rounded-md text-center font-dm-sans w-full cursor-pointer"
      }
    >
      {t.cta}
    </button>
  );
}
