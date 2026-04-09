/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  const cells = [];
  const items = element.querySelectorAll('.card-container');

  items.forEach((item) => {
    const cardImg = item.querySelector('.card-image-container img.card-image');
    const image = cardImg ? cardImg.cloneNode(true) : '';

    const textEl = document.createElement('div');

    // Card name
    const title = item.querySelector('h4.card-title');
    if (title) {
      const h4 = document.createElement('h4');
      h4.textContent = title.textContent.trim();
      textEl.append(h4);
    }

    // Annual fee
    const feeLabel = item.querySelector('.card-details-annual-fee-container .no-wrap');
    const feeValue = item.querySelector('.card-details-annual-fee');
    if (feeLabel && feeValue) {
      const p = document.createElement('p');
      p.textContent = `${feeLabel.textContent.trim()} ${feeValue.textContent.trim()}`;
      textEl.append(p);
    }

    // Offer caption
    const offerCaption = item.querySelector('.card-details-offer-caption');
    if (offerCaption) {
      const strong = document.createElement('strong');
      strong.textContent = offerCaption.textContent.trim();
      textEl.append(strong);
    }

    // Offer text
    const offerContent = item.querySelector('.card-details-offer-content');
    if (offerContent) {
      const p = document.createElement('p');
      p.textContent = offerContent.textContent.trim();
      textEl.append(p);
    }

    // Feature bullets (desktop version)
    const features = item.querySelectorAll('.desktop-only-flex .card-details-features-item');
    if (features.length > 0) {
      const ul = document.createElement('ul');
      features.forEach((feat) => {
        const content = feat.querySelector('.card-details-features-item-content, .card-details-features-heading');
        if (content) {
          const li = document.createElement('li');
          li.textContent = content.textContent.trim();
          ul.append(li);
        }
      });
      if (ul.children.length > 0) {
        textEl.append(ul);
      }
    }

    // Apply Now button
    const applyBtn = item.querySelector('a.btn.primary, a.btn.secondary');
    if (applyBtn) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.setAttribute('href', applyBtn.getAttribute('href'));
      link.textContent = applyBtn.textContent.trim();
      p.append(link);
      textEl.append(p);
    }

    // Compare / Learn More link
    const compareLink = item.querySelector('a.standalone-link');
    if (compareLink) {
      const p = document.createElement('p');
      const link = document.createElement('a');
      link.setAttribute('href', compareLink.getAttribute('href'));
      link.textContent = compareLink.textContent.trim();
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
    name: 'Cards (product)',
    cells,
  });

  element.replaceWith(block);
}
