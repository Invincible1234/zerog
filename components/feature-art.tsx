// Conceptual process illustrations; these marks do not encode research results.
export function FeatureArt({ kind }: { kind: number }) {
  return (
    <div className={`feature-art feature-art-${kind}`} aria-hidden="true">
      <svg viewBox="0 0 320 145" fill="none">
        {kind === 0 && (
          <>
            <rect
              className="art-glass"
              x="47"
              y="14"
              width="226"
              height="117"
              rx="9"
            />
            <path
              className="art-muted"
              d="M47 43H273M91 14V131M190 14V131M231 14V131"
            />
            {[59, 80, 101, 122].map((y, i) => (
              <g key={y} opacity={i === 1 ? 1 : 0.35}>
                <path
                  className={i === 1 ? "art-accent" : "art-muted"}
                  d={`M60 ${y}h16M105 ${y}h${i % 2 ? 61 : 47}M204 ${y}h13M244 ${y}h15`}
                />
              </g>
            ))}
            <rect
              className="art-selection"
              x="41"
              y="68"
              width="238"
              height="24"
              rx="4"
            />
            <circle className="art-dot" cx="68" cy="29" r="2.5" />
            <path className="art-muted" d="M81 29H123M209 29H257" />
            <path className="art-bracket" d="M32 62v-20h20M288 84v20h-20" />
          </>
        )}
        {kind === 1 && (
          <>
            <path
              className="art-muted"
              d="M32 38H83L126 72M32 72H126M32 106H83L126 72M192 72H234L264 38H291M234 72L264 106H291"
            />
            <path className="art-flow" d="M32 72H126M192 72H235L264 38H291" />
            <rect
              className="art-glass"
              x="125"
              y="38"
              width="68"
              height="68"
              rx="17"
              transform="rotate(-9 159 72)"
            />
            <path className="art-accent" d="m146 72 10 10 18-22" />
            {[38, 72, 106].map((y) => (
              <circle className="art-node" key={y} cx="32" cy={y} r="5" />
            ))}
            <circle className="art-dot" cx="291" cy="38" r="5" />
            <circle className="art-node" cx="291" cy="106" r="5" />
            <path
              className="art-bracket"
              d="M108 25h17M108 25v17M211 119h-17M211 119v-17"
            />
          </>
        )}
        {kind === 2 && (
          <>
            <ellipse className="art-muted" cx="160" cy="73" rx="100" ry="49" />
            <ellipse
              className="art-muted"
              cx="160"
              cy="73"
              rx="58"
              ry="67"
              transform="rotate(60 160 73)"
            />
            <path
              className="art-muted"
              d="M160 73 89 38M160 73 231 38M160 73 70 95M160 73 205 119M160 73 248 93"
            />
            <path className="art-flow" d="M89 38 160 73 248 93" />
            <circle className="art-selection" cx="160" cy="73" r="25" />
            <circle className="art-dot" cx="160" cy="73" r="7" />
            {[
              [89, 38],
              [231, 38],
              [70, 95],
              [205, 119],
              [248, 93],
            ].map(([x, y], i) => (
              <circle
                className={i === 0 || i === 4 ? "art-dot" : "art-node"}
                key={x}
                cx={x}
                cy={y}
                r="4"
              />
            ))}
          </>
        )}
      </svg>
    </div>
  );
}
