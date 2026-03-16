import { useLanguage } from "../i18n/LanguageContext";
import { motion } from "framer-motion";

export function HeroSection({ desktop = false }: { desktop?: boolean }) {
  const { t } = useLanguage();

  if (desktop) {
    return (
      <div>
        <motion.h1
          className="text-5xl lg:text-6xl font-dm-serif leading-none text-gray-900 lowercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t.headline}
        </motion.h1>
        <p className="text-sm font-inter text-gray-500 max-w-[250px] leading-none mt-6">
          {t.subtitle}
        </p>
      </div>
    );
  }

  return (
    <div className="text-center px-6 pt-5 pb-1">
      <motion.h1
        className="text-[24px] font-bold leading-tight text-center text-gray-900 max-w-[280px] mx-auto font-dm-sans"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t.headline}
      </motion.h1>
      <motion.p
        className="text-xs font-normal leading-snug text-center text-gray-400 max-w-[260px] mx-auto mt-1 font-dm-sans"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {t.subtitle}
      </motion.p>
    </div>
  );
}
