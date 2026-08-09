import React from 'react';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon' | 'badge' | 'light' | 'dark';
  showText?: boolean;
  className?: string;
  useImage?: boolean;
}

export const LOGO_IMAGE_PATH = '/src/assets/images/mart_shk_logo_1786037257187.jpg';
export const LOGO_ICON_PATH = '/src/assets/images/mart_shk_icon_1786037271469.jpg';

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  showText = true,
  className = '',
  useImage = false,
}) => {
  // Dimensions mapping
  const sizeMap = {
    xs: { icon: 24, height: 'h-7', text: 'text-sm', subText: 'text-[9px]', gap: 'gap-1.5' },
    sm: { icon: 32, height: 'h-9', text: 'text-base', subText: 'text-[10px]', gap: 'gap-2' },
    md: { icon: 42, height: 'h-11', text: 'text-xl', subText: 'text-xs', gap: 'gap-2.5' },
    lg: { icon: 54, height: 'h-14', text: 'text-2xl', subText: 'text-sm', gap: 'gap-3' },
    xl: { icon: 72, height: 'h-20', text: 'text-3xl', subText: 'text-base', gap: 'gap-3.5' },
    '2xl': { icon: 96, height: 'h-28', text: 'text-4xl', subText: 'text-lg', gap: 'gap-4' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isLight = variant === 'light';

  // If useImage is true or in full image display mode
  if (useImage) {
    if (variant === 'icon') {
      return (
        <div className={`inline-flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 ${className}`}>
          <img
            src={LOGO_ICON_PATH}
            alt="Construction Mart SHK Icon"
            className={`${currentSize.height} w-auto object-contain`}
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }
    return (
      <div className={`inline-flex items-center ${currentSize.gap} ${className}`}>
        <img
          src={LOGO_IMAGE_PATH}
          alt="Construction MART shk Logo"
          className={`${currentSize.height} w-auto object-contain rounded-lg`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Vector SVG rendering matching the exact brand artwork
  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none group ${className}`}>
      {/* SVG Icon Emblem */}
      <div 
        className="relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Background Skyscrapers / Buildings */}
          {/* Left Orange Tower */}
          <path
            d="M 45 42 L 57 34 L 57 65 L 45 68 Z"
            fill="#F97316"
          />
          <path
            d="M 37 49 L 45 42 L 45 68 L 37 71 Z"
            fill="#FB923C"
          />

          {/* Center Tall Orange & Navy Skyscraper */}
          <path
            d="M 57 26 L 68 18 L 68 62 L 57 65 Z"
            fill="#EA580C"
          />
          <path
            d="M 68 18 L 79 26 L 79 62 L 68 62 Z"
            fill="#1E3A8A"
          />

          {/* Building Window Lines */}
          <line x1="49" y1="45" x2="53" y2="42" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="49" y1="52" x2="53" y2="49" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="49" y1="59" x2="53" y2="56" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />

          <line x1="61" y1="30" x2="65" y2="27" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="61" y1="38" x2="65" y2="35" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="61" y1="46" x2="65" y2="43" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />
          <line x1="61" y1="54" x2="65" y2="51" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.8" />

          {/* Stylized House Roof Gable */}
          {/* Left Slant */}
          <path
            d="M 22 70 L 60 38 L 67 44 L 29 76 Z"
            fill="#0F294A"
          />
          {/* Right Slant with Integrated Hammer */}
          <path
            d="M 60 38 L 98 70 L 91 76 L 53 44 Z"
            fill="#0F294A"
          />

          {/* Hammer Tool on Right Roof */}
          {/* Hammer Head */}
          <path
            d="M 72 38 L 84 30 L 89 36 L 77 44 Z"
            fill="#1E3A8A"
          />
          <path
            d="M 84 30 L 92 34 L 88 40 L 80 36 Z"
            fill="#0F294A"
          />
          {/* Hammer Claw */}
          <path
            d="M 72 38 C 70 34 68 32 64 33 C 65 37 68 39 72 38 Z"
            fill="#1E3A8A"
          />

          {/* Central Stylized Curved Elements ('C' shape & loop) */}
          <path
            d="M 52 56 C 58 50 68 52 72 58 C 75 62 74 68 69 72 C 64 76 56 75 52 70 L 59 66 C 61 69 65 69 67 67 C 69 65 69 62 67 60 C 65 58 60 58 56 61 Z"
            fill="#F97316"
          />
          <path
            d="M 60 62 C 63 60 68 62 70 65 C 72 68 70 72 66 75 C 62 78 54 78 49 73 C 44 68 46 59 52 55 L 56 60 C 52 63 51 68 54 71 C 57 74 62 74 64 72 C 66 70 67 67 65 65 C 64 63 61 63 60 62 Z"
            fill="#0F294A"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && variant !== 'icon' && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline">
            <span className={`font-extrabold tracking-tight ${currentSize.text} ${isLight ? 'text-white' : 'text-[#0f294a]'}`}>
              Construction
            </span>
            <span className={`font-black uppercase tracking-wider ml-1.5 ${currentSize.text} ${isLight ? 'text-amber-300' : 'text-[#0f294a]'}`}>
              MART
            </span>
          </div>
          <div className="flex justify-end pr-1 mt-0.5">
            <span className={`font-black lowercase tracking-widest text-[#ea580c] ${currentSize.subText}`}>
              shk
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
