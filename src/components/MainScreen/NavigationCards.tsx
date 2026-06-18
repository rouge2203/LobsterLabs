import { MessageSquare, FolderOpen, Sparkles } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { motion } from "framer-motion";

type CardId = "who" | "projects" | "services";

const ICONS = {
  who: MessageSquare,
  projects: FolderOpen,
  services: Sparkles,
};

export function NavigationCards({
  onCardClick,
  desktop = false,
}: {
  onCardClick: (id: CardId) => void;
  desktop?: boolean;
}) {
  const { t } = useLanguage();

  const cards: { id: CardId }[] = [
    { id: "who" },
    { id: "projects" },
    { id: "services" },
  ];

  if (desktop) {
    return (
      <div className="flex flex-col mt-10 border-t border-white/10">
        {cards.map((card, i) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onCardClick(card.id)}
            className="group flex items-center gap-4 py-3.5 border-b border-white/10 text-left"
          >
            <span className="font-mono text-[11px] text-white/30 tabular-nums w-7">
              0{i + 1}
            </span>
            <span className="font-bricolage text-lg font-medium text-white/70 lowercase tracking-tight transition-colors group-hover:text-white">
              {t[card.id]}
            </span>
            <span className="ml-auto text-accentBright opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              →
            </span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 px-4">
      {cards.map((card) => {
        const Icon = ICONS[card.id];
        return (
          <motion.button
            key={card.id}
            type="button"
            onClick={() => onCardClick(card.id)}
            className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 flex-1 flex flex-col items-start gap-2 cursor-pointer active:scale-95 transition-transform"
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={20} strokeWidth={1.5} className="text-accentBright" />
            <span className="text-[13px] font-medium text-white/85 font-inter lowercase leading-tight text-left">
              {t[card.id]}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
