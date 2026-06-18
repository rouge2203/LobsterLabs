import { Suspense, useState, useEffect } from "react";
import { TopBar } from "./TopBar";
import { HeroSection } from "./HeroSection";
import { MacViewer, MacViewerSkeleton } from "./MacViewer";
import { NavigationCards } from "./NavigationCards";
import { CTAButton } from "./CTAButton";
import { OverlayDialog } from "./OverlayDialog";
import { DesktopDecorations } from "./DesktopDecorations";
import { HamburgerMenu } from "./HamburgerMenu";
import { MobileLanguageFlags } from "./MobileLanguageFlags";
import { MacViewerErrorBoundary } from "./MacViewerErrorBoundary";

type DialogType = "who" | "projects" | "services" | "contact" | null;

export function MainScreen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const handleCardClick = (id: "who" | "projects" | "services" | "contact") => {
    setDialogType(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };

  return (
    <div className="min-h-[100dvh] md:h-screen overflow-hidden bg-black text-white flex flex-col md:block">
      {/* Mobile layout */}
      <div
        className={`flex flex-col md:hidden relative ${
          menuOpen
            ? "min-h-[100dvh] overflow-y-auto overscroll-none"
            : "h-[100dvh] overflow-hidden"
        }`}
      >
        {!menuOpen && (
          <TopBar
            onMenuClick={() => {
              handleCloseDialog();
              setMenuOpen(true);
            }}
            onLogoClick={handleCloseDialog}
            showFlags={false}
            dialogOpen={dialogOpen}
          />
        )}
        <HamburgerMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onNavClick={(id) => {
            setDialogType(id);
            setDialogOpen(true);
          }}
          onContactClick={() => handleCardClick("contact")}
          mobile={true}
        />
        <div className={`flex flex-col ${menuOpen ? "h-[100dvh] overflow-hidden" : "flex-1 overflow-hidden"}`}>
          <div className="flex-shrink-0">
            <HeroSection />
          </div>
          <div className="relative flex-1 min-h-0 flex items-center justify-center">
            <div className="absolute w-[80vw] h-[80vw] max-w-[420px] max-h-[420px] noir-glow blur-2xl animate-noir-pulse pointer-events-none" />
            <MacViewerErrorBoundary fallback={<MacViewerSkeleton />}>
              <SuspenseMacViewer mobile />
            </MacViewerErrorBoundary>
          </div>
          <div className="flex-shrink-0">
            <NavigationCards onCardClick={handleCardClick} />
          </div>
          <div className="flex-shrink-0 pb-[calc(env(safe-area-inset-bottom,12px)+8px)] pt-2 px-4 mb-2">
            <CTAButton onClick={() => handleCardClick("contact")} />
          </div>
        </div>
        {isMobile && !menuOpen && <MobileLanguageFlags />}
      </div>

      {/* Desktop layout - hidden on mobile to avoid duplicate WebGL contexts */}
      {!isMobile && (
        <div className="relative hidden md:block h-screen overflow-hidden bg-black noir-grain">
          {/* Background atmosphere */}
          <div className="absolute inset-0 z-0 noir-lines" />
          <div className="absolute right-[6%] top-1/2 -translate-y-1/2 w-[52vw] h-[52vw] max-w-[800px] max-h-[800px] z-0 noir-glow blur-3xl animate-noir-pulse pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 z-0 flex justify-center overflow-hidden pointer-events-none select-none">
            <span className="font-bricolage font-extrabold leading-none noir-watermark text-[24vw] translate-y-[20%] whitespace-nowrap">
              lobster
            </span>
          </div>

          {/* Brain model as a floating backdrop (non-interactive so the UI stays clickable) */}
          <div className="absolute right-0 top-0 h-full w-[62%] z-[1] pointer-events-none animate-noir-float">
            <MacViewerErrorBoundary fallback={<MacViewerSkeleton />}>
              <div className="w-full h-full flex items-center justify-center">
                <SuspenseMacViewer desktop />
              </div>
            </MacViewerErrorBoundary>
          </div>

          {/* Foreground content */}
          <div className="relative z-10 flex h-full flex-col">
            {!menuOpen && (
              <TopBar
                desktop
                onMenuClick={() => {
                  handleCloseDialog();
                  setMenuOpen(true);
                }}
                onLogoClick={handleCloseDialog}
                dialogOpen={dialogOpen}
              />
            )}
            <div className="flex flex-1 items-center">
              <div className="pl-12 lg:pl-20 pr-8 w-full max-w-[600px]">
                <HeroSection desktop />
                <NavigationCards onCardClick={handleCardClick} desktop />
                <CTAButton desktop onClick={() => handleCardClick("contact")} />
              </div>
            </div>
          </div>

          <DesktopDecorations />

          {/* Menu overlays from the top, preserving its dropdown behavior */}
          <div className="absolute inset-x-0 top-0 z-[60]">
            <HamburgerMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onNavClick={(id) => {
                setDialogType(id);
                setDialogOpen(true);
              }}
              onContactClick={() => handleCardClick("contact")}
              mobile={false}
            />
          </div>
        </div>
      )}

      <OverlayDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        type={dialogType}
        isMobile={isMobile}
      />
    </div>
  );
}

function SuspenseMacViewer({
  mobile,
  desktop,
  useStaticFallback = false,
}: {
  mobile?: boolean;
  desktop?: boolean;
  useStaticFallback?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || useStaticFallback) {
    return <MacViewerSkeleton />;
  }

  return (
    <div className="w-full h-full flex justify-center">
      <Suspense fallback={<MacViewerSkeleton />}>
        <MacViewer mobile={!!mobile} desktop={!!desktop} />
      </Suspense>
    </div>
  );
}
