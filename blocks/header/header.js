import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeAllMegamenus(nav) {
  nav.querySelectorAll('.nav-main-item[aria-expanded="true"]').forEach((item) => {
    item.setAttribute('aria-expanded', 'false');
  });
  nav.classList.remove('mega-menu-open');
}

function toggleMegamenu(nav, item) {
  const wasOpen = item.getAttribute('aria-expanded') === 'true';
  closeAllMegamenus(nav);
  if (!wasOpen) {
    item.setAttribute('aria-expanded', 'true');
    nav.classList.add('mega-menu-open');
  }
}

function toggleMobileMenu(nav) {
  const expanded = nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = expanded ? '' : 'hidden';
}

function buildMegamenuPanel(subList) {
  const panel = document.createElement('div');
  panel.className = 'megamenu-panel';

  const inner = document.createElement('div');
  inner.className = 'megamenu-inner';

  let currentCol = document.createElement('div');
  currentCol.className = 'megamenu-column';
  let colItemCount = 0;
  const maxPerCol = 12;

  const items = [...subList.children];
  items.forEach((li) => {
    const strong = li.querySelector('strong');
    const link = li.querySelector('a');

    if (colItemCount >= maxPerCol && strong) {
      inner.append(currentCol);
      currentCol = document.createElement('div');
      currentCol.className = 'megamenu-column';
      colItemCount = 0;
    }

    if (strong) {
      const heading = document.createElement('p');
      heading.className = 'megamenu-heading';
      heading.textContent = strong.textContent;
      currentCol.append(heading);
      colItemCount += 1;
    } else if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      a.className = 'megamenu-link';
      currentCol.append(a);
      colItemCount += 1;
    }
  });

  if (currentCol.children.length > 0) {
    inner.append(currentCol);
  }

  panel.append(inner);
  return panel;
}

function buildUtilityBar(utilSection) {
  const bar = document.createElement('div');
  bar.className = 'nav-utility';

  const utilList = utilSection.querySelector('ul');
  if (!utilList) return bar;

  const left = document.createElement('div');
  left.className = 'nav-utility-left';
  const right = document.createElement('div');
  right.className = 'nav-utility-right';

  [...utilList.children].forEach((li) => {
    const subList = li.querySelector('ul');

    if (subList) {
      // Dropdown item (e.g. Institutional)
      const labelEl = li.querySelector(':scope > p');
      const label = labelEl?.textContent?.trim()
        || li.childNodes[0]?.textContent?.trim() || '';
      const wrapper = document.createElement('div');
      wrapper.className = 'nav-utility-dropdown';

      const btn = document.createElement('button');
      btn.className = 'nav-utility-link nav-utility-dropdown-btn';
      btn.textContent = label;
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
      wrapper.addEventListener('mouseenter', () => {
        btn.setAttribute('aria-expanded', 'true');
      });
      wrapper.addEventListener('mouseleave', () => {
        btn.setAttribute('aria-expanded', 'false');
      });

      const dropdown = document.createElement('ul');
      dropdown.className = 'nav-utility-dropdown-list';
      [...subList.children].forEach((subLi) => {
        const subLink = subLi.querySelector('a');
        if (subLink) {
          const item = document.createElement('li');
          const a = document.createElement('a');
          a.href = subLink.href;
          a.textContent = subLink.textContent;
          item.append(a);
          dropdown.append(item);
        }
      });

      wrapper.append(btn, dropdown);
      left.append(wrapper);
    } else {
      // Simple link — may be direct <a> or wrapped in <p>
      const link = li.querySelector('a');
      if (link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.textContent;
        a.className = 'nav-utility-link';
        left.append(a);
      }
    }
  });

  bar.append(left, right);
  return bar;
}

/**
 * loads and decorates the header
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  // Parse nav sections from fragment
  const sections = [...fragment.children];
  const brandSection = sections[0]; // logo
  const navSection = sections[1]; // main nav items
  const toolsSection = sections[2]; // contact, language, sign in
  const utilSection = sections[3]; // utility bar links

  // === Row 0: Utility Bar ===
  const utilityBar = utilSection ? buildUtilityBar(utilSection) : document.createElement('div');
  utilityBar.classList.add('nav-utility');

  // === Row 1: Main Header (logo + search + tools) ===
  const headerBar = document.createElement('div');
  headerBar.className = 'nav-header-bar';

  // Brand/Logo
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) {
    const brandLink = brandSection.querySelector('a');
    if (brandLink) {
      const a = document.createElement('a');
      a.href = brandLink.href;
      const img = brandLink.querySelector('img');
      if (img) {
        const logoImg = document.createElement('img');
        logoImg.src = img.src;
        logoImg.alt = img.alt || 'Royal Bank of Canada';
        a.append(logoImg);
      }
      const textSpan = document.createElement('span');
      textSpan.className = 'nav-brand-text';
      textSpan.textContent = 'Royal Bank';
      a.append(textSpan);
      brand.append(a);
    }
  }

  // Search
  const searchBtn = document.createElement('button');
  searchBtn.className = 'nav-search-trigger';
  searchBtn.setAttribute('aria-label', 'Search RBC');
  const searchText = document.createElement('span');
  searchText.className = 'nav-search-text';
  searchText.textContent = 'Search RBC...';
  searchBtn.append(searchText);
  searchBtn.addEventListener('click', () => {
    const dialog = nav.querySelector('.nav-search-dialog');
    if (dialog) {
      dialog.classList.toggle('is-open');
      const input = dialog.querySelector('input');
      if (input && dialog.classList.contains('is-open')) input.focus();
    }
  });

  // Search dialog
  const searchDialog = document.createElement('div');
  searchDialog.className = 'nav-search-dialog';
  const dialogInner = document.createElement('div');
  dialogInner.className = 'nav-search-dialog-inner';
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.placeholder = 'Ask your question';
  searchInput.setAttribute('aria-label', 'Search RBC');
  const searchClose = document.createElement('button');
  searchClose.className = 'nav-search-close';
  searchClose.setAttribute('aria-label', 'Close search');
  searchClose.textContent = '\u00D7';
  searchClose.addEventListener('click', () => {
    searchDialog.classList.remove('is-open');
  });
  dialogInner.append(searchInput, searchClose);
  searchDialog.append(dialogInner);

  // Tools (Contact, Language, Sign In)
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  if (toolsSection) {
    const paras = toolsSection.querySelectorAll('p');
    paras.forEach((p) => {
      const link = p.querySelector('a');
      if (!link) return;
      const text = link.textContent.trim();
      if (text === 'FR') {
        const langBtn = document.createElement('button');
        langBtn.className = 'nav-lang-btn';
        langBtn.setAttribute('aria-label', 'Select language');
        langBtn.textContent = 'EN';
        langBtn.addEventListener('click', () => {
          window.location.href = link.href;
        });
        tools.append(langBtn);
      } else if (text === 'Sign In') {
        const signIn = document.createElement('a');
        signIn.href = link.href;
        signIn.className = 'nav-signin-btn';
        signIn.textContent = 'Sign In';
        tools.append(signIn);
      } else {
        const a = document.createElement('a');
        a.href = link.href;
        a.className = 'nav-tool-link';
        a.textContent = text;
        tools.append(a);
      }
    });
  }

  // Insert search button as first item in tools (before Contact Us)
  tools.insertBefore(searchBtn, tools.firstChild);
  headerBar.append(brand, tools);

  // === Row 2: Global Navigation ===
  const globalNav = document.createElement('div');
  globalNav.className = 'nav-global';

  const mainList = navSection ? navSection.querySelector('ul') : null;
  if (mainList) {
    const navList = document.createElement('ul');
    navList.className = 'nav-main-list';

    [...mainList.children].forEach((li) => {
      const navItem = document.createElement('li');
      navItem.className = 'nav-main-item';

      const subList = li.querySelector('ul');
      const directLink = li.querySelector(':scope > a');

      if (directLink && !subList) {
        // Simple link (e.g. Advice)
        const a = document.createElement('a');
        a.href = directLink.href;
        a.className = 'nav-main-link';
        a.textContent = directLink.textContent.trim();
        navItem.append(a);
      } else {
        // Megamenu item — label is in a <p> tag or first text node
        const labelEl = li.querySelector(':scope > p');
        const label = labelEl?.textContent?.trim()
          || li.childNodes[0]?.textContent?.trim() || '';
        const btn = document.createElement('button');
        btn.className = 'nav-main-btn';
        btn.textContent = label;
        btn.setAttribute('aria-expanded', 'false');
        navItem.setAttribute('aria-expanded', 'false');

        btn.addEventListener('click', () => {
          if (!isDesktop.matches) {
            toggleMegamenu(nav, navItem);
          }
        });
        btn.addEventListener('mouseenter', () => {
          if (isDesktop.matches) {
            closeAllMegamenus(nav);
            navItem.setAttribute('aria-expanded', 'true');
            nav.classList.add('mega-menu-open');
          }
        });

        navItem.append(btn);

        if (subList) {
          const panel = buildMegamenuPanel(subList);
          navItem.append(panel);
        }
      }
      navList.append(navItem);
    });

    // Close megamenu on mouse leave from global nav area
    globalNav.addEventListener('mouseleave', () => {
      if (isDesktop.matches) closeAllMegamenus(nav);
    });

    globalNav.append(navList);
  }

  // === Hamburger (mobile) ===
  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-controls', 'nav');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.className = 'nav-hamburger-icon';
  hamburger.append(hamburgerIcon);
  hamburger.addEventListener('click', () => toggleMobileMenu(nav));

  // === Assemble ===
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  // Wrap header bar in full-width blue container
  const headerBarOuter = document.createElement('div');
  headerBarOuter.className = 'nav-header-bar-outer';
  headerBarOuter.append(headerBar);
  headerBarOuter.append(hamburger);

  navWrapper.append(utilityBar);
  navWrapper.append(headerBarOuter);
  navWrapper.append(searchDialog);
  navWrapper.append(globalNav);

  nav.append(navWrapper);
  block.append(nav);

  // === Escape key handling ===
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllMegamenus(nav);
      const dialog = nav.querySelector('.nav-search-dialog');
      if (dialog) dialog.classList.remove('is-open');
      if (!isDesktop.matches && nav.getAttribute('aria-expanded') === 'true') {
        toggleMobileMenu(nav);
      }
    }
  });

  // === Resize handling ===
  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      nav.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
      closeAllMegamenus(nav);
    }
  });
}
