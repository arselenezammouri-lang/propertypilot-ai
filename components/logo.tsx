import React from "react";

export function PropertyPilotLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* Lettera P stilizzata (stile aviazione) */}
      <path
        d="M 20 20 L 20 80 L 50 80 L 65 65 L 65 45 L 50 30 L 20 30 Z"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 20 50 L 50 50"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Casa stilizzata (linee sottili) */}
      <path
        d="M 70 60 L 85 45 L 100 60 L 100 80 L 70 80 Z"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 75 80 L 75 70 L 80 70 L 80 80"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 90 80 L 90 70 L 95 70 L 95 80"
        stroke="url(#logoGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Aereo che orbita (con scia elegante) */}
      <g transform="translate(60, 60)">
        <circle
          cx="0"
          cy="0"
          r="35"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="2 4"
          opacity="0.4"
        />
        {/* Scia dell'aereo */}
        <path
          d="M -25 -10 Q -20 -5 -15 0 Q -10 5 -5 10"
          stroke="url(#logoGradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
          strokeLinecap="round"
        />
        {/* Aereo */}
        <g transform="rotate(-45)">
          <path
            d="M 25 0 L 35 -5 L 35 5 Z"
            fill="url(#logoGradient)"
            opacity="0.9"
          />
          <path
            d="M 30 0 L 40 0"
            stroke="url(#logoGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M 32 -3 L 38 -3 M 32 3 L 38 3"
            stroke="url(#logoGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
      </g>
    </svg>
  );
}

