export default function Logo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="OBAFEMIX crown logo" className={className}>
      <defs>
        <linearGradient id="obx-g" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c4b5fd" /><stop offset="0.45" stopColor="#8b5cf6" /><stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#0d0724" stroke="url(#obx-g)" strokeOpacity="0.6" strokeWidth="2" />
      <path d="M16 42l4.2-17.5L29 34l3-14.5L35 34l8.8-9.5L48 42H16z" fill="url(#obx-g)" />
      <path d="M18 50h28" stroke="url(#obx-g)" strokeWidth="3.4" strokeLinecap="round" />
    </svg>
  );
}
