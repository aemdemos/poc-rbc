/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  const items = element.querySelectorAll('.card-tools-grid-item');

  items.forEach((item) => {
    const heading = item.querySelector('h3');
    const cta = item.querySelector('a.btn');
    const img = item.querySelector('img');

    const image = img ? img.cloneNode(true) : '';

    const textEl = document.createElement('div');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textEl.append(h3);
    }
    if (cta) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.setAttribute('href', cta.getAttribute('href'));
      link.textContent = cta.textContent.trim();
      p.append(link);
      textEl.append(p);
    }

    cells.push([
      document.createComment(' field:image '),
      image,
      textEl,
    ]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards (tool)',
    cells,
  });

  element.replaceWith(block);
}
