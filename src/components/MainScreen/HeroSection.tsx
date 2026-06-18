import { useLanguage } from "../i18n/LanguageContext";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroSection({ desktop = false }: { desktop?: boolean }) {
  const { t } = useLanguage();

  // Split the headline on the ellipsis so the AI clause can be accented
  const [headMain, ...headRest] = t.headline.split("…");
  const headTail = headRest.join("…").trim();

  if (desktop) {
    return (
      <div className="relative">
        {/* Eyebrow — the "first AI implementer" tagline, kept small + technical */}
        <motion.div
          className="flex items-center gap-3 mb-7"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="h-px w-8 bg-accentBright/80" />
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/55">
            {t.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          className="font-bricolage font-extrabold leading-[0.95] tracking-[-0.03em] text-white text-5xl xl:text-6xl 2xl:text-[4.2rem] lowercase"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.08 }}
        >
          {headMain}
          {headTail ? "…" : ""}
          {headTail && (
            <span className="mt-3 block text-3xl xl:text-4xl font-semibold text-accentBright">
              {headTail}
            </span>
          )}
        </motion.h1>

        <motion.p
          className="flex items-start gap-3 max-w-[400px] mt-7 text-white/60 font-inter text-[15px] leading-relaxed tracking-wide"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.2 }}
        >
          <span className="mt-[10px] h-px w-6 flex-shrink-0 bg-white/25" />
          <span>{t.subtitle}</span>
        </motion.p>
      </div>
    );
  }

  return (
    <div className="text-center px-6 pt-6 pb-1">
      <motion.div
        className="flex items-center justify-center gap-2 mb-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
      >
        <span className="h-px w-5 bg-accentBright/80" />
        <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">
          {t.eyebrow}
        </span>
        <span className="h-px w-5 bg-accentBright/80" />
      </motion.div>
      <motion.h1
        className="font-bricolage font-extrabold text-[26px] leading-[1] tracking-[-0.02em] text-center text-white max-w-[300px] mx-auto lowercase"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease, delay: 0.06 }}
      >
        {headMain}
        {headTail ? "…" : ""}
        {headTail && (
          <span className="mt-1.5 block text-[18px] font-semibold text-accentBright">
            {headTail}
          </span>
        )}
      </motion.h1>
      <motion.p
        className="text-[12px] font-normal leading-snug text-center text-white/55 max-w-[260px] mx-auto mt-2.5 font-inter"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease, delay: 0.16 }}
      >
        {t.subtitle}
      </motion.p>
    </div>
  );
}
