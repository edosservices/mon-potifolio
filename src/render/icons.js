function svg(body) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const ICONS = {
  network: svg(
    `<circle cx="6" cy="12" r="2.2"/><circle cx="18" cy="6.5" r="2.2"/><circle cx="18" cy="17.5" r="2.2"/><path d="M8.1 12h5.2M15.8 8.2 12.2 11M15.8 15.8 12.2 13"/>`,
  ),
  wifi: svg(
    `<path d="M4.5 10a10.5 10.5 0 0 1 15 0"/><path d="M7.5 13.2a6.2 6.2 0 0 1 9 0"/><path d="M12 17.5h.01"/>`,
  ),
  route: svg(
    `<circle cx="6" cy="6" r="2.1"/><circle cx="18" cy="18" r="2.1"/><path d="M8 7.2c5.2.6 3.2 7.2 8 8.6"/>`,
  ),
  switch: svg(
    `<rect x="3" y="8" width="6.5" height="8" rx="1.4"/><rect x="14.5" y="8" width="6.5" height="8" rx="1.4"/><path d="M9.5 12h5"/>`,
  ),
  server: svg(
    `<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>`,
  ),
  antenna: svg(
    `<path d="M12 21V9"/><path d="m8.5 13 3.5-3.5L15.5 13"/><path d="M5.5 11.5a9 9 0 0 1 13 0"/><circle cx="12" cy="7.2" r="1.15" fill="currentColor" stroke="none"/>`,
  ),
  code: svg(`<path d="m8 8-4 4 4 4M16 8l4 4-4 4M13 5.5 11 18.5"/>`),
  layers: svg(`<path d="m12 3 8 4-8 4L4 7l8-4zM4 12l8 4 8-4M4 16.5 12 20.5l8-4"/>`),
  database: svg(
    `<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/>`,
  ),
  api: svg(`<path d="M8 7H4.5v10H8M16 7h3.5v10H16M10 12h4"/>`),
  git: svg(
    `<circle cx="6" cy="6" r="2.1"/><circle cx="6" cy="18" r="2.1"/><circle cx="18" cy="12" r="2.1"/><path d="M6 8.1v7.8M8.1 7.1c3.6.2 3.4 4.4 7.6 4.8"/>`,
  ),
  package: svg(
    `<path d="m12 3 8 4v10l-8 4-8-4V7l8-4z"/><path d="m12 12 8-5M12 12v10M12 12 4 7"/>`,
  ),
  bolt: svg(`<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>`),
  layout: svg(`<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>`),
  terminal: svg(`<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M12 15h5"/>`),
  cloud: svg(`<path d="M7 18h9.2a3.8 3.8 0 0 0 .5-7.6 5.2 5.2 0 0 0-10-1.2A3.6 3.6 0 0 0 7 18z"/>`),
  globe: svg(
    `<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.2 2.4 3.3 5.2 3.3 8S14.2 17.6 12 20c-2.2-2.4-3.3-5.2-3.3-8S9.8 6.4 12 4"/>`,
  ),
  rocket: svg(
    `<path d="M12 19.5S7.5 17 7.5 11 12 4.5 12 4.5 16.5 6 16.5 11 12 19.5 12 19.5z"/><path d="M12 11.2h.01M9.2 18.6c-.8.9-2 1.9-2 1.9s.8-1.2 1.6-2.1M14.8 18.6c.8.9 2 1.9 2 1.9s-.8-1.2-1.6-2.1"/>`,
  ),
  shield: svg(`<path d="M12 3 5 6v6c0 4 2.8 6.4 7 8 4.2-1.6 7-4 7-8V6l-7-3z"/>`),
  spark: svg(`<path d="M12 3v4M12 17v4M4.9 6.5l2.8 2.8M16.3 14.7l2.8 2.8M3 12h4M17 12h4M4.9 17.5l2.8-2.8M16.3 9.3l2.8-2.8"/>`),
  arrow: svg(`<path d="M5 12h14M13 6l6 6-6 6"/>`),
  download: svg(`<path d="M12 4v10"/><path d="m8 10 4 4 4-4"/><path d="M5 19h14"/>`),
  mail: svg(`<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>`),
  phone: svg(
    `<path d="M8 3.5h3l1.2 3-2 1.2a12 12 0 0 0 5.1 5.1l1.2-2 3 1.2v3A2 2 0 0 1 17.4 17 14.5 14.5 0 0 1 7 6.6 2 2 0 0 1 8 3.5z"/>`,
  ),
  menu: svg(`<path d="M4 7h16M4 12h16M4 17h16"/>`),
  close: svg(`<path d="M6 6l12 12M18 6 6 18"/>`),
};

export function icon(name) {
  return ICONS[name] || ICONS.spark;
}
