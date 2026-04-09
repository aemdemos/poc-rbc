/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  const items = element.querySelectorAll('.grid-one-third');

  items.forEach((item) => {
    const img = item.querySelector('img');
    const image = img ? img.cloneNode(true) : '';

    const textEl = document.createElement('div');

    // Linked heading (h4-level or .h4 class)
    const link = item.querySelector('a');
    const headingEl = item.querySelector('.h4, h4');
    if (link && headingEl) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = headingEl.textContent.trim();
      p.append(a);
      textEl.append(p);
    } else if (link) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.setAttribute('href', link.getAttribute('href'));
      a.textContent = link.textContent.trim();
      p.append(a);
      textEl.append(p);
    } else if (headingEl) {
      const p = document.createElement('p');
      p.textContent = headingEl.textContent.trim();
      textEl.append(p);
    }

    if (image || textEl.children.length) {
      cells.push([
        document.createComment(' field:image '),
        image,
        textEl,
      ]);
    }
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards (article)',
    cells,
  });

  element.replaceWith(block);
}
