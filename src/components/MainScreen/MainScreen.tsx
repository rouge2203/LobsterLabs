import React, { Suspense, useState, useEffect } from "react";
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
    <div
      className={`min-h-[100dvh] md:h-screen overflow-hidden bg-white flex flex-col md:flex-row ${
        isMobile ? "" : "md:overflow-hidden"
      }`}
    >
      {/* Mobile layout */}
      <div
        className={`flex flex-col md:hidden ${
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
          <div className="flex-1 min-h-0 flex items-center justify-center">
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
        <div
          className={`flex flex-col min-h-screen relative bg-white flex-1 ${
            menuOpen ? "overflow-y-auto" : "overflow-hidden h-screen"
          }`}
        >
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
          <div
            className={`flex flex-1 min-h-0 ${
              menuOpen ? "min-h-[100vh]" : ""
            }`}
          >
            <div className="flex-1 flex flex-col justify-center pl-20 pr-32">
              <div className="mt-0">
                <HeroSection desktop />
                <NavigationCards onCardClick={handleCardClick} desktop />
                <CTAButton desktop onClick={() => handleCardClick("contact")} />
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative min-w-0 overflow-hidden bg-white before:content-[''] before:absolute before:right-0 before:top-0 before:bottom-0 before:w-24 before:bg-gradient-to-l before:from-gray-100/25 before:to-transparent before:pointer-events-none">
              <MacViewerErrorBoundary fallback={<MacViewerSkeleton />}>
                <div className="w-full h-full min-h-[70vh] flex items-center justify-center -mt-8">
                  <SuspenseMacViewer desktop />
                </div>
              </MacViewerErrorBoundary>
              <DesktopDecorations />
            </div>
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
