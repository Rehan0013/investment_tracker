"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BannerItem {
  _id: string;
  title?: string;
  description?: string;
  imageUrl: string;
  order?: number;
}

interface BannerCarouselProps {
  banners: BannerItem[];
  variant?: "landing" | "dashboard";
  className?: string;
}

interface BannerCardProps {
  banner: BannerItem;
  isLanding?: boolean;
  priority?: boolean;
  compact?: boolean;
}

function BannerCard({ banner, isLanding, priority, compact }: BannerCardProps) {
  const isBonus =
    banner.title?.toLowerCase().includes("bonus") ||
    banner.description?.toLowerCase().includes("bonus");

  return (
    <div
      className={cn(
        "group relative w-full h-full overflow-hidden rounded-xl sm:rounded-2xl border transition-all duration-300",
        isLanding
          ? "border-border dark:border-white/[0.12] bg-card dark:bg-[#101116] shadow-sm hover:shadow-[0_12px_36px_rgba(139,92,246,0.18)] hover:border-[#8b5cf6]/50"
          : "border-border/80 dark:border-white/[0.08] bg-card dark:bg-[#101116] shadow-xs hover:border-[#8b5cf6]/40"
      )}
    >
      {/* 16:9 Banner Image */}
      <Image
        src={banner.imageUrl}
        alt={banner.title || "Festival & Bonus Announcement"}
        fill
        sizes={
          compact
            ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            : "(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
        }
        priority={priority}
        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

      {/* Horizon glow effect for landing variant */}
      {isLanding && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-[#8b5cf6]/25 blur-xl pointer-events-none rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
      )}

      {/* Content overlay: Floating badge, Title, Description */}
      {(banner.title || banner.description) && (
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 flex flex-col justify-end text-white z-10 pointer-events-none",
            compact
              ? "p-3 sm:p-4 space-y-1"
              : "p-4 sm:p-6 lg:p-7 space-y-1.5 sm:space-y-2"
          )}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/25 text-[10px] sm:text-[11px] font-semibold text-white shadow-xs self-start">
            {isBonus ? (
              <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#8b5cf6] shrink-0" />
            ) : (
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
            )}
            <span>{isBonus ? "Special Bonus" : "Festival Greetings"}</span>
          </div>

          {/* Title */}
          {banner.title && (
            <h3
              className={cn(
                "font-extrabold tracking-tight drop-shadow-md text-white line-clamp-1",
                compact
                  ? "text-xs sm:text-sm lg:text-base"
                  : "text-sm sm:text-lg lg:text-xl"
              )}
            >
              {banner.title}
            </h3>
          )}

          {/* Description */}
          {banner.description && (
            <p
              className={cn(
                "text-zinc-200 line-clamp-1 sm:line-clamp-2 drop-shadow-sm",
                compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"
              )}
            >
              {banner.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BRANDLYFT-INSPIRED 3D CURVED ARC CAROUSEL FOR LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
function Landing3DArcCarousel({
  banners,
  className,
}: {
  banners: BannerItem[];
  className?: string;
}) {
  const total = banners.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);
  const [cardWidth, setCardWidth] = useState(380);

  // Responsive card width calculation
  useEffect(() => {
    const updateWidth = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setCardWidth(270);
      } else if (w < 1024) {
        setCardWidth(340);
      } else {
        setCardWidth(410);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const cardSpacing = cardWidth + 18;

  // Auto-advance every 4.5 seconds (pauses on hover)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4500);

    return () => clearInterval(timer);
  }, [total, isPaused]);

  // Touch and Mouse swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 45) {
      setCurrentIndex((prev) => prev - 1);
    } else if (diff < -45) {
      setCurrentIndex((prev) => prev + 1);
    }
    setTouchStartX(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (mouseStartX === null) return;
    const diff = e.clientX - mouseStartX;
    if (diff > 45) {
      setCurrentIndex((prev) => prev - 1);
    } else if (diff < -45) {
      setCurrentIndex((prev) => prev + 1);
    }
    setMouseStartX(null);
  };

  // Mathematical formula for the 3D Arc Curvature
  // Downward convex arch curvature (center card is apex, outer cards bend downwards)
  const getArcTransform = (k: number, spacing: number) => {
    const absK = Math.abs(k);
    const x = k * spacing;

    // Concave 3D perspective rotation around Y (cards angle inward towards center)
    const rotateY = -k * 4.5;

    // Downward arch curvature along Y axis (center is apex, sides bend downwards)
    const translateY = Math.pow(absK, 1.45) * 14;

    // Tangent rotation along Z axis following the downward arch slope
    // (left cards slope down to the left; right cards slope down to the right)
    const rotateZ = k * 3.0;

    // Subtle scale depth
    const scale = Math.max(0.82, 1 - absK * 0.045);

    // Layering: center card sits prominently on top
    const zIndex = 50 - absK * 10;

    // Soft opacity falloff for outer cards bleeding off edges
    const opacity = absK > 3 ? 0 : absK === 3 ? 0.45 : absK === 2 ? 0.88 : 1;

    return { x, translateY, rotateY, rotateZ, scale, zIndex, opacity };
  };

  // 7 panoramic slots across the curved cylinder (-3 to +3)
  const slots = [-3, -2, -1, 0, 1, 2, 3];
  const activeBannerIndex = ((currentIndex % total) + total) % total;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      className={cn(
        "relative w-full overflow-hidden select-none py-6 sm:py-10",
        className
      )}
    >
      {/* Horizon Violet Ambient Glow Behind the 3D Stage */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[220px] bg-[#8b5cf6]/15 blur-[120px] pointer-events-none rounded-full" />

      {/* 3D Perspective Stage */}
      <div
        className="relative w-full h-[240px] sm:h-[300px] md:h-[340px] lg:h-[370px] flex items-center justify-center pt-2 pb-6"
        style={{
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {slots.map((k) => {
          const virtualIndex = currentIndex + k;
          const bannerIndex = ((virtualIndex % total) + total) % total;
          const banner = banners[bannerIndex];
          const isCenter = k === 0;
          const t = getArcTransform(k, cardSpacing);
          const isBonus =
            banner.title?.toLowerCase().includes("bonus") ||
            banner.description?.toLowerCase().includes("bonus");

          return (
            <motion.div
              key={virtualIndex}
              initial={false}
              animate={{
                x: t.x,
                y: t.translateY,
                rotateY: t.rotateY,
                rotateZ: t.rotateZ,
                scale: t.scale,
                opacity: t.opacity,
                zIndex: t.zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 26,
                mass: 0.8,
              }}
              onClick={() => {
                if (k !== 0) setCurrentIndex((prev) => prev + k);
              }}
              style={{
                width: cardWidth,
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }}
              className={cn(
                "absolute aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden border transition-all duration-300",
                isCenter
                  ? "border-[#8b5cf6]/60 ring-2 ring-[#8b5cf6]/30 shadow-[0_20px_60px_-10px_rgba(139,92,246,0.35)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.95)] cursor-default"
                  : "border-border dark:border-white/[0.12] shadow-xl hover:border-[#8b5cf6]/40 cursor-pointer"
              )}
            >
              {/* 16:9 Banner Image */}
              <Image
                src={banner.imageUrl}
                alt={banner.title || "Festival & Bonus"}
                fill
                sizes="(max-width: 640px) 270px, (max-width: 1024px) 340px, 420px"
                priority={isCenter}
                className="object-cover w-full h-full transition-transform duration-700 ease-out"
              />

              {/* Dark Gradient Overlay for Crisp Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

              {/* Center Glow Accent */}
              {isCenter && (
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-14 bg-[#8b5cf6]/30 blur-xl pointer-events-none rounded-full" />
              )}

              {/* Content Overlay */}
              {(banner.title || banner.description) && (
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 p-3.5 sm:p-5 flex flex-col justify-end text-white z-10 pointer-events-none transition-opacity duration-300",
                    isCenter ? "opacity-100" : "opacity-80"
                  )}
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-[10px] sm:text-[11px] font-semibold text-white shadow-xs self-start mb-1 sm:mb-1.5">
                    {isBonus ? (
                      <Gift className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#8b5cf6] shrink-0" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                    )}
                    <span>{isBonus ? "Special Bonus" : "Festival Greetings"}</span>
                  </div>

                  {/* Title */}
                  {banner.title && (
                    <h3 className="text-xs sm:text-base font-extrabold tracking-tight drop-shadow-md text-white line-clamp-1">
                      {banner.title}
                    </h3>
                  )}

                  {/* Description */}
                  {banner.description && (
                    <p className="text-[10px] sm:text-xs text-zinc-200 line-clamp-1 drop-shadow-sm mt-0.5">
                      {banner.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls for Landing Page */}
      {total > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            aria-label="Previous Banner"
            className="absolute left-3 sm:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-40 h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center transition-all cursor-pointer bg-black/60 hover:bg-[#8b5cf6] text-white border border-white/20 backdrop-blur-md shadow-lg hover:scale-110 active:scale-90"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </button>

          {/* Next Button */}
          <button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            aria-label="Next Banner"
            className="absolute right-3 sm:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-40 h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center transition-all cursor-pointer bg-black/60 hover:bg-[#8b5cf6] text-white border border-white/20 backdrop-blur-md shadow-lg hover:scale-110 active:scale-90"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6 z-30">
            {banners.map((_, idx) => {
              const isActive = activeBannerIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    const diff = idx - activeBannerIndex;
                    setCurrentIndex((prev) => prev + diff);
                  }}
                  aria-label={`Go to banner ${idx + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    isActive
                      ? "w-7 bg-[#8b5cf6] shadow-[0_0_10px_#8b5cf6]"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLEAN DASHBOARD CAROUSEL VARIANT
// ─────────────────────────────────────────────────────────────────────────────
function DashboardCarousel({
  banners,
  className,
}: {
  banners: BannerItem[];
  className?: string;
}) {
  const total = banners.length;

  // Mobile Carousel State (Single slide at a time)
  const [mobileIndex, setMobileIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // Desktop Carousel State (3 items per view track when total > 3)
  const [desktopIndex, setDesktopIndex] = useState(0);
  const maxDesktopIndex = Math.max(0, total - 3);

  const nextMobileSlide = useCallback(() => {
    setDirection(1);
    setMobileIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevMobileSlide = useCallback(() => {
    setDirection(-1);
    setMobileIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const nextDesktopSlide = useCallback(() => {
    setDesktopIndex((prev) => (prev >= maxDesktopIndex ? 0 : prev + 1));
  }, [maxDesktopIndex]);

  const prevDesktopSlide = useCallback(() => {
    setDesktopIndex((prev) => (prev <= 0 ? maxDesktopIndex : prev - 1));
  }, [maxDesktopIndex]);

  // Auto-advance timers
  useEffect(() => {
    if (isPaused) return;

    let mobileTimer: NodeJS.Timeout | null = null;
    if (total > 1) {
      mobileTimer = setInterval(() => {
        nextMobileSlide();
      }, 5500);
    }

    let desktopTimer: NodeJS.Timeout | null = null;
    if (total > 3) {
      desktopTimer = setInterval(() => {
        nextDesktopSlide();
      }, 6000);
    }

    return () => {
      if (mobileTimer) clearInterval(mobileTimer);
      if (desktopTimer) clearInterval(desktopTimer);
    };
  }, [total, isPaused, nextMobileSlide, nextDesktopSlide]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const currentMobileBanner = banners[mobileIndex];

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={cn("w-full select-none", className)}
    >
      {/* MOBILE VIEW (< 768px): Single 16:9 card carousel */}
      <div className="block md:hidden">
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-black/20 rounded-2xl shadow-sm">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentMobileBanner._id || mobileIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.25 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -8000 || offset.x < -60) {
                  nextMobileSlide();
                } else if (swipe > 8000 || offset.x > 60) {
                  prevMobileSlide();
                }
              }}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              <BannerCard
                banner={currentMobileBanner}
                priority={mobileIndex === 0}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows (Mobile) */}
          {total > 1 && (
            <>
              <button
                onClick={prevMobileSlide}
                aria-label="Previous Slide"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-sm shadow-md"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
              </button>

              <button
                onClick={nextMobileSlide}
                aria-label="Next Slide"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full flex items-center justify-center transition-transform active:scale-90 cursor-pointer bg-black/40 hover:bg-black/60 text-white border border-white/20 backdrop-blur-sm shadow-md"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </>
          )}

          {/* Indicator Dots (Mobile) */}
          {total > 1 && (
            <div className="absolute bottom-2.5 right-3.5 z-20 flex items-center gap-1.5">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > mobileIndex ? 1 : -1);
                    setMobileIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={cn(
                    "transition-all duration-300 rounded-full cursor-pointer",
                    idx === mobileIndex
                      ? "w-5 h-1.5 bg-white shadow-xs"
                      : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DESKTOP VIEW (>= 768px): 3-column / 3-card sliding track */}
      <div className="hidden md:block">
        {total === 1 && (
          <div className="w-full max-w-xl mx-auto">
            <div className="relative w-full aspect-[16/9]">
              <BannerCard banner={banners[0]} priority />
            </div>
          </div>
        )}

        {total === 2 && (
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
            {banners.map((b, idx) => (
              <div key={b._id || idx} className="relative w-full aspect-[16/9]">
                <BannerCard banner={b} priority={idx === 0} compact />
              </div>
            ))}
          </div>
        )}

        {total === 3 && (
          <div className="grid grid-cols-3 gap-4 w-full">
            {banners.map((b, idx) => (
              <div key={b._id || idx} className="relative w-full aspect-[16/9]">
                <BannerCard banner={b} priority={idx === 0} compact />
              </div>
            ))}
          </div>
        )}

        {total > 3 && (
          <div className="relative w-full group">
            <div className="relative w-full overflow-hidden rounded-2xl">
              <div
                className="flex gap-4 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(calc(-${desktopIndex} * (100% / 3 + 1rem / 3)))`,
                }}
              >
                {banners.map((b, idx) => (
                  <div
                    key={b._id || idx}
                    className="w-[calc((100%-2rem)/3)] shrink-0 aspect-[16/9] relative"
                  >
                    <BannerCard banner={b} priority={idx < 3} compact />
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Navigation Arrows */}
            <button
              onClick={prevDesktopSlide}
              aria-label="Previous banners"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer opacity-75 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-md bg-background/85 hover:bg-[#8b5cf6] hover:text-white text-foreground border border-border dark:border-white/10 backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              onClick={nextDesktopSlide}
              aria-label="Next banners"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer opacity-75 group-hover:opacity-100 hover:scale-110 active:scale-95 shadow-md bg-background/85 hover:bg-[#8b5cf6] hover:text-white text-foreground border border-border dark:border-white/10 backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.2]" />
            </button>

            {/* Desktop Slide Indicators */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              {Array.from({ length: total - 2 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setDesktopIndex(idx)}
                  aria-label={`Go to banner slide group ${idx + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    idx === desktopIndex
                      ? "w-5 bg-[#8b5cf6]"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED COMPONENT ROUTER
// ─────────────────────────────────────────────────────────────────────────────
export function BannerCarousel({
  banners,
  variant = "dashboard",
  className,
}: BannerCarouselProps) {
  // CRITICAL RULE: "it should only visible if there is any image in carousel"
  if (!banners || banners.length === 0) {
    return null;
  }

  if (variant === "landing") {
    return <Landing3DArcCarousel banners={banners} className={className} />;
  }

  return <DashboardCarousel banners={banners} className={className} />;
}
