// CNC two-tone icon system. Red = primary mark (CNC #ED1B24). Grey = secondary depth.
// Each icon returns the inner SVG string at viewBox 0 0 24 24. The render() wrapper
// adds the outer <svg> with the size + stroke pass-through so the same icon works at
// 14px (nav) or 32px (folder header).
//
// Two-tone implementation: filled red shape underneath, dark-grey stroked overlay on top.
// All marks read at 14px and remain crisp at 48px.

const ICON_DEFS = {
  // ===== System / nav =====
  overview: `
    <rect x="3" y="3" width="8" height="9" rx="1.5" fill="#ED1B24" opacity=".18"/>
    <rect x="13" y="3" width="8" height="5" rx="1.5" fill="#ED1B24" opacity=".18"/>
    <rect x="13" y="11" width="8" height="10" rx="1.5" fill="#ED1B24"/>
    <rect x="3" y="14" width="8" height="7" rx="1.5" fill="#ED1B24" opacity=".18"/>
    <rect x="3" y="3" width="8" height="9" rx="1.5" stroke="#1F1F1F" stroke-width="1.2" fill="none"/>
    <rect x="13" y="3" width="8" height="5" rx="1.5" stroke="#1F1F1F" stroke-width="1.2" fill="none"/>
    <rect x="3" y="14" width="8" height="7" rx="1.5" stroke="#1F1F1F" stroke-width="1.2" fill="none"/>`,

  library: `
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#ED1B24" opacity=".15"/>
    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#ED1B24" stroke-width="1.5" fill="none" stroke-linejoin="round"/>
    <path d="M6 12h12" stroke="#1F1F1F" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>`,

  upload: `
    <rect x="3" y="14" width="18" height="6" rx="1.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M12 4v10" stroke="#ED1B24" stroke-width="2" stroke-linecap="round"/>
    <path d="M7 9l5-5 5 5" stroke="#ED1B24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  branddocs: `
    <rect x="4" y="3" width="14" height="18" rx="1.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M8 8h6 M8 12h6 M8 16h4" stroke="#ED1B24" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="18" cy="6" r="2" fill="#ED1B24"/>`,

  newsletters: `
    <rect x="3" y="5" width="18" height="14" rx="2" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M3 7l9 6 9-6" stroke="#ED1B24" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  podcasts: `
    <rect x="9" y="3" width="6" height="11" rx="3" fill="#ED1B24"/>
    <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#1F1F1F" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <path d="M12 19v3 M9 22h6" stroke="#1F1F1F" stroke-width="1.4" stroke-linecap="round"/>`,

  tasks: `
    <rect x="3" y="3" width="18" height="18" rx="2" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M8 12l3 3 5-6" stroke="#ED1B24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  analytics: `
    <path d="M4 20V4 M4 20h16" stroke="#1F1F1F" stroke-width="1.4" stroke-linecap="round"/>
    <rect x="7" y="13" width="3" height="5" fill="#ED1B24" opacity=".4"/>
    <rect x="11" y="9" width="3" height="9" fill="#ED1B24" opacity=".7"/>
    <rect x="15" y="6" width="3" height="12" fill="#ED1B24"/>`,

  ads: `
    <path d="M4 9v6l11 4V5z" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M15 8c2 1 2 7 0 8" stroke="#ED1B24" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <path d="M18 6c3 2 3 10 0 12" stroke="#ED1B24" stroke-width="1.4" stroke-linecap="round" opacity=".6" fill="none"/>
    <rect x="6" y="15" width="3" height="5" fill="#1F1F1F"/>`,

  sales: `
    <path d="M3 17l5-5 4 3 7-8" stroke="#ED1B24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="3" cy="17" r="1.6" fill="#ED1B24"/>
    <circle cx="19" cy="7" r="1.6" fill="#ED1B24"/>
    <path d="M3 20h18" stroke="#1F1F1F" stroke-width="1.4" stroke-linecap="round"/>`,

  gbp: `
    <path d="M12 22s-7-7.5-7-13a7 7 0 1 1 14 0c0 5.5-7 13-7 13z" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.4" stroke-linejoin="round"/>
    <circle cx="12" cy="9" r="2.5" fill="#ED1B24"/>
    <path d="M19 4l1.5 1.5L19 7" stroke="#ED1B24" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  website: `
    <rect x="3" y="4" width="18" height="15" rx="2" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.4"/>
    <path d="M3 9h18" stroke="#1F1F1F" stroke-width="1.4"/>
    <circle cx="6.5" cy="6.7" r="0.7" fill="#ED1B24"/>
    <circle cx="8.7" cy="6.7" r="0.7" fill="#ED1B24"/>
    <path d="M7 13l3 3 5-6" stroke="#ED1B24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  consoles: `
    <circle cx="12" cy="12" r="3" fill="#ED1B24"/>
    <path d="M12 2v3 M12 19v3 M2 12h3 M19 12h3 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2" stroke="#1F1F1F" stroke-width="1.4" stroke-linecap="round"/>`,

  llm: `
    <path d="M12 3l2.5 5.5L20 10l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" fill="#ED1B24" opacity=".18" stroke="#ED1B24" stroke-width="1.4" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="2" fill="#1F1F1F"/>`,

  team: `
    <circle cx="9" cy="8" r="3.2" fill="#ED1B24" opacity=".25" stroke="#1F1F1F" stroke-width="1.2"/>
    <circle cx="17" cy="9" r="2.4" fill="#ED1B24"/>
    <path d="M3 19c1-3 4-4 6-4s5 1 6 4" stroke="#1F1F1F" stroke-width="1.4" stroke-linecap="round" fill="none"/>
    <path d="M14 18c1-2 3-3 4-3s2.5 1 3 3" stroke="#ED1B24" stroke-width="1.4" stroke-linecap="round" fill="none"/>`,

  ai: `
    <rect x="4" y="6" width="16" height="12" rx="2.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <circle cx="9" cy="12" r="1.4" fill="#ED1B24"/>
    <circle cx="15" cy="12" r="1.4" fill="#ED1B24"/>
    <path d="M12 3v3" stroke="#ED1B24" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="12" cy="3" r="1.2" fill="#ED1B24"/>`,

  approval: `
    <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <circle cx="12" cy="13" r="3.5" fill="#ED1B24"/>
    <path d="M10.5 13l1 1.2 2.2-2.4" stroke="#FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  audit: `
    <circle cx="11" cy="11" r="6.5" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M16 16l4.5 4.5" stroke="#ED1B24" stroke-width="2" stroke-linecap="round"/>
    <path d="M8.5 11l2 2 3.5-3.5" stroke="#ED1B24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  logins: `
    <rect x="3" y="6" width="12" height="12" rx="2" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M15 12h7 M19 9l3 3-3 3" stroke="#ED1B24" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  specs: `
    <path d="M5 3h10l4 4v14H5z" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M15 3v4h4" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M8 11l3 3 5-5 M8 17h8" stroke="#ED1B24" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  profile: `
    <circle cx="12" cy="8" r="4" fill="#ED1B24" opacity=".25" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="#ED1B24" stroke-width="1.4" stroke-linecap="round" fill="none"/>`,

  // ===== Folder-tree icons (used inside the library tree) =====
  // All folder marks: dark-grey folder shape with a CNC-red flag/tab indicating category.
  folder: `
    <path d="M3 7a1.5 1.5 0 0 1 1.5-1.5h4l2 2h10A1.5 1.5 0 0 1 22 9v9.5A1.5 1.5 0 0 1 20.5 20h-16A1.5 1.5 0 0 1 3 18.5z" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>`,

  folderOpen: `
    <path d="M3 7a1.5 1.5 0 0 1 1.5-1.5h4l2 2h10A1.5 1.5 0 0 1 22 9v2H3z" fill="#1F1F1F" opacity=".75"/>
    <path d="M3 11h19l-2 8.5a1.5 1.5 0 0 1-1.45 1.1H4.95A1.5 1.5 0 0 1 3.5 19.1z" fill="#ED1B24" opacity=".55"/>`,

  brand: `
    <circle cx="12" cy="12" r="8" fill="#ED1B24" opacity=".2" stroke="#1F1F1F" stroke-width="1.2"/>
    <circle cx="9" cy="10" r="1.5" fill="#ED1B24"/>
    <circle cx="15" cy="10" r="1.5" fill="#1F1F1F"/>
    <circle cx="9" cy="14" r="1.5" fill="#1F1F1F"/>
    <circle cx="15" cy="14" r="1.5" fill="#ED1B24"/>`,

  template: `
    <rect x="3" y="4" width="18" height="16" rx="1.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <rect x="3" y="4" width="18" height="4" fill="#ED1B24"/>
    <path d="M6 12h6 M6 15h8 M6 18h5" stroke="#1F1F1F" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>`,

  assets: `
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <circle cx="9" cy="10" r="1.8" fill="#ED1B24"/>
    <path d="M4 17l4-4 4 4 3-3 5 5" stroke="#1F1F1F" stroke-width="1.4" stroke-linejoin="round" fill="none"/>`,

  industry: `
    <path d="M3 20V11l5 3V11l5 3V11l5 3v6z" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <rect x="6" y="16" width="2" height="3" fill="#ED1B24"/>
    <rect x="11" y="16" width="2" height="3" fill="#1F1F1F"/>
    <rect x="16" y="16" width="2" height="3" fill="#ED1B24"/>`,

  patient: `
    <circle cx="12" cy="7" r="3" fill="#ED1B24" opacity=".3" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M5 20c1-4 4-6 7-6s6 2 7 6" stroke="#1F1F1F" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <path d="M11 16h2v4h-2z M9 17h6" stroke="#ED1B24" stroke-width="1.4" fill="#ED1B24"/>`,

  employee: `
    <circle cx="12" cy="7" r="3" fill="#ED1B24" opacity=".3" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M5 20c1-4 4-6 7-6s6 2 7 6" stroke="#ED1B24" stroke-width="1.4" stroke-linecap="round" fill="none"/>`,

  customer: `
    <path d="M5 7h14l-1.5 9a2 2 0 0 1-2 1.7H8.5A2 2 0 0 1 6.5 16z" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M8 7V5a4 4 0 0 1 8 0v2" stroke="#ED1B24" stroke-width="1.4" fill="none"/>`,

  health: `
    <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" fill="#ED1B24" opacity=".25" stroke="#ED1B24" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M11 11h2v2h2v-2-2h-2v-2h-2v2h-2v2h2z" fill="#FFF"/>`,

  birthday: `
    <path d="M5 11v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8z" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2"/>
    <rect x="4" y="11" width="16" height="2.5" fill="#ED1B24"/>
    <rect x="11" y="5" width="2" height="5" fill="#1F1F1F"/>
    <path d="M12 3v2" stroke="#ED1B24" stroke-width="1.6" stroke-linecap="round"/>`,

  guideline: `
    <rect x="5" y="3" width="14" height="18" rx="1.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M9 8h6 M9 12h6 M9 16h4" stroke="#ED1B24" stroke-width="1.4" stroke-linecap="round"/>
    <rect x="3.5" y="6" width="3" height="3" fill="#ED1B24"/>
    <rect x="3.5" y="14" width="3" height="3" fill="#1F1F1F"/>`,

  pack: `
    <path d="M12 3l9 5v8l-9 5-9-5V8z" fill="#ED1B24" opacity=".2" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M3 8l9 5 9-5 M12 13v9" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M7.5 5.5l9 5" stroke="#ED1B24" stroke-width="1.4"/>`,

  training: `
    <path d="M3 9l9-4 9 4-9 4z" fill="#ED1B24" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M7 11v4c0 1 2 2 5 2s5-1 5-2v-4" stroke="#1F1F1F" stroke-width="1.4" fill="none"/>
    <path d="M21 9v6" stroke="#ED1B24" stroke-width="1.6" stroke-linecap="round"/>`,

  video: `
    <rect x="3" y="6" width="13" height="12" rx="1.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M16 10l5-3v10l-5-3z" fill="#ED1B24" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>`,

  ad: `
    <path d="M3 11l11-6v14l-11-6z" fill="#ED1B24" opacity=".2" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M14 7c2 1 2 9 0 10" stroke="#ED1B24" stroke-width="1.4" fill="none"/>
    <path d="M18 5c4 2 4 12 0 14" stroke="#1F1F1F" stroke-width="1.2" fill="none" opacity=".6"/>`,

  social: `
    <rect x="3" y="3" width="18" height="18" rx="2.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <circle cx="12" cy="12" r="4" stroke="#ED1B24" stroke-width="1.5" fill="none"/>
    <circle cx="17" cy="7" r="1.2" fill="#ED1B24"/>`,

  audio: `
    <path d="M3 12l3 1V11l4 2V9l4 4V7l4 6V5l3 4" stroke="#1F1F1F" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="5" cy="16" r="2" fill="#ED1B24"/>
    <circle cx="18" cy="16" r="2" fill="#ED1B24" opacity=".5"/>`,

  footage: `
    <rect x="3" y="6" width="14" height="12" rx="1.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <rect x="4" y="7" width="2" height="2" fill="#1F1F1F"/>
    <rect x="14" y="7" width="2" height="2" fill="#1F1F1F"/>
    <rect x="4" y="15" width="2" height="2" fill="#1F1F1F"/>
    <rect x="14" y="15" width="2" height="2" fill="#1F1F1F"/>
    <path d="M17 10l5-2v8l-5-2z" fill="#ED1B24"/>`,

  uniform: `
    <path d="M8 4l-4 3 2 4 2-1v10h8V10l2 1 2-4-4-3-2 2h-4z" fill="#ED1B24" opacity=".2" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M10 6c0 1.5 1 2.5 2 2.5s2-1 2-2.5" stroke="#ED1B24" stroke-width="1.2" fill="none"/>`,

  vehicle: `
    <rect x="2" y="11" width="20" height="6" rx="1.5" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M5 11l2-4h10l2 4" stroke="#1F1F1F" stroke-width="1.2" fill="none"/>
    <circle cx="7" cy="17.5" r="2" fill="#1F1F1F"/>
    <circle cx="17" cy="17.5" r="2" fill="#1F1F1F"/>
    <rect x="9" y="13" width="6" height="2" fill="#ED1B24"/>`,

  clinic: `
    <path d="M3 21V10l9-6 9 6v11z" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M10 13h4v2h2v2h-2v2h-4v-2h-2v-2h2z" fill="#ED1B24"/>`,

  mobileClinic: `
    <rect x="2" y="8" width="14" height="9" rx="1" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M16 11h4l2 3v3h-6z" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <circle cx="6" cy="18.5" r="1.8" fill="#1F1F1F"/>
    <circle cx="18" cy="18.5" r="1.8" fill="#1F1F1F"/>
    <path d="M8 11h3v2h2v-2h3v3h-3v2h-2v-2h-3z" fill="#ED1B24"/>`,

  poster: `
    <rect x="6" y="3" width="12" height="18" rx="1" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <rect x="6" y="3" width="12" height="6" fill="#ED1B24"/>
    <path d="M9 12h6 M9 15h6 M9 18h4" stroke="#1F1F1F" stroke-width="1.2" stroke-linecap="round" opacity=".6"/>`,

  canvas: `
    <rect x="3" y="3" width="18" height="14" rx="1.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M9 21l3-4 3 4" stroke="#1F1F1F" stroke-width="1.2" fill="none"/>
    <circle cx="9" cy="9" r="1.5" fill="#ED1B24"/>
    <path d="M5 14l3-3 3 3 4-4 4 4" stroke="#1F1F1F" stroke-width="1.2" fill="none"/>`,

  calendar: `
    <rect x="3" y="5" width="18" height="16" rx="1.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M3 9h18" stroke="#1F1F1F" stroke-width="1.2"/>
    <rect x="7" y="3" width="2" height="4" rx="1" fill="#ED1B24"/>
    <rect x="15" y="3" width="2" height="4" rx="1" fill="#ED1B24"/>
    <rect x="8" y="13" width="3" height="3" fill="#ED1B24"/>`,

  // YouTube (red play tile)
  youtube: `
    <rect x="2" y="6" width="20" height="12" rx="3" fill="#ED1B24"/>
    <polygon points="10,9 16,12 10,15" fill="#FFF"/>`,

  // Reputation (star + speech bubble)
  reputation: `
    <path d="M3 5h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4 3v-3H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" transform="translate(2 1)" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <polygon points="12,7 13.2,9.8 16,10 13.8,12 14.4,15 12,13.4 9.6,15 10.2,12 8,10 10.8,9.8" fill="#ED1B24"/>`,

  // GMB locations (map pin with red dot)
  gmbPin: `
    <path d="M12 22s7-7 7-13a7 7 0 0 0-14 0c0 6 7 13 7 13z" fill="#ED1B24" opacity=".2" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <circle cx="12" cy="9" r="3" fill="#ED1B24"/>`,

  // Newsletter agent (envelope with AI spark)
  newsletterAi: `
    <rect x="3" y="6" width="18" height="12" rx="2" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M3 8l9 6 9-6" stroke="#ED1B24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="19" cy="6" r="3" fill="#ED1B24"/>
    <path d="M19 4.5v3 M17.5 6h3" stroke="#FFF" stroke-width="1.4" stroke-linecap="round"/>`,

  // HR portal (employee badge + heart)
  hrPortal: `
    <rect x="4" y="3" width="16" height="18" rx="2" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <circle cx="12" cy="9" r="2.4" fill="#ED1B24"/>
    <path d="M8 14c1-2 2.5-3 4-3s3 1 4 3" stroke="#1F1F1F" stroke-width="1.2" fill="none"/>
    <path d="M9.5 17.5c0-.9.8-1.5 1.5-1.5s1 .4 1 1c0-.6.4-1 1-1s1.5.6 1.5 1.5c0 1.2-2.5 2.5-2.5 2.5s-2.5-1.3-2.5-2.5z" fill="#ED1B24"/>`,

  // Leave request (calendar with checkmark)
  leave: `
    <rect x="3" y="5" width="18" height="16" rx="1.5" fill="#ED1B24" opacity=".15" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M3 9h18" stroke="#1F1F1F" stroke-width="1.2"/>
    <rect x="7" y="3" width="2" height="4" rx="1" fill="#ED1B24"/>
    <rect x="15" y="3" width="2" height="4" rx="1" fill="#ED1B24"/>
    <path d="M8 14l2.5 2.5L16 11" stroke="#ED1B24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,

  // Mental wellness (mind + heart)
  wellness: `
    <path d="M12 21s-6-4-6-10a3.5 3.5 0 0 1 6-2.5A3.5 3.5 0 0 1 18 11c0 6-6 10-6 10z" fill="#ED1B24" opacity=".25" stroke="#ED1B24" stroke-width="1.4" stroke-linejoin="round"/>
    <circle cx="9" cy="10" r="1" fill="#1F1F1F"/>
    <circle cx="15" cy="10" r="1" fill="#1F1F1F"/>
    <path d="M9.5 13c1 1 4 1 5 0" stroke="#1F1F1F" stroke-width="1.2" fill="none" stroke-linecap="round"/>`,

  // Drip training (water droplets cascading)
  drip: `
    <path d="M8 3c0 0-3 4-3 6.5a3 3 0 0 0 6 0C11 7 8 3 8 3z" fill="#ED1B24" opacity=".4" stroke="#1F1F1F" stroke-width="1.1"/>
    <path d="M16 8c0 0-2.5 3-2.5 5a2.5 2.5 0 0 0 5 0c0-2-2.5-5-2.5-5z" fill="#ED1B24" opacity=".7" stroke="#1F1F1F" stroke-width="1.1"/>
    <path d="M10 14c0 0-2 2.5-2 4a2 2 0 0 0 4 0c0-1.5-2-4-2-4z" fill="#ED1B24" stroke="#1F1F1F" stroke-width="1.1"/>`,

  // Manager contribution (person + comment bubble)
  contribution: `
    <circle cx="8" cy="7" r="3" fill="#ED1B24" opacity=".25" stroke="#1F1F1F" stroke-width="1.2"/>
    <path d="M2 19c.5-3 3-5 6-5s5.5 2 6 5" stroke="#1F1F1F" stroke-width="1.2" stroke-linecap="round" fill="none"/>
    <path d="M13 3h7a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-5l-3 2v-2h0a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="#ED1B24" stroke="#1F1F1F" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M15 6h4 M15 8h3" stroke="#FFF" stroke-width="1.2" stroke-linecap="round"/>`,

  // chevrons + small helpers
  chevronRight: `<path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  chevronDown:  `<path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  plus:         `<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
  download:     `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  trash:        `<path d="M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6 M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  refresh:      `<path d="M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  play:         `<circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.55)"/><polygon points="10,8 17,12 10,16" fill="#FFF"/>`,
  check:        `<path d="M5 13l4 4 10-10" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  shield:       `<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="#ED1B24" opacity=".18" stroke="#1F1F1F" stroke-width="1.2"/><path d="M9 12l2 2 4-4" stroke="#ED1B24" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
  pdf:          `<path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="#ED1B24" opacity=".18" stroke="#ED1B24" stroke-width="1.4" stroke-linejoin="round"/><path d="M14 3v5h5" stroke="#ED1B24" stroke-width="1.4" fill="none"/><text x="9" y="18" font-family="Arial" font-size="6" font-weight="700" fill="#1F1F1F">PDF</text>`,
  open:         `<path d="M15 3h6v6 M21 3l-9 9 M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`,
};

// Render an icon by key at given size. Optional className for the wrapping <svg>.
function icon(key, size = 16, className = '') {
  const def = ICON_DEFS[key];
  if (!def) return '';
  return `<svg class="icon ${className}" viewBox="0 0 24 24" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${def}</svg>`;
}

// Make available globally so HTML pages can use it inline.
if (typeof window !== 'undefined') {
  window.icon = icon;
  window.ICON_KEYS = Object.keys(ICON_DEFS);
}
