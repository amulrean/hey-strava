'use client';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export function BrandLogo({ className = '', size = 32 }: BrandLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path d="M4 4h24v24H4z" fill="#1E293B"/>
        <path d="M8 8h2v2H8zM12 8h2v2h-2zM16 8h2v2h-2zM20 8h2v2h-2z" fill="#64748B" opacity="0.5"/>
        <path d="M8 12h2v2H8zM12 12h2v2h-2zM16 12h2v2h-2zM20 12h2v2h-2z" fill="#64748B" opacity="0.5"/>
        <path d="M18 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" fill="#FC4C02"/>
        <path d="M21 14l-3-3-2 2.5-3-1.5-4 6 2 1 2-3 2 6 5-3-1-3 3-1z" fill="#FC4C02"/>
        <circle cx="24" cy="24" r="1.5" fill="#22C55E"/>
        <circle cx="20" cy="22" r="1.5" fill="#22C55E"/>
        <circle cx="24" cy="20" r="1.5" fill="#22C55E"/>
        <path d="M20 22l4 2M24 20l-4 2M24 20v4" stroke="#22C55E" strokeWidth="0.75"/>
      </svg>
      <span className="text-xl font-semibold tracking-tight">HeyStrava</span>
    </div>
  );
}
