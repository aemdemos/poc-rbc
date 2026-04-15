import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  const sections = fragment ? [...fragment.children] : [];

  // === Blue columns section ===
  const blueSection = document.createElement('div');
  blueSection.className = 'footer-columns';
  const columnsInner = document.createElement('div');
  columnsInner.className = 'footer-columns-inner';

  // EDS flattens all content into one default-content-wrapper.
  // Split into columns by <h3> — each h3 starts a new column.
  const firstSection = sections[0];
  if (firstSection) {
    const wrapper = firstSection.querySelector('.default-content-wrapper') || firstSection;
    const children = [...wrapper.children];
    let currentCol = null;

    children.forEach((child) => {
      if (child.tagName === 'H3') {
        currentCol = document.createElement('div');
        currentCol.className = 'footer-column';
        columnsInner.append(currentCol);
      }
      if (!currentCol) {
        currentCol = document.createElement('div');
        currentCol.className = 'footer-column';
        columnsInner.append(currentCol);
      }
      currentCol.append(child);
    });

    // Add chevrons to phone number paragraphs (after h4 headings)
    columnsInner.querySelectorAll('h4').forEach((h4) => {
      let next = h4.nextElementSibling;
      while (next && next.tagName === 'P') {
        const text = next.textContent.trim();
        if (/^\d|^1-/.test(text)) {
          next.classList.add('footer-phone');
        }
        next = next.nextElementSibling;
      }
    });

    // Mark last column for OS icon styling
    const lastCol = columnsInner.querySelector('.footer-column:last-child');
    if (lastCol) lastCol.classList.add('footer-column-apps');
  }

  blueSection.append(columnsInner);

  // === Gray legal section ===
  const graySection = document.createElement('div');
  graySection.className = 'footer-legal';
  const legalInner = document.createElement('div');
  legalInner.className = 'footer-legal-inner';
  const legalLeft = document.createElement('div');
  legalLeft.className = 'footer-legal-left';
  const legalRight = document.createElement('div');
  legalRight.className = 'footer-legal-right';

  const lastSection = sections[1] || sections[sections.length - 1];
  if (lastSection) {
    const paras = lastSection.querySelectorAll('p');
    paras.forEach((p, i) => {
      if (i < 2) legalLeft.append(p.cloneNode(true));
    });

    // Social icons
    const socialDiv = document.createElement('div');
    socialDiv.className = 'footer-social';
    const socialLinks = [
      { name: 'Facebook', url: 'https://www.facebook.com/rbc' },
      { name: 'Instagram', url: 'https://www.instagram.com/rbc/' },
      { name: 'Twitter', url: 'https://twitter.com/RBC' },
      { name: 'YouTube', url: 'https://www.youtube.com/user/RBC' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/company/rbc' },
    ];
    socialLinks.forEach(({ name, url }) => {
      const a = document.createElement('a');
      a.href = url;
      a.className = `footer-social-icon footer-social-${name.toLowerCase()}`;
      a.setAttribute('aria-label', name);
      socialDiv.append(a);
    });

    // Back to Top
    const topWrapper = document.createElement('div');
    topWrapper.className = 'footer-top-wrapper';
    const backToTop = document.createElement('a');
    backToTop.href = '#top';
    backToTop.className = 'footer-back-to-top';
    const arrow = document.createElement('span');
    arrow.className = 'footer-top-arrow';
    arrow.textContent = '\u2191';
    const topText = document.createElement('span');
    topText.textContent = 'Top';
    backToTop.append(arrow, topText);
    topWrapper.append(backToTop);

    legalRight.append(socialDiv, topWrapper);
  }

  legalInner.append(legalLeft, legalRight);
  graySection.append(legalInner);
  footer.append(blueSection, graySection);
  block.append(footer);
}
