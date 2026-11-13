/**
 * OBAFEMIX wordmark mark — the letter "O", designed like the reference
 * site's letterform logo (Aakash's angular gradient "A"):
 * a bold geometric octagonal "O" ring filled with the indigo→violet
 * gradient, broken at the top-right by a spark — the start of the crown.
 * Same API as before (size/className) so every brand spot picks it up.
 */
export default function Logo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" role="img" aria-label="OBAFEMIX O logo" className={className}>
      <defs>
        <linearGradient id="obx-o" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="0.45" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#c084fc" />
        </linearGradient>
      </defs>
      {/* Octagonal O ring (even-odd cut-out centre) */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M32 3 51.5 12.5 61 32 51.5 51.5 32 61 12.5 51.5 3 32 12.5 12.5 32 3Z
           M32 17.5 42.8 22.9 46.5 32 42.8 41.1 32 46.5 21.2 41.1 17.5 32 21.2 22.9 32 17.5Z"
        fill="url(#obx-o)"
      />
      {/* The break + spark at the top-right of the ring */}
      <path d="M47 9.5 49.2 14.8 54.5 17 49.2 19.2 47 24.5 44.8 19.2 39.5 17l5.3-2.2L47 9.5Z" fill="#ddd6fe" />
    </svg>
  );
}
