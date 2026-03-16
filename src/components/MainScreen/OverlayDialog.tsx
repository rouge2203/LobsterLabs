import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../i18n/LanguageContext";
import {
  Users,
  Globe,
  Cpu,
  Palette,
  Sparkles,
  Code,
  Smartphone,
  Bot,
  Box,
  Video,
  Briefcase,
  SlidersHorizontal,
  TrendingUp,
  Megaphone,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

type DialogType = "who" | "projects" | "services" | "contact" | null;

const TOPBAR_H_MOBILE = 46;
const TOPBAR_H_DESKTOP = 64;

export function OverlayDialog({
  open,
  onClose,
  type,
  isMobile,
}: {
  open: boolean;
  onClose: () => void;
  type: DialogType;
  isMobile: boolean;
}) {
  const { t } = useLanguage();
  const topBarH = isMobile ? TOPBAR_H_MOBILE : TOPBAR_H_DESKTOP;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    };
  }, [open, onClose]);

  const title =
    type === "who"
      ? t.whoTitle
      : type === "projects"
        ? t.projectsTitle
        : type === "contact"
          ? t.contactTitle
          : t.servicesTitle;

  return (
    <AnimatePresence>
      {open && type && (
        <motion.div
          key="dialog"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{
            type: "spring",
            damping: 28,
            stiffness: 280,
          }}
          className="fixed left-0 right-0 bottom-0 z-40 flex flex-col"
          style={{ top: topBarH }}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="absolute inset-0 bg-white" />
          <div className="relative flex-1 flex flex-col bg-[#F0EEEB] shadow-sm rounded-t-[28px] overflow-hidden">
            <div className="flex items-center justify-between px-5 md:px-8 pt-5 pb-3 flex-shrink-0">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 font-dm-sans">
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200/60 text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div
              className="overflow-y-auto flex-1 overscroll-contain px-5 md:px-8 pb-[env(safe-area-inset-bottom,16px)]"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {type === "who" && <WhoContent />}
              {type === "projects" && <ProjectsContent />}
              {type === "services" && <ServicesContent />}
              {type === "contact" && <ContactContent />}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function WhoContent() {
  const { t } = useLanguage();

  const points = [
    { icon: Briefcase, title: t.whoPoint1Title, desc: t.whoPoint1Desc },
    { icon: SlidersHorizontal, title: t.whoPoint2Title, desc: t.whoPoint2Desc },
    { icon: Sparkles, title: t.whoPoint3Title, desc: t.whoPoint3Desc },
    { icon: Cpu, title: t.whoPoint4Title, desc: t.whoPoint4Desc },
    { icon: TrendingUp, title: t.whoPoint5Title, desc: t.whoPoint5Desc },
    { icon: Megaphone, title: t.whoPoint6Title, desc: t.whoPoint6Desc },
  ];

  return (
    <div className="pb-6">
      <div className="mb-8">
        <p className="text-base md:text-lg font-semibold text-gray-900 font-dm-sans leading-snug md:max-w-[55%]">
          {t.whoBody}
        </p>
        <p className="text-sm text-gray-500 font-dm-sans leading-relaxed mt-3 md:max-w-[55%]">
          {t.whoBody2}
        </p>
      </div>

      <div className="relative pl-9 md:pl-10">
        <div className="absolute left-[12px] md:left-[15px] top-2 bottom-2 w-px bg-gray-200" />

        {points.map((point, i) => {
          const Icon = point.icon;
          return (
            <div key={i} className="relative mb-8 last:mb-0">
              <div className="absolute -left-9 md:-left-10 top-0 w-[30px] h-[30px] md:w-[30px] md:h-[30px] rounded-full  bg-white border-2 border-gray-200 flex items-center justify-center">
                <Icon
                  size={14}
                  strokeWidth={2}
                  className="text-[#801818] md:hidden"
                />
                <Icon
                  size={16}
                  strokeWidth={2}
                  className="text-[#801818] hidden md:block"
                />
              </div>

              <div>
                <h4 className="text-sm md:text-base font-bold text-gray-900 font-dm-sans">
                  {point.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed mt-1">
                  {point.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type AppProject = {
  kind: "app";
  icon: string;
  name: string;
  shortDescKey: string;
  fullDescKey: string;
  rating: string;
  downloads: string;
  contentRating: string;
  screenshots: string[];
};

type WebProject = {
  kind: "web";
  logo: string;
  name: string;
  url: string;
  shortDescKey: string;
  fullDescKey: string;
  screenshots: string[];
};

type Project = AppProject | WebProject;

const PROJECTS: Project[] = [
  {
    kind: "app",
    icon: "/ticaapp.png",
    name: "TicaApp",
    shortDescKey: "app_ticaapp_short",
    fullDescKey: "app_ticaapp_full",
    rating: "4.8",
    downloads: "10K+",
    contentRating: "Everyone",
    screenshots: [
      "https://play-lh.googleusercontent.com/qWx2zU1GcU6Xv0v-L2rH_FfusPQbuF_2v77t_g-vCY5iIjtSyiJFreAxmqgqCMNvSA=w5120-h2880",
      "https://play-lh.googleusercontent.com/qWx2zU1GcU6Xv0v-L2rH_FfusPQbuF_2v77t_g-vCY5iIjtSyiJFreAxmqgqCMNvSA=w5120-h2880",
      "https://play-lh.googleusercontent.com/qWx2zU1GcU6Xv0v-L2rH_FfusPQbuF_2v77t_g-vCY5iIjtSyiJFreAxmqgqCMNvSA=w5120-h2880",
      "https://play-lh.googleusercontent.com/qWx2zU1GcU6Xv0v-L2rH_FfusPQbuF_2v77t_g-vCY5iIjtSyiJFreAxmqgqCMNvSA=w5120-h2880",
    ],
  },
  {
    kind: "web",
    logo: "https://remusacr.com/static/logo.png",
    name: "Remus ACR",
    url: "https://remusacr.com",
    shortDescKey: "web_remus_short",
    fullDescKey: "web_remus_full",
    screenshots: [
      "/screenshot.png",
      "/screenshot.png",
      "/screenshot.png",
      "/screenshot.png",
    ],
  },
  {
    kind: "app",
    icon: "/ticaapp.png",
    name: "GasControl",
    shortDescKey: "app_gascontrol_short",
    fullDescKey: "app_gascontrol_full",
    rating: "4.5",
    downloads: "5K+",
    contentRating: "Everyone",
    screenshots: [
      "https://play-lh.googleusercontent.com/qWx2zU1GcU6Xv0v-L2rH_FfusPQbuF_2v77t_g-vCY5iIjtSyiJFreAxmqgqCMNvSA=w5120-h2880",
      "https://play-lh.googleusercontent.com/qWx2zU1GcU6Xv0v-L2rH_FfusPQbuF_2v77t_g-vCY5iIjtSyiJFreAxmqgqCMNvSA=w5120-h2880",
      "https://play-lh.googleusercontent.com/qWx2zU1GcU6Xv0v-L2rH_FfusPQbuF_2v77t_g-vCY5iIjtSyiJFreAxmqgqCMNvSA=w5120-h2880",
      "https://play-lh.googleusercontent.com/qWx2zU1GcU6Xv0v-L2rH_FfusPQbuF_2v77t_g-vCY5iIjtSyiJFreAxmqgqCMNvSA=w5120-h2880",
    ],
  },
  {
    kind: "web",
    logo: "https://remusacr.com/static/logo.png",
    name: "Costa Solar",
    url: "https://costasolar.cr",
    shortDescKey: "web_costasolar_short",
    fullDescKey: "web_costasolar_full",
    screenshots: [
      "/screenshot.png",
      "/screenshot.png",
      "/screenshot.png",
      "/screenshot.png",
    ],
  },
];

function ScreenshotImage({
  src,
  alt,
  className,
  viewLabel,
}: {
  src: string;
  alt: string;
  className: string;
  viewLabel: string;
}) {
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group/image flex-shrink-0 block"
      style={{ scrollSnapAlign: "start" }}
    >
      <img src={src} alt={alt} className={className} />
      <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity rounded-xl pointer-events-none hidden md:flex items-center justify-center md:group-hover/image:opacity-100">
        <span className="text-white text-sm font-semibold font-dm-sans">
          {viewLabel}
        </span>
      </div>
    </a>
  );
}

function AppProjectCard({ project }: { project: AppProject }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  const shortDesc = (t as Record<string, string>)[project.shortDescKey] ?? "";
  const fullDesc = (t as Record<string, string>)[project.fullDescKey] ?? "";

  return (
    <div
      className={`group bg-white rounded-2xl p-3 md:p-5 border border-[#801818]/10 shadow-sm transition-all duration-300 ${
        expanded ? "cursor-default" : "cursor-pointer hover:shadow-md"
      }`}
      onClick={() => {
        if (!expanded) setExpanded(true);
      }}
    >
      <div className="flex gap-3 items-start">
        <div className="w-[52px] flex-shrink-0 flex items-center justify-center">
          <img
            src={project.icon}
            alt={project.name}
            className="w-[52px] h-[52px] rounded-[14px] object-cover"
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                App
              </span>
              <h3 className="text-base font-semibold text-gray-900 font-dm-sans leading-tight">
                {project.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className={`text-sm font-semibold text-[#801818] flex-shrink-0 mt-1 underline-offset-2 ${
                expanded
                  ? "hover:underline"
                  : "group-hover:underline hover:underline"
              }`}
            >
              {expanded ? t.seeLess : t.seeMore}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
            {shortDesc}
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-5 mt-3"
          >
            <p className="text-sm text-gray-600 leading-relaxed">{fullDesc}</p>

            <div className="flex justify-around border-t border-b border-gray-100 py-4 my-2">
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">
                  {project.rating} ★
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {t.rating}
                </div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">
                  {project.downloads}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {t.downloads}
                </div>
              </div>
              <div className="w-px bg-gray-200" />
              <div className="text-center">
                <div className="text-sm font-semibold text-gray-900">
                  {project.contentRating}
                </div>
                <div className="text-[10px] text-gray-400 mt-0.5">
                  {t.content}
                </div>
              </div>
            </div>

            <div
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {project.screenshots.map((src, i) => (
                <ScreenshotImage
                  key={i}
                  src={src}
                  alt={`${project.name} screenshot ${i + 1}`}
                  className={`h-[280px] w-auto rounded-xl object-cover bg-gray-100${i === 0 ? " ml-3 md:ml-4" : ""}${i === project.screenshots.length - 1 ? " mr-3 md:mr-4" : ""}`}
                  viewLabel={t.view}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WebProjectCard({ project }: { project: WebProject }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLanguage();
  const shortDesc = (t as Record<string, string>)[project.shortDescKey] ?? "";
  const fullDesc = (t as Record<string, string>)[project.fullDescKey] ?? "";

  return (
    <div
      className={`group bg-white rounded-2xl p-3 md:p-5 border border-[#801818]/10 shadow-sm transition-all duration-300 ${
        expanded ? "cursor-default" : "cursor-pointer hover:shadow-md"
      }`}
      onClick={() => {
        if (!expanded) setExpanded(true);
      }}
    >
      <div className="flex gap-3 items-start">
        <div className="w-[52px] flex-shrink-0 flex items-center justify-center pt-1">
          <img
            src={project.logo}
            alt={project.name}
            className="h-8 w-auto max-w-[52px] object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                Website
              </span>
              <h3 className="text-base font-semibold text-gray-900 font-dm-sans leading-tight">
                {project.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className={`text-sm font-semibold text-[#801818] flex-shrink-0 mt-1 underline-offset-2 ${
                expanded
                  ? "hover:underline"
                  : "group-hover:underline hover:underline"
              }`}
            >
              {expanded ? t.seeLess : t.seeMore}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
            {shortDesc}
          </p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="space-y-4 mt-3"
          >
            <div>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-900 underline break-all"
              >
                {project.url}
              </a>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">{fullDesc}</p>

            <div
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {project.screenshots.map((src, i) => (
                <ScreenshotImage
                  key={i}
                  src={src}
                  alt={`${project.name} screenshot ${i + 1}`}
                  className={`h-[180px] md:h-[240px] w-auto rounded-xl object-contain bg-gray-100${i === 0 ? " ml-3 md:ml-4" : ""}${i === project.screenshots.length - 1 ? " mr-3 md:mr-4" : ""}`}
                  viewLabel={t.view}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectsContent() {
  const { t } = useLanguage();

  return (
    <div className="space-y-5 pb-6">
      <p className="text-sm md:text-base text-gray-500 font-dm-sans leading-relaxed md:max-w-[55%]">
        {t.projectsIntro}
      </p>

      {PROJECTS.map((project, i) =>
        project.kind === "app" ? (
          <AppProjectCard key={i} project={project} />
        ) : (
          <WebProjectCard key={i} project={project} />
        ),
      )}
    </div>
  );
}

function ServiceCard({
  icon: Icon,
  label,
  desc,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 flex flex-col items-center gap-3 md:gap-3 text-center border border-[#801818]/10 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="w-12 h-12 md:w-12 md:h-12 rounded-full bg-[#801818]/8 flex items-center justify-center mb-1 md:mb-0">
        <Icon
          strokeWidth={1.5}
          className="text-[#801818] w-8 h-8 md:w-8 md:h-8"
        />
      </div>
      <span className="text-sm md:text-base font-semibold text-gray-900 font-dm-sans">
        {label}
      </span>
      <p className="text-xs md:text-sm text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function ServicesContent() {
  const { t } = useLanguage();
  const services = [
    { icon: Code, label: t.service1, desc: t.service1Desc },
    { icon: Smartphone, label: t.service2, desc: t.service2Desc },
    { icon: Bot, label: t.service3, desc: t.service3Desc },
    { icon: Box, label: t.service4, desc: t.service4Desc },
    { icon: Video, label: t.service5, desc: t.service5Desc },
    { icon: Palette, label: t.service6, desc: t.service6Desc },
  ];

  return (
    <div className="pb-6 space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
        {services.map((item, i) => (
          <ServiceCard
            key={i}
            icon={item.icon}
            label={item.label}
            desc={item.desc}
          />
        ))}
      </div>

      <div className="w-full md:max-w-[35%] mx-auto text-center px-2 md:px-0">
        <blockquote className="text-base md:text-lg font-light text-gray-700 font-inter leading-relaxed">
          "{t.servicesQuote}"
        </blockquote>
        <p className="text-[10px] text-gray-400 font-inter mt-3 uppercase tracking-[2px]">
          — {t.servicesQuoteAuthor}
        </p>
        <p className="text-base md:text-lg font-medium text-gray-700 mt-5 italic">
          {t.servicesLetsStart}
        </p>
      </div>
    </div>
  );
}

function ContactContent() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    const subject = encodeURIComponent(`Contact from ${name || "Website"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    );
    window.location.href = `mailto:aruiz@lobsterlabs.net?subject=${subject}&body=${body}`;
  };

  return (
    <div className="pb-6">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Left: contact info */}
        <div className="md:w-2/5 space-y-5">
          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {t.contactEmail}
            </span>
            <a
              href="mailto:aruiz@lobsterlabs.net"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 mt-1 hover:underline"
            >
              <Mail size={16} strokeWidth={1.5} className="text-gray-500" />
              aruiz@lobsterlabs.net
            </a>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {t.contactPhone}
            </span>
            <a
              href="tel:+50687050594"
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 mt-1 hover:underline"
            >
              <Phone size={16} strokeWidth={1.5} className="text-gray-500" />
              +506 8705 0594
            </a>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {t.contactAddress}
            </span>
            <p className="flex items-start gap-2 text-sm font-semibold text-gray-900 mt-1">
              <MapPin
                size={16}
                strokeWidth={1.5}
                className="text-gray-500 flex-shrink-0 mt-0.5"
              />
              {t.contactAddressValue}
            </p>
          </div>

          <div>
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              {t.contactFollowUs}
            </span>
            <div className="flex gap-3 mt-2">
              {[
                {
                  href: "https://www.linkedin.com/in/alejandro-ruiz-a5622a278/",
                  label: "LinkedIn",
                  path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
                },
                {
                  href: "https://github.com/rouge2203",
                  label: "GitHub",
                  path: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.338c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label={social.label}
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="md:w-3/5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.contactYourName}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.contactYourNamePlaceholder}
                className="mt-1 w-full px-4 py-2.5 md:px-3 md:py-2 bg-white border border-gray-200 rounded-lg text-sm md:text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors font-dm-sans"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.contactEmailAddress}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.contactEmailPlaceholder}
                className="mt-1 w-full px-4 py-2.5 md:px-3 md:py-2 bg-white border border-gray-200 rounded-lg text-sm md:text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors font-dm-sans"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.contactMessage}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.contactMessagePlaceholder}
              rows={5}
              className="mt-1 w-full px-4 py-2.5 md:px-3 md:py-2 bg-white border border-gray-200 rounded-lg text-sm md:text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors resize-none font-dm-sans"
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors font-dm-sans"
          >
            {t.contactSend}
          </button>
        </div>
      </div>
    </div>
  );
}
