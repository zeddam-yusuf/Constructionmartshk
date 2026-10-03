import React from 'react';
import cmartLogoImg from '../src/assets/images/cmart_logo_1790878845823.jpg';

export interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon' | 'badge' | 'light' | 'dark';
  showText?: boolean;
  className?: string;
  useImage?: boolean;
}

export const LOGO_IMAGE_PATH = cmartLogoImg;
export const LOGO_ICON_PATH = cmartLogoImg;

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  showText = true,
  className = '',
}) => {
  // Dimensions mapping
  const sizeMap = {
    xs: { icon: 28, height: 'h-7', text: 'text-xs sm:text-sm', subText: 'text-[8px] sm:text-[9px]', gap: 'gap-1.5' },
    sm: { icon: 34, height: 'h-8', text: 'text-sm sm:text-base', subText: 'text-[9px] sm:text-[10px]', gap: 'gap-1.5 sm:gap-2' },
    md: { icon: 44, height: 'h-11', text: 'text-base sm:text-xl', subText: 'text-[10px] sm:text-xs', gap: 'gap-2 sm:gap-2.5' },
    lg: { icon: 52, height: 'h-13', text: 'text-lg sm:text-2xl', subText: 'text-xs sm:text-sm', gap: 'gap-2 sm:gap-3' },
    xl: { icon: 72, height: 'h-20', text: 'text-2xl sm:text-3xl', subText: 'text-sm sm:text-base', gap: 'gap-3 sm:gap-3.5' },
    '2xl': { icon: 96, height: 'h-28', text: 'text-3xl sm:text-4xl', subText: 'text-base sm:text-lg', gap: 'gap-3.5 sm:gap-4' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;
  const isLight = variant === 'light';

  return (
    <div className={`inline-flex items-center ${currentSize.gap} select-none group min-w-0 max-w-full ${className}`}>
      {/* Company Logo Emblem */}
      <div
        className="relative shrink-0 flex items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80 transition-transform duration-200 group-hover:scale-105"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <img
          src={cmartLogoImg}
          alt="Construction Mart SHK Logo"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Brand Typography */}
      {showText && variant !== 'icon' && (
        <div className="flex flex-col justify-center leading-none min-w-0">
          <div className="flex items-baseline whitespace-nowrap">
            <span className={`font-extrabold tracking-tight ${currentSize.text} ${isLight ? 'text-white' : 'text-[#0f294a]'}`}>
              Construction
            </span>
            <span className={`font-black uppercase tracking-wider ml-1 sm:ml-1.5 ${currentSize.text} ${isLight ? 'text-amber-300' : 'text-[#0f294a]'}`}>
              MART
            </span>
          </div>
          <div className="flex justify-end pr-0.5 mt-0.5">
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
