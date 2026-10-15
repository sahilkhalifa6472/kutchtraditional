import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BannerSlide } from '../types';
import { INITIAL_SLIDES } from '../data/slides';

interface HeroBannerProps {
  onShopNow: () => void;
  onApplyPromo?: (code: string) => void;
  slides?: BannerSlide[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopNow,
  onApplyPromo,
  slides = INITIAL_SLIDES,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const safeSlides = slides.length > 0 ? slides : INITIAL_SLIDES;
  const activeSlideIdx = currentSlide < safeSlides.length ? currentSlide : 0;
  const active = safeSlides[activeSlideIdx];

  if (!active) return null; // Safety check

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % safeSlides.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
    }
  };

  const handleAction = () => {
    if (onApplyPromo && active.code) {
      onApplyPromo(active.code);
    }
    onShopNow();
  };

  return (
    <div className="w-full py-2">
      {/* Curved Promo Card with Inset Scooped Bottom Cutout */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative overflow-hidden rounded-[26px] sm:rounded-[34px] bg-[#F4F8EC] p-5 sm:p-8 pb-7 sm:pb-9 shadow-[0_12px_28px_rgba(130,175,50,0.18)] min-h-[185px] sm:min-h-[230px] flex items-center transition-all duration-500 touch-pan-y"
      >
        {/* Full Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-[#E8F0DC] animate-pulse" />
          )}
          <img
            src={active.imageSrc}
            alt={active.titleLine1}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-right transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Subtle gradient overlay on left so text is clearly readable */}
          <div className="absolute inset-y-0 left-0 w-[72%] sm:w-[62%] bg-gradient-to-r from-white/95 via-white/80 to-transparent pointer-events-none"></div>
        </div>

        {/* Content Left Side */}
        <div className="z-10 max-w-[62%] sm:max-w-[55%] flex flex-col items-start pr-1">
          {/* "Limited Offer" Black Pill Badge */}
          <div 
            className="inline-flex items-center px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-tight text-white mb-2.5 sm:mb-3 shadow-xs"
            style={{ backgroundColor: active.tagBgColor || '#12170F' }}
          >
            <span>{active.tag}</span>
          </div>

          {/* Headline - Exact Dark Tone & Line Break from Screenshot */}
          <h2 className="text-[18px] sm:text-2xl lg:text-[27px] font-extrabold leading-[1.22] text-[#141C10] tracking-tight drop-shadow-xs mb-3.5 sm:mb-4">
            {active.titleLine1}
            <br />
            {active.titleLine2}
          </h2>

          {/* "Shop Now" Pill Button with Distinct White Arrow Circle */}
          <button
            onClick={handleAction}
            className="inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-[#111612] hover:bg-black active:scale-95 text-white text-xs sm:text-sm font-bold transition-all shadow-md group cursor-pointer"
          >
            <span>{active.buttonText}</span>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-[#111612] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shadow-xs">
              <ArrowUpRight size={15} strokeWidth={2.8} />
            </div>
          </button>
        </div>

        {/* EXACT SCOOPED ARCH NOTCH WITH 3 DOTS (Matches the user's screenshot) */}
        <div className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          {/* Smooth Inverted-Fillet Arch SVG matching page background */}
          <div className="relative flex items-center justify-center">
            <svg
              viewBox="0 0 136 24"
              className="w-[136px] h-[24px] fill-[#F8FAF6] drop-shadow-[0_-1px_1px_rgba(0,0,0,0.03)]"
            >
              {/* Organic concave-to-convex curved cutout entering into the green card */}
              <path d="M 0 24 C 15 24 18 0 34 0 L 102 0 C 118 0 121 24 136 24 Z" />
            </svg>

            {/* Dots positioned right inside the scooped arch */}
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 pt-1 pointer-events-auto">
              {safeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`transition-all duration-300 cursor-pointer ${
                    activeSlideIdx === idx
                      ? 'w-6 h-2 bg-[#9DC941] rounded-full'
                      : 'w-2 h-2 bg-[#D1D7C9] hover:bg-[#A9B3A1] rounded-full'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
