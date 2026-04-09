/* eslint-disable */
/* global WebImporter */

/**
 * Parser: Columns Info
 * Selector: #what-is-cc .what-is-cc-container
 * Source: Two-column layout — left has text content, right has illustration image.
 * Columns blocks do not require HTML comments (field hints).
 */
export default function parse(element, { document }) {
  const textCol = element.querySelector('.what-is-cc-content');
  const imgCol = element.querySelector('.what-is-cc-img');

  // Build left column: gather all child nodes (h2, paragraph, link)
  const leftCell = document.createElement('div');
  if (textCol) {
    [...textCol.children].forEach((child) => {
      leftCell.append(child.cloneNode(true));
    });
  }

  // Build right column: image
  // The live DOM uses a CSS background-image on .what-is-cc-img (no <img> child).
  // Create an <img> from the known source asset URL.
  const rightCell = document.createElement('div');
  const existingImg = imgCol ? imgCol.querySelector('img') : null;
  if (existingImg) {
    rightCell.append(existingImg.cloneNode(true));
  } else {
    const img = document.createElement('img');
    img.src = 'https://www.rbcroyalbank.com/credit-cards/transformer/img/what-is-cc-img.svg';
    img.alt = 'What is a Credit Card illustration';
    rightCell.append(img);
  }

  const cells = [[leftCell, rightCell]];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns Info',
    cells,
  });

  element.replaceWith(block);
}
