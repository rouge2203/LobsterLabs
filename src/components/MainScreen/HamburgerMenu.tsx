import { useLanguage } from "../i18n/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

type CardId = "who" | "projects" | "services";

export function HamburgerMenu({
  open,
  onClose,
  onNavClick,
  onContactClick,
  mobile = false,
}: {
  open: boolean;
  onClose: () => void;
  onNavClick: (id: CardId) => void;
  onContactClick?: () => void;
  mobile?: boolean;
}) {
  const { t } = useLanguage();

  const navItems: { id: CardId | "contact"; label: string }[] = [
    { id: "who", label: t.who },
    { id: "projects", label: t.projects },
    { id: "services", label: t.services },
    { id: "contact", label: t.cta },
  ];

  const handleNavItemClick = (id: CardId | "contact") => {
    if (id === "contact") {
      onContactClick?.();
      window.location.href = "mailto:aruiz@lobsterlabs.net?subject=Contact%20Request&body=Hello%20Lobster%20Labs";
    } else {
      onNavClick(id);
    }
    onClose();
  };

  const handleContactClick = () => {
    onContactClick?.();
    window.location.href = "mailto:aruiz@lobsterlabs.net?subject=Contact%20Request&body=Hello%20Lobster%20Labs";
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="bg-black overflow-hidden rounded-b-3xl flex-shrink-0"
        >
        <div className="border-b border-gray-800">
          <div className="flex items-center justify-between px-8 py-6">
            <img
              src="/lobsterlogo.png"
              alt="Lobster Labs"
              className="h-6 brightness-0 invert"
            />
            <div className="flex items-center gap-4">
              {!mobile && (
                <button
                  type="button"
                  onClick={handleContactClick}
                  className="px-6 py-2.5 bg-white text-black font-inter font-medium rounded-full text-sm hover:opacity-90 transition-opacity shadow-sm"
                >
                  {t.cta}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close menu"
              >
                <span className="text-2xl leading-none">×</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`grid border-b border-gray-800 ${mobile ? "grid-cols-1" : "grid-cols-2 [&>*:nth-child(3)]:border-b-0 [&>*:nth-child(4)]:border-b-0"}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavItemClick(item.id)}
              className={`py-12 px-8 text-left text-white font-inter font-medium text-lg hover:bg-[#F0EEEB] hover:text-black transition-colors border-b border-gray-800 ${!mobile ? "border-r even:border-r-0" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={`grid border-b border-gray-800 ${mobile ? "grid-cols-1" : "grid-cols-2"}`}>
          <div className={`py-8 px-8 ${!mobile ? "border-r border-gray-800" : ""}`}>
            <h3 className="text-white/60 font-inter text-xs uppercase tracking-wider mb-4">
              Our office
            </h3>
            <p className="text-white font-inter text-sm">
              Costa Rica
            </p>
            <p className="text-white/80 font-inter text-sm mt-1">
              San José
            </p>
          </div>
          <div className="py-8 px-8">
            <h3 className="text-white/60 font-inter text-xs uppercase tracking-wider mb-4">
              Follow us
            </h3>
            <div className="flex gap-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-inter text-sm hover:underline"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-inter text-sm hover:underline"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-inter text-sm hover:underline"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
