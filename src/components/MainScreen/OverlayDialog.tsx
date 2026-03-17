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

type ProjectType = "app" | "website" | "3d" | "system" | "video";

type ProjectStats = {
  rating: string | null;
  reviews: string | null;
  downloads: string | null;
  content_rating: string | null;
} | null;

type ProjectItem = {
  title: string;
  type: ProjectType;
  short_description_es: string;
  short_description_en: string;
  long_description_es: string;
  long_description_en: string;
  link: string | null;
  stats: ProjectStats;
  main_image: string;
  children_images: string[];
};

const PROJECTS: ProjectItem[] = [
  {
    title: "Remusa App",
    type: "app",
    short_description_es:
      "Aplicación móvil para clientes de Remusa con catálogo de productos, comunicación con vendedores y programa de lealtad con puntos y sorteos.",
    short_description_en:
      "Mobile app for Remusa customers featuring a product catalog, direct contact with sales representatives, and a loyalty program with points and giveaways.",
    long_description_es:
      "Aplicación móvil diseñada para los clientes de Remusa, donde pueden explorar el catálogo de productos disponible, comunicarse con vendedores y participar en un programa de lealtad. La plataforma permite acumular puntos por compras realizadas, los cuales pueden canjearse por premios, productos canjeables y participación en sorteos frecuentes organizados por la empresa.",
    long_description_en:
      "Mobile application built for Remusa customers, allowing them to browse the available product catalog, communicate with sales representatives, and participate in a loyalty program. Users can earn points through purchases and redeem them for prizes, redeemable items, and entries into recurring company giveaways.",
    link: null,
    stats: {
      rating: null,
      reviews: null,
      downloads: "1K+",
      content_rating: "Everyone",
    },
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusaapp.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusaapp1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusaapp2.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusaapp3.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusaapp4.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusaapp5.webp",
    ],
  },
  {
    title: "EMMC",
    type: "website",
    short_description_es:
      "Portal académico y administrativo para la Escuela Municipal de Música de Cartago, con gestión de pagos, matrículas, tareas, evaluaciones y acceso para estudiantes, profesores y personal administrativo.",
    short_description_en:
      "Academic and administrative portal for the Escuela Municipal de Música de Cartago, featuring payments, enrollment management, assignments, evaluations, and role-based access for students, teachers, and administrators.",
    long_description_es:
      "Sitio web desarrollado para la Escuela Municipal de Música de Cartago que centraliza la gestión académica y administrativa de la institución. Permite al personal administrativo gestionar matrículas y pagos, mientras que estudiantes y profesores cuentan con accesos dedicados para seguimiento académico, asignación de tareas, evaluaciones y exámenes.",
    long_description_en:
      "Website developed for the Escuela Municipal de Música de Cartago, centralizing the institution’s academic and administrative processes. It enables administrative staff to manage enrollments and payments, while students and teachers have dedicated access for academic follow-up, assignments, evaluations, and exams.",
    link: "https://emmcportal.com",
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/emmclogo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/emmclogo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/emmclogo2.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/emmclogo3.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/emmclogo4.webp",
    ],
  },
  {
    title: "Gracia Plus App",
    type: "app",
    short_description_es:
      "Aplicación móvil para emisora de radio con transmisión en vivo, contenido multimedia, interacción con locutores y recursos espirituales como Biblia virtual, libros y oraciones guiadas.",
    short_description_en:
      "Mobile app for a radio station with live streaming, multimedia content, real-time interaction with hosts, and spiritual resources such as a virtual Bible, books, and guided prayers.",
    long_description_es:
      "Aplicación móvil desarrollada para una emisora de radio que permite escuchar la transmisión en vivo, consumir contenido actualizado, visualizar videos e interactuar con los locutores mediante mensajes. Además, integra funcionalidades complementarias como biblioteca de contenido, Biblia virtual y experiencias guiadas de oración mediante video y locución.",
    long_description_en:
      "Mobile application developed for a radio station, allowing users to listen to the live stream, access updated content, watch videos, and interact with radio hosts through messages. It also includes additional features such as a content library, a virtual Bible, and guided prayer experiences through video and voice narration.",
    link: null,
    stats: {
      rating: "4.9",
      reviews: "50+",
      downloads: "3K+",
      content_rating: "Everyone",
    },
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/graciaapp.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/graciapp1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/graciapp2.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/graciaapp3.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/graciapp4.webp",
    ],
  },
  {
    title: "Fútbol Tello",
    type: "website",
    short_description_es:
      "Sitio web de reservaciones para complejo deportivo con más de 5 canchas, gestión de pagos y administración operativa de reservas.",
    short_description_en:
      "Reservation website for a sports complex with more than 5 fields, featuring payment tracking and operational booking management.",
    long_description_es:
      "Sitio web para la gestión de reservaciones de un complejo deportivo en San José con más de 5 canchas. La plataforma permite a los clientes reservar espacios, mientras que el equipo administrativo puede registrar pagos, dar seguimiento a transferencias por SINPE Móvil y efectivo, y gestionar la operación diaria de las canchas. Además, los usuarios reciben notificaciones por WhatsApp y correo electrónico relacionadas con sus reservas.",
    long_description_en:
      "Booking website for a sports complex in San José with more than 5 fields. The platform allows customers to reserve spaces, while the administrative team can register payments, track transfers made through SINPE Móvil and cash, and manage the day-to-day operation of the facilities. Users also receive booking notifications through WhatsApp and email.",
    link: "https://futboltello.com",
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/tellologo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/tellologo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/tellologo2.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/tellologo3.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/tellologo4.webp",
    ],
  },
  {
    title: "La Tica App",
    type: "app",
    short_description_es:
      "Aplicación móvil para estación de servicio con activación de facturas, participación en sorteos, notificaciones y panel administrativo para estadísticas y gestión promocional.",
    short_description_en:
      "Mobile app for a service station featuring invoice activation, giveaway participation, notifications, and an admin panel for analytics and promotional management.",
    long_description_es:
      "Aplicación móvil diseñada para una estación de servicio, enfocada en la participación de clientes en sorteos promocionales mediante la activación de facturas. Los usuarios pueden escanear o registrar sus facturas para generar acciones válidas dentro de sorteos, consultar precios de combustible, recibir notificaciones y gestionar activaciones manuales o automáticas mediante factura electrónica. El sistema también contempla flujos diferenciados para clientes de crédito y cuenta con una sección administrativa para monitorear estadísticas y desempeño de los sorteos.",
    long_description_en:
      "Mobile app designed for a service station, focused on customer participation in promotional giveaways through invoice activation. Users can scan or register invoices to generate valid entries for giveaways, check fuel prices, receive notifications, and manage both manual and automatic activations through electronic invoicing. The system also includes differentiated flows for credit customers and an administrative section for monitoring giveaway statistics and performance.",
    link: null,
    stats: {
      rating: "4.9",
      reviews: "40+",
      downloads: "15K+",
      content_rating: "Everyone",
    },
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/ticaapp.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/ticaapp1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/ticaapp2.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/ticaapp3.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/ticaapp4.webp",
    ],
  },
  {
    title: "Remusa",
    type: "website",
    short_description_es:
      "Sitio web corporativo para Remusa con catálogo de productos, promociones, contacto comercial y acceso a herramientas avanzadas de búsqueda de repuestos.",
    short_description_en:
      "Corporate website for Remusa featuring a product catalog, promotions, sales contact, and access to advanced auto parts search tools.",
    long_description_es:
      "Sitio web corporativo desarrollado para Remusa, enfocado en presentar la empresa, su catálogo de productos, promociones y canales de contacto comercial. La plataforma también brinda acceso a funcionalidades clave como solicitudes de crédito, sistema de puntos canjeables y sorteos. Además, integra un panel administrativo con herramientas avanzadas, incluyendo un sistema asistido por inteligencia artificial para navegar por las partes de un vehículo y encontrar repuestos compatibles a nivel global mediante placa o VIN, permitiendo vincular disponibilidad internacional con inventario local y opciones de atención al cliente.",
    long_description_en:
      "Corporate website developed for Remusa, focused on showcasing the company, its product catalog, promotions, and commercial contact channels. The platform also provides access to key features such as credit requests, redeemable points, and giveaway systems. In addition, it includes an administrative panel with advanced tools, including an AI-assisted system to navigate vehicle parts and find globally compatible spare parts using a license plate or VIN, allowing agents to connect international availability with local inventory and customer service options.",
    link: "https://remusacr.com",
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusalogo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusalogo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusalogo2.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusalogo3.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusalogo4.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/remusalogo5.webp",
    ],
  },
  {
    title: "Gestión de Crédito Florida",
    type: "website",
    short_description_es:
      "Sistema web de gestión de crédito para automatizar solicitudes, evaluaciones, aprobaciones jerárquicas y seguimiento interno del proceso crediticio.",
    short_description_en:
      "Web-based credit management system designed to automate applications, evaluations, hierarchical approvals, and internal credit workflow tracking.",
    long_description_es:
      "Sistema web orientado a la gestión de crédito, donde los clientes pueden realizar solicitudes y proporcionar información clave para su análisis, incluyendo referencias comerciales, imágenes del negocio y documentación relevante. La plataforma estructura el proceso de aprobación por etapas y jerarquías dentro del departamento de crédito, permitiendo revisiones por distintos responsables, envío de correos, notificaciones y trazabilidad completa del flujo de aprobación. El sistema centraliza un proceso crítico del negocio y mejora la eficiencia en la toma de decisiones crediticias.",
    long_description_en:
      "Web-based credit management system where customers can submit credit applications and provide key information for evaluation, including business images, commercial references, and relevant documentation. The platform structures the approval workflow in stages and hierarchies across the credit department, enabling reviews by different stakeholders, email delivery, notifications, and full traceability of the approval process. The system centralizes a critical business operation and improves efficiency in credit decision-making.",
    link: null,
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/floridalogo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/floridalogo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/floridalogo2.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/floridalogo3.webp",
    ],
  },
  {
    title: "FC Pro Soccer Tryouts",
    type: "website",
    short_description_es:
      "Landing page optimizada para promocionar programas de pruebas de fútbol profesional en Costa Rica para jugadores internacionales.",
    short_description_en:
      "SEO-optimized landing page promoting professional soccer tryout programs in Costa Rica for international players.",
    long_description_es:
      "Sitio web promocional diseñado para presentar un programa en Costa Rica orientado a jugadores internacionales que buscan realizar pruebas con equipos profesionales de fútbol. La página destaca distintos paquetes de participación, con estancias de una semana o un mes, y comunica de forma clara la propuesta de valor del programa. Además, fue desarrollada con un enfoque visual atractivo y una estructura optimizada para campañas de Google Ads y posicionamiento en buscadores. Incluye formularios de contacto y una estrategia de comunicación por correo para compartir novedades sobre programas, clubes participantes y talentos emergentes.",
    long_description_en:
      "Promotional website designed to showcase a Costa Rica-based program for international players seeking tryouts with professional soccer teams. The page highlights different participation packages, including one-week and one-month options, and clearly communicates the value proposition of the program. It was also built with a visually engaging design and a structure optimized for Google Ads campaigns and search engine visibility. The site includes contact forms and email communication workflows to share updates about new programs, participating clubs, and emerging talent.",
    link: "https://www.fcprosoccertryouts.com/",
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/fcprologo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/fcprologo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/fcprologo2.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/fcprologo3.webp",
    ],
  },
  {
    title: "3D Set",
    type: "3d",
    short_description_es:
      "Set virtual 3D personalizado para sorteos, diseñado para fortalecer marca, generar confianza y crear experiencias promocionales más atractivas.",
    short_description_en:
      "Custom 3D virtual set for giveaways, designed to strengthen brand identity, build trust, and create more engaging promotional experiences.",
    long_description_es:
      "Proyecto de integración 3D desarrollado para sistemas de sorteos y dinámicas promocionales. El set recrea una experiencia visual en la que es posible mostrar bolitas girando, números ganadores y nombres de participantes seleccionados, apoyando la transparencia y el impacto visual de cada rifa. Estos entornos son diseñados a medida para cada marca, permitiendo crear una identidad distintiva para sus campañas promocionales. La solución utiliza tecnologías como Three.js para construir experiencias únicas, modernas y altamente diferenciadoras dentro de los ecosistemas digitales de fidelización.",
    long_description_en:
      "3D integration project developed for giveaway systems and promotional dynamics. The set recreates a visual experience where spinning balls, winning numbers, and selected participant names can be displayed, supporting both transparency and visual impact during each drawing. These environments are custom-designed for each brand, helping create a distinctive identity for promotional campaigns. The solution uses technologies such as Three.js to build unique, modern, and highly differentiated experiences within digital loyalty ecosystems.",
    link: null,
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/3dlogo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/3dlogo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/3dlogo2.webp",
    ],
  },
  {
    title: "Estaciones de Servicio",
    type: "system",
    short_description_es:
      "Sistema inteligente para estaciones de servicio con visualización 3D, monitoreo de posiciones, atención por colaborador y control para reducir contaminaciones.",
    short_description_en:
      "Smart system for service stations featuring 3D visualization, position tracking, attendant monitoring, and controls aimed at reducing fuel contamination risks.",
    long_description_es:
      "Sistema diseñado para estaciones de servicio que combina información proveniente de cámaras y equipos operativos para identificar qué vehículos se encuentran en cada posición y cómo se desarrolla la atención en tiempo real. La solución genera una recreación 3D de la estación, permitiendo visualizar entradas y salidas de vehículos, colaboradores en atención y el tipo de combustible que se está despachando. Además de aportar una experiencia moderna y visualmente llamativa, el sistema ayuda a prevenir contaminaciones y mejora el control operativo dentro de la estación.",
    long_description_en:
      "System designed for service stations that combines information from cameras and operational equipment to identify which vehicles are located in each position and how service is being handled in real time. The solution creates a 3D recreation of the station, allowing teams to visualize vehicle entry and exit, the staff member providing service, and the type of fuel being dispensed. In addition to delivering a modern and visually striking experience, the system helps prevent contamination issues and improves operational control within the station.",
    link: null,
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/cameralogo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/cameralogo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/cameralogo2.webp",
    ],
  },
  {
    title: "PuraVida FM",
    type: "website",
    short_description_es:
      "Landing page para emisora de radio con promoción de programas, locutores, acceso a donaciones y presencia digital en constante actualización.",
    short_description_en:
      "Landing page for a radio station featuring programs, hosts, donation access, and a constantly updated digital presence.",
    long_description_es:
      "Sitio web tipo landing desarrollado para una emisora de radio, pensado para presentar de forma clara y atractiva su programación, locutores y propuesta general de contenido. La página funciona como punto central de promoción de la marca, permitiendo destacar programas, reforzar la identidad visual de la emisora y redireccionar a secciones clave como donaciones, pagos y dinámicas digitales. Además, está planteada para mantenerse en constante actualización, facilitando la incorporación de nuevos segmentos, campañas especiales, eventos y contenido promocional que mantenga viva la relación con la audiencia.",
    long_description_en:
      "Landing-style website developed for a radio station, designed to clearly and attractively showcase its programming, hosts, and overall content proposition. The page works as a central hub for brand promotion, allowing the station to highlight its shows, reinforce its visual identity, and redirect users to key areas such as donations, payments, and digital engagement initiatives. It is also built to remain constantly updated, making it easy to add new segments, special campaigns, events, and promotional content that keeps the audience engaged.",
    link: null,
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/puravidalogo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/puravidalogo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/puravidalogo2.webp",
    ],
  },
  {
    title: "Producción de Video",
    type: "video",
    short_description_es:
      "Producción de video promocional y tutorial con apoyo de inteligencia artificial, animaciones modernas y recursos visuales personalizados para cada marca.",
    short_description_en:
      "Promotional and tutorial video production powered by AI, featuring modern animations and custom visual assets for each brand.",
    long_description_es:
      "Proyecto enfocado en la producción de video para marcas, campañas y productos digitales. Incluye la creación de videos promocionales, tutoriales de uso y piezas visuales explicativas para que los clientes puedan comunicar mejor el valor de sus herramientas. También incorpora generación de video con apoyo de inteligencia artificial, incluyendo mascotas en 3D, animaciones cortas, recursos modernos y estilos visuales diferenciadores. Esta línea de trabajo permite complementar el desarrollo de software con materiales audiovisuales listos para mercadeo, onboarding y comunicación directa con usuarios finales.",
    long_description_en:
      "Project focused on video production for brands, campaigns, and digital products. It includes the creation of promotional videos, usage tutorials, and explanatory visual pieces that help clients better communicate the value of their tools. It also incorporates AI-assisted video generation, including 3D mascots, short animations, modern assets, and distinctive visual styles. This line of work complements software development with audiovisual material ready for marketing, onboarding, and direct communication with end users.",
    link: null,
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/videologo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/videologo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/videologo2.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/videologo3.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/videologo4.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/videologo5.webp",
    ],
  },
  {
    title: "Gracia Plus",
    type: "website",
    short_description_es:
      "Landing page moderna para promocionar la aplicación Gracia Plus y destacar sus principales funcionalidades y experiencia digital.",
    short_description_en:
      "Modern landing page designed to promote the Gracia Plus app and highlight its core features and digital experience.",
    long_description_es:
      "Sitio web moderno creado para promocionar la aplicación Gracia Plus y comunicar de forma visualmente atractiva sus principales funcionalidades. La página está pensada para reforzar la presencia digital del producto, presentar sus beneficios clave y servir como apoyo comercial y promocional para la aplicación. Su enfoque combina diseño actual, estructura clara y una presentación orientada a destacar la experiencia que ofrece la app a sus usuarios.",
    long_description_en:
      "Modern website created to promote the Gracia Plus app and visually showcase its main features. The page is designed to strengthen the product’s digital presence, present its key benefits, and serve as a commercial and promotional support channel for the application. Its approach combines contemporary design, clear structure, and a presentation focused on highlighting the experience the app delivers to its users.",
    link: null,
    stats: null,
    main_image:
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/gracialogo.webp",
    children_images: [
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/gracialogo1.webp",
      "https://mafisa-group-assets.nyc3.cdn.digitaloceanspaces.com/lobsterlabs/gracialogo2.webp",
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

function ProjectCard({ project }: { project: ProjectItem }) {
  const [expanded, setExpanded] = useState(false);
  const { t, language } = useLanguage();
  const shortDesc =
    language === "es"
      ? project.short_description_es
      : project.short_description_en;
  const fullDesc =
    language === "es" ? project.long_description_es : project.long_description_en;

  const typeLabel: Record<ProjectType, string> =
    language === "es"
      ? {
          app: "Aplicación",
          website: "Sitio web",
          "3d": "3D",
          system: "Sistema",
          video: "Video",
        }
      : {
          app: "App",
          website: "Website",
          "3d": "3D",
          system: "System",
          video: "Video",
        };

  const statsItems = [
    project.stats?.rating
      ? { label: t.rating, value: `${project.stats.rating} ★` }
      : null,
    project.stats?.reviews
      ? {
          label: language === "es" ? "Reseñas" : "Reviews",
          value: project.stats.reviews,
        }
      : null,
    project.stats?.downloads
      ? { label: t.downloads, value: project.stats.downloads }
      : null,
    project.stats?.content_rating
      ? { label: t.content, value: project.stats.content_rating }
      : null,
  ].filter(
    (
      item,
    ): item is {
      label: string;
      value: string;
    } => item !== null,
  );

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
            src={project.main_image}
            alt={project.title}
            className={`w-[52px] h-[52px] rounded-[14px] ${project.type === "app" ? "object-cover" : "object-contain bg-white p-1"}`}
            style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                {typeLabel[project.type]}
              </span>
              <h3 className="text-base font-semibold text-gray-900 font-dm-sans leading-tight">
                {project.title}
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

            {project.link && (
              <div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-900 underline break-all"
                >
                  {project.link}
                </a>
              </div>
            )}

            {statsItems.length > 0 && (
              <div className="flex justify-around border-t border-b border-gray-100 py-4 my-2">
                {statsItems.map((item, index) => (
                  <React.Fragment key={item.label}>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.value}
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">
                        {item.label}
                      </div>
                    </div>
                    {index < statsItems.length - 1 && (
                      <div className="w-px bg-gray-200" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            <div
              className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {project.children_images.map((src, i) => (
                <ScreenshotImage
                  key={i}
                  src={src}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className={`h-[220px] md:h-[260px] w-auto rounded-xl object-cover bg-gray-100${i === 0 ? " ml-3 md:ml-4" : ""}${i === project.children_images.length - 1 ? " mr-3 md:mr-4" : ""}`}
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

      {PROJECTS.map((project) => (
        <ProjectCard key={project.title} project={project} />
      ))}
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
