// Studio shell — sidebar nav + demo bar. Reused on every page via [data-include="nav"].
// Requires _icons.js to be loaded first.

const NAV_ITEMS = [
  { section: 'Workspace' },
  { key: 'overview',    label: 'Overview',          href: 'index.html',     icon: 'overview' },
  { key: 'brand',       label: 'Brand Guidelines',  href: 'brand.html',     icon: 'branddocs' },
  { key: 'library',     label: 'Library',           href: 'library.html',   icon: 'library' },
  { key: 'upload',      label: 'Upload',            href: 'upload.html',    icon: 'upload' },
  { key: 'specs',       label: 'Specs library',     href: 'specs.html',     icon: 'specs' },

  { section: 'Pipeline' },
  { key: 'ai',           label: 'AI Command Centre', href: 'ai.html',          icon: 'ai' },
  { key: 'newsletterai', label: 'Newsletter Agent',  href: '#',  icon: 'newsletterAi' },
  { key: 'tasks',        label: 'Tasks / Asana',     href: 'tasks.html',       icon: 'tasks' },
  { key: 'approval',     label: 'Approval queue',    href: 'approval.html',    icon: 'approval' },

  { section: 'Channels' },
  { key: 'podcasts',    label: 'Podcasts',          href: '#',              icon: 'podcasts' },
  { key: 'consoles',    label: 'Consoles',          href: 'consoles.html',  icon: 'consoles' },
  { key: 'logins',      label: 'Creative logins',   href: 'logins.html',    icon: 'logins' },
  { key: 'audits',      label: 'Audits',            href: 'audits.html',    icon: 'audit' },

  { section: 'Intelligence' },
  { key: 'analytics',   label: 'Analytics & BI',    href: 'analytics.html', icon: 'analytics' },
  { key: 'ads',         label: 'Ads intelligence',  href: 'ads.html',       icon: 'ads' },
  { key: 'website',     label: 'Website engine',    href: 'website.html',   icon: 'website', tag: 'AUTOPILOT' },
  { key: 'gbp',         label: 'GBP optimiser',     href: 'gbp.html',       icon: 'gbp', tag: 'AUTOPILOT' },
  { key: 'sales',       label: 'Sales dashboard',   href: 'sales.html',     icon: 'sales', tag: 'SOFT LAUNCH' },

  { section: 'Platform' },
  { key: 'llm',         label: 'LLM router',        href: 'llm.html',       icon: 'llm' },
  { key: 'team',        label: 'Team',              href: '#',              icon: 'team' },
  { key: 'profile',     label: 'My profile',        href: 'profile.html',   icon: 'profile' },
];

function renderNav() {
  let html = `
    <aside class="nav">
      <div class="nav-brand">
        <div class="logo-plate">
          <img src="brand/cnc-logo-transparent.png" alt="Care Net Consultants" class="nav-logo">
        </div>
        <div class="nav-tag">DIGITAL MARKETING STUDIO</div>
      </div>
  `;
  for (const item of NAV_ITEMS) {
    if (item.section) {
      html += `<div class="nav-section">${item.section}</div>`;
      continue;
    }
    const tagBadge = item.tag ? `<span class="nav-tag-chip">${item.tag}</span>` : '';
    html += `
      <a class="nav-item" data-page="${item.key}" href="${item.href}">
        ${icon(item.icon, 16, 'nav-icon')}
        <span>${item.label}</span>
        ${tagBadge}
      </a>
    `;
  }
  html += `
      <div class="nav-spacer"></div>
      <div class="nav-user">
        <div class="avatar">BB</div>
        <div class="meta">
          <div class="name">Barteldt Bakker</div>
          <div class="role">Owner</div>
        </div>
      </div>
    </aside>
  `;
  return html;
}

const DEMO_LINKS = [
  ['index.html',      'overview',     'Overview'],
  ['brand.html',      'brand',        'Brand Guidelines'],
  ['library.html',    'library',      'Library'],
  ['upload.html',     'upload',       'Upload'],
  ['ai.html',         'ai',           'AI Centre'],
  ['tasks.html',      'tasks',        'Tasks'],
  ['approval.html',   'approval',     'Approvals'],
  ['audits.html',     'audits',       'Audits'],
  ['logins.html',     'logins',       'Logins'],
  ['specs.html',      'specs',        'Specs'],
  ['analytics.html',  'analytics',    'Analytics'],
  ['ads.html',        'ads',          'Ads'],
  ['website.html',    'website',      'Website engine'],
  ['gbp.html',        'gbp',          'GBP optimiser'],
  ['sales.html',      'sales',        'Sales · soft launch'],
  ['consoles.html',   'consoles',     'Consoles'],
  ['llm.html',        'llm',          'LLM router'],
  ['profile.html',    'profile',      'Profile'],
];

function renderDemoBar() {
  return `
    <div class="demo-bar">
      <a href="/portal.html" class="back-to-portal">&larr; Back to Portal</a>
      ${DEMO_LINKS.map(([href, key, label]) =>
        `<a href="${href}" data-demo="${key}">${label}</a>`).join('')}
      <span class="right">CNC Digital Marketing Studio</span>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const slot = document.querySelector('[data-include="nav"]');
  if (slot) slot.outerHTML = renderNav();
  document.body.insertAdjacentHTML('afterbegin', renderDemoBar());
  document.body.classList.add('with-demo-bar');

  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll('.nav-item').forEach((el) => {
      if (el.dataset.page === page) el.classList.add('active');
    });
    document.querySelectorAll('.demo-bar a').forEach((el) => {
      if (el.dataset.demo === page) el.classList.add('active');
    });
  }
});
