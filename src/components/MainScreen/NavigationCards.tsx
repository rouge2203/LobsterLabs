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

  const cards: { id: CardId; label1: string; label2: string }[] = [
    { id: "who", label1: (t as any).whoLabel1 ?? t.who, label2: (t as any).whoLabel2 ?? "" },
    { id: "projects", label1: (t as any).projectsLabel1 ?? t.projects, label2: (t as any).projectsLabel2 ?? "" },
    { id: "services", label1: (t as any).servicesLabel1 ?? t.services, label2: (t as any).servicesLabel2 ?? "" },
  ];

  if (desktop) {
    return (
      <div className="flex flex-col gap-4 mt-8">
        {cards.map((card) => {
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => onCardClick(card.id)}
              className="group text-left text-sm font-inter font-medium text-gray-900 transition-colors flex items-center"
            >
              <span className="inline-block w-0 opacity-0 group-hover:w-5 group-hover:opacity-100 transition-all duration-200 no-underline">
                →
              </span>
              <span className="group-hover:underline underline-offset-4">
                {t[card.id === "who" ? "who" : card.id === "projects" ? "projects" : "services"]}
              </span>
            </button>
          );
        })}
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
            className="bg-[#F0EEEB] rounded-2xl p-3 flex-1 flex flex-col items-start gap-2 cursor-pointer active:scale-95 transition-transform"
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={21} strokeWidth={1.5} className="text-gray-900" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-900">{card.label1}</span>
              {card.label2 && (
                <span className="text-sm font-normal text-gray-900">{card.label2}</span>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
