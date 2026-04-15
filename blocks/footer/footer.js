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

  // Get the sections from fragment
  const sections = fragment ? [...fragment.children] : [];

  // === Blue columns section ===
  const blueSection = document.createElement('div');
  blueSection.className = 'footer-columns';

  const columnsInner = document.createElement('div');
  columnsInner.className = 'footer-columns-inner';

  // The first section contains the 4 column divs
  // EDS wraps them — find all divs that contain h3 headings
  const firstSection = sections[0];
  if (firstSection) {
    const allDivs = firstSection.querySelectorAll(':scope div > div');
    const columnDivs = [];

    // Find divs that have h3 headings — these are the column containers
    allDivs.forEach((div) => {
      if (div.querySelector('h3') && !div.querySelector('div > h3')) {
        columnDivs.push(div);
      }
    });

    // If we found column divs, use them; otherwise try direct children
    const columns = columnDivs.length > 0
      ? columnDivs
      : [...(firstSection.querySelectorAll(':scope > div > div') || [])];

    columns.forEach((col) => {
      const column = document.createElement('div');
      column.className = 'footer-column';
      while (col.firstChild) column.append(col.firstChild);
      columnsInner.append(column);
    });

    // If no columns found, just dump all content
    if (columnsInner.children.length === 0) {
      while (firstSection.firstChild) columnsInner.append(firstSection.firstChild);
    }
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

  // The second section has copyright, legal links, and social links
  const lastSection = sections[1] || sections[sections.length - 1];
  if (lastSection) {
    const paras = lastSection.querySelectorAll('p');
    paras.forEach((p, i) => {
      if (i < 2) {
        // Copyright and legal links go left
        const clone = p.cloneNode(true);
        legalLeft.append(clone);
      }
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
    const backToTop = document.createElement('a');
    backToTop.href = '#top';
    backToTop.className = 'footer-back-to-top';
    const arrow = document.createElement('span');
    arrow.className = 'footer-top-arrow';
    arrow.textContent = '\u2191';
    const topText = document.createElement('span');
    topText.textContent = 'Top';
    backToTop.append(arrow, topText);

    const topWrapper = document.createElement('div');
    topWrapper.className = 'footer-top-wrapper';
    topWrapper.append(backToTop);

    legalRight.append(socialDiv, topWrapper);
  }

  legalInner.append(legalLeft, legalRight);
  graySection.append(legalInner);

  footer.append(blueSection, graySection);
  block.append(footer);
}
