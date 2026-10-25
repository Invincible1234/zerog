export function Orbit() {
  return (
    <div className="orbit" aria-hidden="true">
      <svg viewBox="0 0 520 450" fill="none">
        <defs>
          <radialGradient id="glow">
            <stop stopColor="var(--accent)" stopOpacity=".12" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
          <clipPath id="earth">
            <circle cx="260" cy="225" r="143" />
          </clipPath>
        </defs>
        <circle cx="260" cy="225" r="220" fill="url(#glow)" />
        <g stroke="var(--line)">
          <path d="M0 225h520M260 0v450" strokeDasharray="3 7" />
          <circle cx="260" cy="225" r="185" strokeDasharray="2 8" />
        </g>
        <g stroke="var(--accent)" opacity=".55">
          <circle cx="260" cy="225" r="143" />
          <g clipPath="url(#earth)">
            {[-100, -50, 0, 50, 100].map((y) => (
              <ellipse
                key={y}
                cx="260"
                cy={225 + y}
                rx="143"
                ry={Math.max(9, 25 - Math.abs(y) / 6)}
              />
            ))}
            {[35, 75, 115].map((r) => (
              <ellipse key={r} cx="260" cy="225" rx={r} ry="143" />
            ))}
            <path
              d="m165 145 18-15 33 6 12 20-13 16 20 24-15 26-28-4-6-24-16-7-12-25Zm64 89 24-10 24 15-4 29-18 29-5 34-18-17-10-31Zm61-91 40 2 15 22 41 14-2 36-32 9-16-21-19 9-12 31-21-11 6-26-24-17Zm53 128 36 9 3 19-32 3Z"
              fill="var(--accent)"
              fillOpacity=".08"
            />
          </g>
          <ellipse
            cx="260"
            cy="225"
            rx="225"
            ry="73"
            transform="rotate(-29 260 225)"
            strokeDasharray="4 7"
          />
        </g>
        <circle cx="446" cy="117" r="5" fill="var(--accent)" />
        <circle cx="446" cy="117" r="13" stroke="var(--accent)" opacity=".35" />
        <path d="M35 376h105m240-300h105" stroke="var(--line)" />
        <text
          x="35"
          y="394"
          fill="var(--muted)"
          fontSize="10"
          fontFamily="monospace"
        >
          PUBLIC DATA / SAVED EVIDENCE
        </text>
        <text
          x="380"
          y="64"
          fill="var(--accent)"
          fontSize="10"
          fontFamily="monospace"
        >
          OSDR ARCHIVE
        </text>
      </svg>
    </div>
  );
}
