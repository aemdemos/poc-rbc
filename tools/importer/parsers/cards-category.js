/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  const items = element.querySelectorAll('a.category-button-container');

  items.forEach((item) => {
    const img = item.querySelector('img');
    const labelEl = item.querySelector('span.category-button-link');
    const href = item.getAttribute('href');

    const image = img ? img.cloneNode(true) : '';

    const textEl = document.createElement('div');
    if (labelEl && href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = labelEl.textContent.trim();
      textEl.append(link);
    } else if (labelEl) {
      textEl.textContent = labelEl.textContent.trim();
    }

    cells.push([
      document.createComment(' field:image '),
      image,
      textEl,
    ]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards (category)',
    cells,
  });

  element.replaceWith(block);
}
