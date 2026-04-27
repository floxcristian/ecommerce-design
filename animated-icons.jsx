// Animated isometric category icons — Airbnb-style (animate on hover)
// Each icon is an inline SVG with elements that transform/animate via CSS

const AnimatedIcons = {
  // Lubricantes — drop falls into can
  lubricantes: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-lub">
      <defs>
        <linearGradient id="lub-can" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--primary)"/>
          <stop offset="1" stopColor="var(--primary-hover, var(--primary))"/>
        </linearGradient>
      </defs>
      {/* Iso can */}
      <g className="ai-can">
        <path d="M20 28 L32 22 L44 28 L44 50 L32 56 L20 50 Z" fill="url(#lub-can)" opacity="0.95"/>
        <path d="M20 28 L32 22 L44 28 L32 34 Z" fill="#FFB088"/>
        <path d="M44 28 L44 50 L32 56 L32 34 Z" fill="rgba(0,0,0,0.25)"/>
        <rect x="29" y="25" width="6" height="3" fill="rgba(255,255,255,0.4)"/>
      </g>
      {/* Drop */}
      <g className="ai-drop">
        <path d="M32 8 Q35 14 35 17 A3 3 0 0 1 29 17 Q29 14 32 8 Z" fill="#4DA3FF"/>
        <ellipse cx="31" cy="14" rx="0.8" ry="1.5" fill="#fff" opacity="0.6"/>
      </g>
    </svg>
  ),

  // Frenos — disc spins, pad clamps
  frenos: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-frenos">
      <g className="ai-disc-spin" style={{ transformOrigin: '32px 36px' }}>
        <ellipse cx="32" cy="36" rx="22" ry="10" fill="#3A3A47"/>
        <ellipse cx="32" cy="35" rx="22" ry="10" fill="#5A5A6A"/>
        <ellipse cx="32" cy="35" rx="10" ry="4.5" fill="#2A2A33"/>
        <ellipse cx="32" cy="34" rx="10" ry="4.5" fill="#3A3A47"/>
        {[0, 60, 120, 180, 240, 300].map(a => {
          const r = 16;
          const x = 32 + r * Math.cos(a * Math.PI / 180);
          const y = 35 + (r * 0.45) * Math.sin(a * Math.PI / 180);
          return <circle key={a} cx={x} cy={y} r="1.2" fill="#1A1A20"/>;
        })}
      </g>
      <g className="ai-caliper">
        <rect x="22" y="20" width="20" height="10" rx="2" fill="var(--primary)"/>
        <rect x="22" y="20" width="20" height="3" fill="rgba(255,255,255,0.3)"/>
        <rect x="26" y="28" width="12" height="3" fill="#1A1A20"/>
      </g>
    </svg>
  ),

  // Filtros — pleats expand
  filtros: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-filtros">
      <g className="ai-filter-body">
        <ellipse cx="32" cy="20" rx="14" ry="5" fill="#FFB088"/>
        <path d="M18 20 L18 48 Q18 52 32 52 Q46 52 46 48 L46 20" fill="var(--primary)"/>
        <ellipse cx="32" cy="20" rx="14" ry="5" fill="#FFCFB0"/>
      </g>
      <g className="ai-pleats">
        {[22, 26, 30, 34, 38, 42].map(x => (
          <line key={x} x1={x} y1="22" x2={x} y2="48" stroke="rgba(0,0,0,0.25)" strokeWidth="1.2"/>
        ))}
      </g>
      <ellipse cx="32" cy="20" rx="14" ry="5" fill="none" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
      <rect x="28" y="14" width="8" height="4" fill="#3A3A47"/>
    </svg>
  ),

  // Baterias — bolts spark
  baterias: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-bat">
      <g className="ai-bat-body">
        <rect x="14" y="22" width="36" height="28" rx="2" fill="#2A2A33"/>
        <rect x="14" y="22" width="36" height="28" rx="2" fill="url(#bat-grad)"/>
        <defs>
          <linearGradient id="bat-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3A3A47"/>
            <stop offset="1" stopColor="#1A1A20"/>
          </linearGradient>
        </defs>
        <rect x="20" y="18" width="6" height="6" fill="#888"/>
        <rect x="38" y="18" width="6" height="6" fill="#888"/>
        <text x="22" y="42" fontFamily="monospace" fontSize="14" fontWeight="700" fill="var(--primary)">+</text>
        <text x="38" y="42" fontFamily="monospace" fontSize="14" fontWeight="700" fill="#fff">−</text>
      </g>
      <g className="ai-spark" opacity="0">
        <path d="M32 6 L34 12 L40 13 L35 17 L37 23 L32 20 L27 23 L29 17 L24 13 L30 12 Z" fill="var(--accent, #FFD60A)"/>
      </g>
    </svg>
  ),

  // Neumaticos — tire rolls
  neumaticos: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-neu">
      <g className="ai-tire-roll">
        <g style={{ transformOrigin: '32px 32px' }} className="ai-tire-spin">
          <circle cx="32" cy="32" r="22" fill="#1A1A20"/>
          <circle cx="32" cy="32" r="22" fill="none" stroke="#3A3A47" strokeWidth="2"/>
          <circle cx="32" cy="32" r="11" fill="#5A5A6A"/>
          <circle cx="32" cy="32" r="6" fill="var(--primary)"/>
          {/* Tread blocks */}
          {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => {
            const x1 = 32 + 14 * Math.cos(a * Math.PI/180);
            const y1 = 32 + 14 * Math.sin(a * Math.PI/180);
            const x2 = 32 + 21 * Math.cos(a * Math.PI/180);
            const y2 = 32 + 21 * Math.sin(a * Math.PI/180);
            return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3A3A47" strokeWidth="2.5"/>;
          })}
          {/* Lug nuts */}
          {[0,72,144,216,288].map(a => {
            const r = 3;
            const x = 32 + r * Math.cos(a * Math.PI/180);
            const y = 32 + r * Math.sin(a * Math.PI/180);
            return <circle key={a} cx={x} cy={y} r="1" fill="#1A1A20"/>;
          })}
        </g>
      </g>
    </svg>
  ),

  // Suspension — shock compresses
  suspension: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-sus">
      <circle cx="32" cy="10" r="4" fill="#3A3A47"/>
      <rect x="28" y="12" width="8" height="8" fill="#5A5A6A"/>
      <g className="ai-spring">
        <rect x="22" y="20" width="20" height="26" fill="var(--primary)" rx="2"/>
        {[24, 28, 32, 36, 40].map(y => (
          <rect key={y} x="20" y={y} width="24" height="2" fill="#1A1A20"/>
        ))}
      </g>
      <rect x="28" y="46" width="8" height="8" fill="#5A5A6A"/>
      <circle cx="32" cy="56" r="4" fill="#3A3A47"/>
    </svg>
  ),

  // Motor — pistons fire
  motor: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-motor">
      <rect x="12" y="24" width="40" height="28" rx="3" fill="#3A3A47"/>
      <rect x="12" y="24" width="40" height="6" fill="#5A5A6A"/>
      {/* 4 cylinders */}
      {[18, 28, 38, 48].map((x, i) => (
        <g key={x}>
          <rect x={x-3} y="14" width="6" height="14" fill="#5A5A6A"/>
          <rect className={`ai-piston ai-piston-${i}`} x={x-3} y="14" width="6" height="14" fill="var(--primary)"/>
        </g>
      ))}
      <rect x="12" y="48" width="40" height="6" fill="#1A1A20"/>
      <circle cx="20" cy="51" r="2" fill="var(--primary)"/>
      <circle cx="44" cy="51" r="2" fill="var(--primary)"/>
    </svg>
  ),

  // Electrico — lightning bolt
  electrico: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-elec">
      <rect x="14" y="14" width="36" height="36" rx="4" fill="#1A1A20"/>
      <rect x="14" y="14" width="36" height="36" rx="4" fill="url(#elec-bg)"/>
      <defs>
        <linearGradient id="elec-bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="rgba(255,214,10,0.1)"/>
          <stop offset="1" stopColor="rgba(255,91,31,0.2)"/>
        </linearGradient>
      </defs>
      <g className="ai-bolt">
        <path d="M34 16 L22 36 L30 36 L26 50 L42 30 L34 30 Z" fill="var(--accent, #FFD60A)" stroke="var(--primary)" strokeWidth="1.5" strokeLinejoin="round"/>
      </g>
    </svg>
  ),

  // Transmision — gears mesh
  transmision: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-trans">
      <g className="ai-gear-1" style={{ transformOrigin: '24px 32px' }}>
        <Gear cx={24} cy={32} r={12} teeth={8} color="var(--primary)"/>
      </g>
      <g className="ai-gear-2" style={{ transformOrigin: '44px 24px' }}>
        <Gear cx={44} cy={24} r={8} teeth={6} color="#5A5A6A"/>
      </g>
      <g className="ai-gear-3" style={{ transformOrigin: '46px 44px' }}>
        <Gear cx={46} cy={44} r={6} teeth={5} color="#3A3A47"/>
      </g>
    </svg>
  ),

  // Herramientas — wrench tilts
  herramientas: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-tool">
      <g className="ai-wrench" style={{ transformOrigin: '32px 32px' }}>
        <path d="M44 16 A8 8 0 0 0 32 24 L18 38 L26 46 L40 32 A8 8 0 0 0 48 20 L42 26 L38 22 L44 16 Z" fill="var(--primary)" stroke="#1A1A20" strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="22" cy="42" r="2" fill="#1A1A20"/>
      </g>
    </svg>
  ),

  // Seguridad — shield bounces
  seguridad: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-shield">
      <g className="ai-shield-pop">
        <path d="M32 8 L48 14 L48 32 Q48 46 32 56 Q16 46 16 32 L16 14 Z" fill="var(--primary)"/>
        <path d="M32 8 L48 14 L48 32 Q48 46 32 56 Q16 46 16 32 L16 14 Z" fill="url(#sh-grad)"/>
        <defs>
          <linearGradient id="sh-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="rgba(255,255,255,0.2)"/>
            <stop offset="1" stopColor="rgba(0,0,0,0.2)"/>
          </linearGradient>
        </defs>
        <path className="ai-check" d="M22 30 L29 38 L42 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
    </svg>
  ),

  // Accesorios — star sparkles
  accesorios: ({ size = 56 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" className="ai-icon ai-acc">
      <g className="ai-star-spin" style={{ transformOrigin: '32px 32px' }}>
        <path d="M32 12 L36 26 L50 26 L39 34 L43 48 L32 40 L21 48 L25 34 L14 26 L28 26 Z" fill="var(--accent, #FFD60A)" stroke="var(--primary)" strokeWidth="1.5" strokeLinejoin="round"/>
      </g>
      <circle className="ai-spark-1" cx="50" cy="14" r="2" fill="var(--primary)"/>
      <circle className="ai-spark-2" cx="14" cy="48" r="1.5" fill="var(--accent, #FFD60A)"/>
      <circle className="ai-spark-3" cx="52" cy="50" r="1.5" fill="#fff"/>
    </svg>
  ),
};

// Gear shape helper
function Gear({ cx, cy, r, teeth, color }) {
  const path = [];
  const innerR = r * 0.65;
  const outerR = r;
  const toothR = r * 1.15;
  for (let i = 0; i < teeth * 2; i++) {
    const angle = (i / (teeth * 2)) * Math.PI * 2;
    const radius = i % 2 === 0 ? toothR : outerR;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    path.push(i === 0 ? `M${x.toFixed(1)} ${y.toFixed(1)}` : `L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  path.push('Z');
  return (
    <g>
      <path d={path.join(' ')} fill={color}/>
      <circle cx={cx} cy={cy} r={innerR * 0.5} fill="#1A1A20"/>
    </g>
  );
}

// Header animated icons — small, single-color, animate on hover
const HeaderAnim = {
  Truck: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="ha-icon ha-truck">
      <g className="ha-truck-body">
        <rect x="2" y="8" width="11" height="8" stroke="currentColor" strokeWidth="1.6" fill="none"/>
        <path d="M13 11 L17 11 L20 14 L20 16 L13 16 Z" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
      </g>
      <circle className="ha-wheel ha-wheel-1" cx="6" cy="17" r="1.8" fill="currentColor"/>
      <circle className="ha-wheel ha-wheel-2" cx="16" cy="17" r="1.8" fill="currentColor"/>
      <g className="ha-truck-lines" opacity="0">
        <line x1="0" y1="11" x2="2" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="0" y1="14" x2="1.5" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </g>
    </svg>
  ),
  Search: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="ha-icon ha-search">
      <circle className="ha-mag-circle" cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.8"/>
      <line className="ha-mag-handle" x1="14.5" y1="14.5" x2="20" y2="20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  Garage: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="ha-icon ha-garage">
      <path className="ha-garage-roof" d="M3 10 L12 4 L21 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <path d="M5 10 L5 20 L19 20 L19 10" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      <g className="ha-garage-door">
        <line x1="7" y1="13" x2="17" y2="13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="7" y1="16" x2="17" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="7" y1="19" x2="17" y2="19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </g>
    </svg>
  ),
  User: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="ha-icon ha-user">
      <circle className="ha-user-head" cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
      <path className="ha-user-body" d="M5 20 Q5 14 12 14 Q19 14 19 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  Cart: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="ha-icon ha-cart">
      <path className="ha-cart-body" d="M3 4 L5 4 L7 15 L18 15 L20 7 L7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle className="ha-cart-wheel-1" cx="9" cy="19" r="1.5" fill="currentColor"/>
      <circle className="ha-cart-wheel-2" cx="17" cy="19" r="1.5" fill="currentColor"/>
      <g className="ha-cart-items" opacity="0">
        <circle cx="11" cy="11" r="0.8" fill="currentColor"/>
        <circle cx="14" cy="11" r="0.8" fill="currentColor"/>
        <circle cx="16" cy="11" r="0.8" fill="currentColor"/>
      </g>
    </svg>
  ),
  Menu: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="ha-icon ha-menu">
      <line className="ha-menu-1" x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line className="ha-menu-2" x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line className="ha-menu-3" x1="4" y1="17" x2="20" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

window.AnimatedIcons = AnimatedIcons;
window.HeaderAnim = HeaderAnim;

// Fly-to-cart: spawn an orb that flies from the click point to the header cart button
window.flyToCart = function(e) {
  try {
    const target = document.getElementById('header-cart-btn') || document.querySelector('[data-cart-target]');
    if (!target) return;
    const startX = e.clientX || (e.touches && e.touches[0]?.clientX) || window.innerWidth / 2;
    const startY = e.clientY || (e.touches && e.touches[0]?.clientY) || window.innerHeight / 2;
    const rect = target.getBoundingClientRect();
    const endX = rect.left + rect.width / 2 - 24;
    const endY = rect.top + rect.height / 2 - 24;
    const orb = document.createElement('div');
    orb.className = 'fly-to-cart';
    orb.style.left = (startX - 24) + 'px';
    orb.style.top = (startY - 24) + 'px';
    orb.style.setProperty('--dx', (endX - startX + 24) + 'px');
    orb.style.setProperty('--dy', (endY - startY + 24) + 'px');
    orb.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 4 L5 4 L7 15 L18 15 L20 7 L7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9" cy="19" r="1.5" fill="currentColor"/><circle cx="17" cy="19" r="1.5" fill="currentColor"/></svg>';
    document.body.appendChild(orb);
    // animate
    requestAnimationFrame(() => {
      orb.style.transition = 'transform 0.85s cubic-bezier(0.5, -0.2, 0.7, 0.2), opacity 0.85s ease-in';
      orb.style.transform = `translate(${endX - startX + 24}px, ${endY - startY + 24}px) scale(0.2) rotate(360deg)`;
      orb.style.opacity = '0';
    });
    setTimeout(() => orb.remove(), 900);
    // pulse the cart button
    target.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    setTimeout(() => {
      target.style.transform = 'scale(1.15)';
      setTimeout(() => { target.style.transform = ''; }, 220);
    }, 700);
  } catch (err) {
    // no-op
  }
};
