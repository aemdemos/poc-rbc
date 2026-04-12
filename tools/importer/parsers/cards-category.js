/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  const items = element.querySelectorAll('a.category-button-container');

  items.forEach((item) => {
    const img = item.querySelector('img');
    const labelEl = item.querySelector('span.category-button-link');
    const href = item.getAttribute('href');

    // Image cell with field hint
    const imageCell = document.createElement('div');
    imageCell.append(document.createComment(' field:image '));
    if (img) imageCell.append(img.cloneNode(true));

    // Text cell
    const textCell = document.createElement('div');
    if (labelEl && href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = labelEl.textContent.trim();
      textCell.append(link);
    } else if (labelEl) {
      textCell.textContent = labelEl.textContent.trim();
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards (category)',
    cells,
  });

  element.replaceWith(block);
}
