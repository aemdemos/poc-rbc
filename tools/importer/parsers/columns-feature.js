/* eslint-disable */
/* global WebImporter */

/**
 * Parser: Columns Feature
 * Selector: #card-type ~ section > .section-inner > .grid-wpr.eh-wpr
 * Source: Two-column layout in "Experience Even More Great Features From RBC" section.
 * Left: RBC Mobile App promo (h3, text, app store links, phone image).
 * Right: Award Winning card block + NOMI block.
 * Columns blocks do not require HTML comments (field hints).
 */
export default function parse(element, { document }) {
  const gridHalves = element.querySelectorAll(':scope > .grid-half');

  // Left column — mobile app promo
  const leftCell = document.createElement('div');
  if (gridHalves[0]) {
    [...gridHalves[0].querySelectorAll('h3, p, a, .phone-block-img img')].forEach((el) => {
      if (el.tagName === 'IMG') {
        leftCell.append(el.cloneNode(true));
      } else {
        leftCell.append(el.cloneNode(true));
      }
    });
    // Fallback: if the above is too selective, clone entire inner content
    if (!leftCell.hasChildNodes()) {
      leftCell.append(gridHalves[0].cloneNode(true));
    }
  }

  // Right column — award winning + NOMI blocks
  const rightCell = document.createElement('div');
  if (gridHalves[1]) {
    const blocks = gridHalves[1].querySelectorAll('.block-wpr');
    blocks.forEach((blockEl) => {
      const inner = blockEl.querySelector('.block-inner') || blockEl;
      [...inner.children].forEach((child) => {
        rightCell.append(child.cloneNode(true));
      });
      // Add a separator between stacked blocks
      if (blockEl !== blocks[blocks.length - 1]) {
        rightCell.append(document.createElement('hr'));
      }
    });
    if (!rightCell.hasChildNodes()) {
      rightCell.append(gridHalves[1].cloneNode(true));
    }
  }

  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns Feature',
    cells,
  });

  element.replaceWith(block);
}
