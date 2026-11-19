/** Faint repeating contour-line texture, matching landonorris.com's background motif. */
export function TopographicTexture() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full opacity-[0.07]"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern id="topo-lines" width="220" height="220" patternUnits="userSpaceOnUse">
          <path
            d="M0,110 C55,60 165,160 220,110 M0,60 C55,10 165,110 220,60 M0,160 C55,110 165,210 220,160"
            fill="none"
            stroke="#f5f5f0"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#topo-lines)" />
    </svg>
  )
}
