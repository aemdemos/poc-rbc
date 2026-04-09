/* eslint-disable */
/* global WebImporter */

/**
 * Parser: Card Carousel Offer
 * Selector: .offer-carousel-container
 * Source: Horizontal carousel with offer cards. Each .carousel-item becomes one row.
 * Card model fields: image (reference, hinted), text (richtext, collapsed — no hint).
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.carousel-item');
  const cells = [];

  items.forEach((item) => {
    const top = item.querySelector('.carousel-item-top');
    const bottom = item.querySelector('.carousel-item-bottom');

    // --- Image column (card image from bottom section) ---
    const imageCell = document.createElement('div');
    const imageComment = document.createComment(' field:image ');
    imageCell.append(imageComment);
    const cardImg = bottom ? bottom.querySelector('img') : null;
    if (cardImg) {
      imageCell.append(cardImg.cloneNode(true));
    }

    // --- Text column (all textual content: badges, heading, descriptions, links) ---
    const textCell = document.createElement('div');

    if (top) {
      // Badges
      const badges = top.querySelectorAll('.card-details-offer-caption, .card-image-caption');
      badges.forEach((badge) => {
        const p = document.createElement('p');
        p.textContent = badge.textContent.trim();
        textCell.append(p);
      });

      // Promotional heading
      const heading = top.querySelector('.h2');
      if (heading) {
        const h2 = document.createElement('h2');
        h2.innerHTML = heading.innerHTML;
        textCell.append(h2);
      }

      // Description paragraphs (excluding hidden)
      const paragraphs = top.querySelectorAll('p');
      paragraphs.forEach((p) => {
        const text = p.textContent.trim();
        if (text && !p.classList.contains('hide')) {
          textCell.append(p.cloneNode(true));
        }
      });
    }

    if (bottom) {
      // CTA buttons
      const applyBtn = bottom.querySelector('a.btn');
      if (applyBtn) {
        const p = document.createElement('p');
        const a = applyBtn.cloneNode(true);
        p.append(a);
        textCell.append(p);
      }

      const detailsLink = bottom.querySelector('a.view-details-carousel-cta');
      if (detailsLink) {
        const p = document.createElement('p');
        const a = detailsLink.cloneNode(true);
        p.append(a);
        textCell.append(p);
      }
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Card Carousel Offer',
    cells,
  });

  element.replaceWith(block);
}
