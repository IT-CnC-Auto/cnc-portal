// CNC asset folder taxonomy. Customer / patient / employee / brand-centric.
// One source of truth. Used by Library + Specs pages.
//
// Schema:  { name, icon, count, children?: [], active?: bool }

const FOLDER_TREE = [
  {
    name: 'Brand', icon: 'brand', count: 168,
    children: [
      { name: 'Brand Guidelines',  icon: 'guideline', count: 14, hint: 'Logo, colour, type, voice rules' },
      { name: 'Brand Templates',   icon: 'template',  count: 42, hint: 'Letterhead, slides, social, email' },
      { name: 'Brand Assets',      icon: 'assets',    count: 112, open: true, children: [
        { name: 'Generic Care Net Assets',       icon: 'assets',  count: 28 },
        { name: 'Generic Occupational Health',   icon: 'health',  count: 24 },
        { name: 'Industry — Construction',       icon: 'industry', count: 9 },
        { name: 'Industry — Mining',             icon: 'industry', count: 11 },
        { name: 'Industry — Manufacturing',      icon: 'industry', count: 8 },
        { name: 'Industry — Agriculture / Abattoir', icon: 'industry', count: 6 },
        { name: 'Industry — Food Handling',      icon: 'industry', count: 5 },
        { name: 'Industry — Transport & Warehousing', icon: 'industry', count: 7 },
        { name: 'Industry — Cleaning, Hygiene, Recycling', icon: 'industry', count: 4 },
        { name: 'Industry — Telecommunications', icon: 'industry', count: 3 },
        { name: 'Industry — Safety & Security',  icon: 'industry', count: 6 },
        { name: 'Industry — Hospitality',        icon: 'industry', count: 4 },
        { name: 'Raw Stock Photos',              icon: 'footage', count: 124 },
        { name: 'Employee Photos',               icon: 'employee', count: 142 },
        { name: 'Clinic Photos',                 icon: 'clinic',  count: 38 },
        { name: 'Mobile Clinic Photos',          icon: 'mobileClinic', count: 22 },
      ]},
    ],
  },

  {
    name: 'Customer-centric', icon: 'customer', count: 312,
    children: [
      { name: 'Sales Collateral',     icon: 'assets',     count: 38 },
      { name: 'Proposals & Pitches',  icon: 'template',   count: 24 },
      { name: 'Case Studies',         icon: 'guideline',  count: 12 },
      { name: 'Testimonials',         icon: 'video',      count: 8 },
      { name: 'Onboarding Packs',     icon: 'pack',       count: 14 },
      { name: 'Renewal Touchpoints',  icon: 'newsletters', count: 18 },
    ],
  },

  {
    name: 'Patient-centric', icon: 'patient', count: 218, active: true, open: true,
    children: [
      { name: 'Health Education',         icon: 'health',     count: 52 },
      { name: 'Pre-Screening Resources',  icon: 'guideline',  count: 22 },
      { name: 'Post-Screening Resources', icon: 'guideline',  count: 18 },
      { name: 'Health Awareness Packs',   icon: 'pack',       count: 86, open: true, active: true, children: [
        { name: 'June — Mens Health',       icon: 'health',  count: 12, active: true },
        { name: 'June — Youth Day',         icon: 'health',  count: 8 },
        { name: 'June — World Blood Donor', icon: 'health',  count: 9 },
        { name: 'May packs',                icon: 'calendar', count: 22 },
        { name: 'April packs',              icon: 'calendar', count: 35 },
      ]},
      { name: 'Mental Wellness',         icon: 'health',  count: 18 },
      { name: 'Chronic Care Support',    icon: 'health',  count: 22 },
    ],
  },

  {
    name: 'Employee-centric', icon: 'employee', count: 264,
    children: [
      { name: 'Birthdays',              icon: 'birthday', count: 31 },
      { name: 'Anniversaries',          icon: 'birthday', count: 14 },
      { name: 'Internal Announcements', icon: 'newsletters', count: 28 },
      { name: 'Sport Days',             icon: 'employee', count: 18 },
      { name: 'Religious Holidays',     icon: 'calendar', count: 24 },
      { name: 'Team Photos',            icon: 'employee', count: 96 },
    ],
  },

  {
    name: 'Training', icon: 'training', count: 142,
    children: [
      { name: 'Internal Training',         icon: 'video', count: 24 },
      { name: 'External Training',         icon: 'video', count: 38 },
      { name: 'Explainer Videos',          icon: 'video', count: 31 },
      { name: 'Cinematic Advertisements',  icon: 'ad',    count: 12 },
      { name: 'Industry-specific Training', icon: 'industry', count: 37 },
    ],
  },

  {
    name: 'Newsletters', icon: 'newsletters', count: 124,
    children: [
      { name: 'Internal Newsletters',  icon: 'newsletters', count: 32 },
      { name: 'External Newsletters',  icon: 'newsletters', count: 48 },
      { name: 'Industry Newsletters',  icon: 'industry',    count: 44 },
    ],
  },

  {
    name: 'Podcasts', icon: 'podcasts', count: 54,
    children: [
      { name: 'Think Tank Episodes',  icon: 'audio',  count: 18 },
      { name: 'Episode Covers',       icon: 'canvas', count: 18 },
      { name: 'Show Notes',           icon: 'guideline', count: 18 },
    ],
  },

  {
    name: 'Social Cards', icon: 'social', count: 183,
    children: [
      { name: 'LinkedIn',  icon: 'social', count: 64 },
      { name: 'Facebook',  icon: 'social', count: 52 },
      { name: 'Instagram', icon: 'social', count: 48 },
      { name: 'X / Twitter', icon: 'social', count: 19 },
    ],
  },

  {
    name: 'Audio Library', icon: 'audio', count: 38,
    children: [
      { name: 'Music Beds',  icon: 'audio', count: 18 },
      { name: 'Sound FX',    icon: 'audio', count: 12 },
      { name: 'Voiceovers',  icon: 'audio', count: 8 },
    ],
  },

  {
    name: 'Stock Footage', icon: 'footage', count: 24,
  },

  // ----- Specs (also surface on the Specs page) -----
  {
    name: 'Corporate Specs', icon: 'specs', count: 38,
    children: [
      { name: 'Uniforms & PPE',           icon: 'uniform', count: 12 },
      { name: 'Vehicle Branding Specs',   icon: 'vehicle', count: 8 },
      { name: 'Clinic Layouts',           icon: 'clinic',  count: 6 },
      { name: 'Mobile Clinic Layouts',    icon: 'mobileClinic', count: 5 },
      { name: 'Clinic Poster Designs',    icon: 'poster',  count: 4 },
      { name: 'Clinic Canvas Designs',    icon: 'canvas',  count: 3 },
    ],
  },
];

// Render the tree recursively.
function renderTree(nodes, depth = 0) {
  return nodes.map((n) => {
    const hasChildren = n.children && n.children.length > 0;
    const isOpen = n.open || n.active;
    const twist = hasChildren
      ? (isOpen ? `<span class="twist">${icon('chevronDown', 10)}</span>` : `<span class="twist">${icon('chevronRight', 10)}</span>`)
      : `<span class="twist invisible">·</span>`;
    let html = `
      <div class="folder-row${n.active ? ' active' : ''}">
        ${twist}
        ${icon(n.icon || 'folder', 16)}
        <span class="name">${n.name}</span>
        <span class="count">${n.count}</span>
      </div>
    `;
    if (hasChildren && isOpen) {
      html += `<div class="folder-children">${renderTree(n.children, depth + 1)}</div>`;
    }
    return html;
  }).join('');
}

if (typeof window !== 'undefined') {
  window.FOLDER_TREE = FOLDER_TREE;
  window.renderTree = renderTree;
}
