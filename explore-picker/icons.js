// Flat vector icons in the app's illustration style: solid fills, no outlines,
// one light facet and one dark facet per shape, dark ink #13123B for details.
const INK = '#13123B';
const svg = body => `<svg class="ico" viewBox="0 0 48 48" aria-hidden="true">${body}</svg>`;

export const ICONS = {
  stories: svg(`
    <path d="M24 13C18 9 11 9 5 11v26c6-2 13-2 19 2z" fill="#9a52ec"/>
    <path d="M24 13c6-4 13-4 19-2v26c-6-2-13-2-19 2z" fill="#c49bff"/>
    <path d="M24 13v26" stroke="${INK}" stroke-width="1.6" opacity=".55"/>
    <path d="M9 17c3-1 7-1 11 1M9 22c3-1 7-1 11 1M9 27c3-1 7-1 11 1" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>
    <path d="M30 9l3 6 3-6v12l-3-2-3 2z" fill="#ffc861"/>
    <path d="M28 25c3-1 7-1 11 1M28 30c3-1 7-1 11 1" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" opacity=".3"/>`),
  gems: svg(`
    <polygon points="13,9 35,9 44,20 24,42 4,20" fill="#33c7d1"/>
    <polygon points="13,9 18,20 4,20" fill="#fff" opacity=".35"/><polygon points="13,9 24,9 18,20" fill="#fff" opacity=".5"/>
    <polygon points="35,9 44,20 30,20" fill="${INK}" opacity=".15"/><polygon points="30,20 44,20 24,42" fill="${INK}" opacity=".28"/>
    <polygon points="4,20 18,20 24,42" fill="#fff" opacity=".18"/>
    <path d="M40 4l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="#fff"/>`),
  steps: svg(`
    <path d="M6 30c0-5 2-12 5-14 3 0 5 3 9 4l8 2c8 2 14 4 15 9v3H6z" fill="#00cd9d"/>
    <path d="M11 16c3 0 5 3 9 4l2 1c-3 2-8 2-13 0 0-2 1-4 2-5z" fill="#fff" opacity=".35"/>
    <path d="M17 22l3-3M21 23l3-3M25 24l3-3" stroke="${INK}" stroke-width="1.8" stroke-linecap="round" opacity=".5"/>
    <rect x="5" y="34" width="39" height="5" rx="2.5" fill="#e9fff8"/>
    <path d="M30 26c4 0 9 1 12 3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".5"/>`),
  fog: svg(`
    <path d="M24 6c-6 0-10 4-10 10 0 7 10 16 10 16s10-9 10-16c0-6-4-10-10-10z" fill="#33c7d1"/>
    <circle cx="24" cy="16" r="4" fill="${INK}" opacity=".6"/>
    <path d="M10 42c-4 0-6-2-6-5s3-5 6-5c1-4 4-6 8-6 3 0 6 2 7 4 1-1 3-2 5-2 4 0 7 3 7 6 3 0 6 2 6 4s-2 4-5 4z" fill="#c49bff" opacity=".95"/>
    <path d="M10 42c-4 0-6-2-6-5h40c0 3-2 5-5 5z" fill="#9a7be0"/>`),
  daily: svg(`
    <path d="M24 4C14 4 9 11 9 18c0 8 9 14 12 17h6c3-3 12-9 12-17 0-7-5-14-15-14z" fill="#ffc861"/>
    <path d="M24 4c-4 0-6 7-6 14 0 8 3 14 3 17h6c0-3 3-9 3-17 0-7-2-14-6-14z" fill="#fff3d1"/>
    <path d="M9 18c0 8 9 14 12 17h-2C14 31 9 26 9 18z" fill="${INK}" opacity=".15"/>
    <path d="M21 35l1 4M27 35l-1 4" stroke="#8a62d6" stroke-width="1.4"/>
    <rect x="20" y="39" width="8" height="6" rx="1.5" fill="#f5792f"/>`),
  together: svg(`
    <circle cx="16" cy="13" r="6" fill="#ff8fb1"/><circle cx="33" cy="15" r="5" fill="#ffc861"/>
    <path d="M5 42c0-10 5-17 11-17s11 7 11 17z" fill="#ff8fb1"/>
    <path d="M23 42c0-8 4-15 10-15s10 7 10 15z" fill="#ffc861"/>
    <path d="M5 42c0-10 5-17 11-17-3 3-5 9-5 17z" fill="#fff" opacity=".25"/>
    <path d="M23 34c2-2 4-2 6 0" stroke="${INK}" stroke-width="2" stroke-linecap="round" opacity=".35"/>`),
  city: svg(`
    <circle cx="24" cy="24" r="19" fill="#7aa2ff"/><circle cx="24" cy="24" r="15" fill="#2c3a7a"/>
    <path d="M24 9v3M24 36v3M9 24h3M36 24h3" stroke="#dfe7ff" stroke-width="2" stroke-linecap="round"/>
    <polygon points="24,12 28,24 20,24" fill="#ff6b6b"/><polygon points="24,36 28,24 20,24" fill="#dfe7ff"/>
    <circle cx="24" cy="24" r="2.4" fill="${INK}"/>
    <path d="M10 17a16 16 0 0 1 9-9" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".4"/>`),
  treadmill: svg(`
    <path d="M34 8l6 0 0 4-3 0-6 24" stroke="#5ee0c2" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <rect x="4" y="32" width="38" height="7" rx="3.5" fill="#5ee0c2"/>
    <rect x="7" y="34" width="32" height="3" rx="1.5" fill="${INK}" opacity=".4"/>
    <circle cx="9" cy="35.5" r="2.4" fill="#e9fff8"/><circle cx="37" cy="35.5" r="2.4" fill="#e9fff8"/>
    <rect x="6" y="39" width="4" height="5" rx="1" fill="#3aa58c"/><rect x="36" y="39" width="4" height="5" rx="1" fill="#3aa58c"/>
    <path d="M12 26h12M15 21h10" stroke="#5ee0c2" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>`),
  puzzles: svg(`
    <path d="M8 14h9a5 5 0 1 1 10 0h9v9a5 5 0 1 1 0 10v9H27a5 5 0 1 0-10 0H8z" fill="#ff9f6b"/>
    <path d="M8 14h9a5 5 0 0 1 1-3C14 12 11 15 8 23z" fill="#fff" opacity=".3"/>
    <path d="M36 33v9h-9a5 5 0 0 0-1-3c4 0 8-2 10-6z" fill="${INK}" opacity=".18"/>`),
  // Skip default
  near: svg(`
    <rect x="7" y="30" width="34" height="9" rx="2" fill="#7aa2ff"/><rect x="10" y="21" width="30" height="9" rx="2" fill="#b36bff"/>
    <rect x="6" y="12" width="31" height="9" rx="2" fill="#33c7d1"/>
    <path d="M10 16h20M14 25h20M11 34h24" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".45"/>`),
  map: svg(`
    <path d="M5 11l12-4 14 4 12-4v30l-12 4-14-4-12 4z" fill="#2c3a7a"/>
    <path d="M17 7v30M31 11v30" stroke="${INK}" stroke-width="1.4" opacity=".5"/>
    <path d="M9 33c6-2 6-9 12-10s8 6 16-1" stroke="#ffc861" stroke-width="2.4" stroke-dasharray="3 3" stroke-linecap="round" fill="none"/>
    <circle cx="37" cy="21" r="3" fill="#00cd9d"/>`),
  mini: svg(`
    <polygon points="27,4 10,27 22,27 19,44 38,19 26,19" fill="#ffc861"/>
    <polygon points="27,4 10,27 16,27 24,12" fill="#fff" opacity=".4"/>`),
};

export const icon = id => ICONS[id] || '';
