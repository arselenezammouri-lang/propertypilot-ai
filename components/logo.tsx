import React from "react";

export function PropertyPilotLogo({ className = "h-8 w-8" }: { className?: string }) {
  const id = React.useId().replace(/:/g, "");
  const gid = `ppGrad-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PropertyPilot AI Logo"
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* House roof */}
      <path
        d="M 50 12 L 12 42 L 22 42 L 22 82 L 78 82 L 78 42 L 88 42 Z"
        fill={`url(#${gid})`}
        opacity="0.15"
      />
      <path
        d="M 50 12 L 12 42 L 22 42 L 22 82 L 78 82 L 78 42 L 88 42 Z"
        stroke={`url(#${gid})`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Door */}
      <rect
        x="40" y="56" width="20" height="26" rx="2"
        stroke={`url(#${gid})`}
        strokeWidth="2.5"
        fill="none"
      />

      {/* Window left */}
      <rect
        x="28" y="48" width="10" height="10" rx="1.5"
        stroke={`url(#${gid})`}
        strokeWidth="2"
        fill={`url(#${gid})`}
        opacity="0.3"
      />

      {/* Window right */}
      <rect
        x="62" y="48" width="10" height="10" rx="1.5"
        stroke={`url(#${gid})`}
        strokeWidth="2"
        fill={`url(#${gid})`}
        opacity="0.3"
      />

      {/* AI sparkle on chimney */}
      <rect x="64" y="18" width="8" height="24" rx="1" fill={`url(#${gid})`} opacity="0.2" stroke={`url(#${gid})`} strokeWidth="1.5" />
      <circle cx="68" cy="14" r="3" fill={`url(#${gid})`} opacity="0.6" />
      <circle cx="75" cy="10" r="1.5" fill={`url(#${gid})`} opacity="0.4" />
      <circle cx="62" cy="10" r="2" fill={`url(#${gid})`} opacity="0.3" />
    </svg>
  );
}
