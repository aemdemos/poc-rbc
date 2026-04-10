/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-promo.
 * Card product image → hero image field (the actual hero visual)
 * Heading + description + CTAs → hero text field
 * Beach/lifestyle background → handled by section transformer (background-image in section-metadata)
 */
export default function parse(element, { document }) {
  // Skip inner banner elements (mobile/desktop variants arrive as separate calls)
  if (element.classList.contains('mobile-hidden') || element.classList.contains('desktop-hidden')) {
    element.remove();
    return;
  }

  // Work from the desktop banner
  const desktop = element.querySelector('.mobile-hidden.banner');
  if (!desktop) {
    element.remove();
    return;
  }

  // Remove mobile banner
  const mobile = element.querySelector('.desktop-hidden.banner');
  if (mobile) mobile.remove();

  // Extract background image URL for section-metadata
  const bgImg = desktop.querySelector(':scope > img');
  const bgUrl = bgImg ? bgImg.src : '';

  // --- Row 1: Card product image (the hero image) ---
  const imageHint = document.createComment(' field:image ');
  const imageCell = document.createElement('div');
  imageCell.append(imageHint);

  const contentCol = desktop.querySelector('.grid-half.flex-wpr');
  if (contentCol) {
    const cardImg = contentCol.querySelector('img.custom-banner-card-img');
    if (cardImg) {
      const p = document.createElement('p');
      const img = document.createElement('img');
      img.src = cardImg.src;
      img.alt = cardImg.alt || '';
      p.append(img);
      imageCell.append(p);
    }
  }

  // --- Row 2: Text content (heading + description + CTAs) ---
  const textHint = document.createComment(' field:text ');
  const textCell = document.createElement('div');
  textCell.append(textHint);

  if (contentCol) {
    // Heading (h2)
    const heading = contentCol.querySelector('h2');
    if (heading) {
      textCell.append(heading.cloneNode(true));
    }

    // Description paragraphs and CTA links
    contentCol.querySelectorAll(':scope > p').forEach((p) => {
      textCell.append(p.cloneNode(true));
    });
  }

  // Build the hero-promo block
  const cells = [
    [imageCell],
    [textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-promo',
    cells,
  });

  element.replaceWith(block);
}
