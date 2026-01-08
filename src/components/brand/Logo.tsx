import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-xl' },
    md: { icon: 40, text: 'text-2xl' },
    lg: { icon: 56, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      {/* Logo Icon - Abstract symbol of growth and inclusion */}
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="flex-shrink-0"
      >
        {/* Background circle - represents wholeness */}
        <circle
          cx="24"
          cy="24"
          r="22"
          className="fill-primary/10"
        />
        
        {/* Rising path - represents growth beyond limitations */}
        <path
          d="M12 32C12 32 16 24 24 24C32 24 36 16 36 16"
          className="stroke-primary"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Multiple figures representing inclusion */}
        <circle cx="16" cy="28" r="4" className="fill-secondary" />
        <circle cx="24" cy="20" r="4" className="fill-primary" />
        <circle cx="32" cy="12" r="4" className="fill-accent" />
        
        {/* Connecting arcs - represents community */}
        <path
          d="M16 28C18 26 22 22 24 20"
          className="stroke-secondary/50"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M24 20C26 18 30 14 32 12"
          className="stroke-primary/50"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Star accent - represents achievement */}
        <path
          d="M38 8L39.5 11L42.5 11.5L40.5 13.5L41 16.5L38 15L35 16.5L35.5 13.5L33.5 11.5L36.5 11L38 8Z"
          className="fill-secondary"
        />
      </svg>
      
      {showText && (
        <span className={`font-display font-bold ${text} text-gradient`}>
          BeyonDextra
        </span>
      )}
    </div>
  );
}
