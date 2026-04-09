/* eslint-disable */
/* global WebImporter */

/**
 * Parser: Hero Promo block variant.
 * Extracts hero banner content from the source page and creates
 * a hero-promo block with image and rich text cells.
 *
 * Source selector: #banner-text .banner
 * Block model fields: image (reference), imageAlt (text, collapsed), text (richtext)
 */
export default function parse(element, { document }) {
  // The selector #banner-text .banner matches the outer .banner wrapper,
  // .mobile-hidden.banner (desktop), and .desktop-hidden.banner (mobile).
  // Only process the outer wrapper (first match). Inner banners are handled
  // here and removed so they produce no output on subsequent calls.

  // Skip if already processed or if this is an inner banner element
  if (element.classList.contains('mobile-hidden') || element.classList.contains('desktop-hidden')) {
    // Inner banner — remove from DOM so it doesn't leak as loose content.
    // Content was already extracted from the outer wrapper call.
    element.remove();
    return;
  }

  // This is the outer .banner wrapper — extract content from the desktop child
  const desktop = element.querySelector('.mobile-hidden.banner');
  if (!desktop) {
    element.remove();
    return;
  }

  // Remove the mobile banner immediately so later parser calls find nothing
  const mobile = element.querySelector('.desktop-hidden.banner');
  if (mobile) mobile.remove();

  // Row 1: Background image (first direct img in desktop banner)
  const bgImage = desktop.querySelector(':scope > img');
  const imageHint = document.createComment(' field:image ');
  const imageCell = document.createElement('div');
  imageCell.append(imageHint);
  if (bgImage) {
    imageCell.append(bgImage.cloneNode(true));
  }

  // Row 2: Text content (card image, heading, promo paragraph, CTAs)
  const textHint = document.createComment(' field:text ');
  const textCell = document.createElement('div');
  textCell.append(textHint);

  // Locate the content column (.grid-half.flex-wpr)
  const contentCol = desktop.querySelector('.grid-half.flex-wpr');
  if (contentCol) {
    // Card product image
    const cardImage = contentCol.querySelector('img.custom-banner-card-img');
    if (cardImage) {
      const imgWrapper = document.createElement('p');
      imgWrapper.append(cardImage.cloneNode(true));
      textCell.append(imgWrapper);
    }

    // Heading
    const heading = contentCol.querySelector('h2');
    if (heading) {
      textCell.append(heading.cloneNode(true));
    }

    // Paragraphs: promotional text and CTA links
    contentCol.querySelectorAll(':scope > p').forEach((p) => {
      textCell.append(p.cloneNode(true));
    });
  }

  const cells = [
    [imageCell],
    [textCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-promo',
    cells,
  });

  // Replace the entire outer wrapper with the block, removing all inner banners
  element.replaceWith(block);
}
