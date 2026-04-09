/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  const items = element.querySelectorAll('.grid-one-fourth');

  items.forEach((item) => {
    const img = item.querySelector('.type-img-wpr img');
    const image = img ? img.cloneNode(true) : '';

    const textEl = document.createElement('div');

    // Category title (h3-level div)
    const titleEl = item.querySelector('.h3');
    if (titleEl) {
      const h3 = document.createElement('h3');
      h3.textContent = titleEl.textContent.trim();
      textEl.append(h3);
    }

    // Description paragraph
    const desc = item.querySelector('p.pad-r, div > p:not(.mega-menu-lob-title)');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textEl.append(p);
    }

    // Benefits list
    const benefitsList = item.querySelector('ul.disc-list');
    if (benefitsList) {
      const ul = benefitsList.cloneNode(true);
      textEl.append(ul);
    }

    // View link
    const viewLink = item.querySelector('a.standalone-link');
    if (viewLink) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.setAttribute('href', viewLink.getAttribute('href'));
      link.textContent = viewLink.textContent.trim();
      p.append(link);
      textEl.append(p);
    }

    cells.push([
      document.createComment(' field:image '),
      image,
      textEl,
    ]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards (type)',
    cells,
  });

  element.replaceWith(block);
}
