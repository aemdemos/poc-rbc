/* eslint-disable */
/* global WebImporter */

export default function parse(element, { document }) {
  // Skip inner banner elements (mobile/desktop variants)
  if (element.classList.contains('mobile-hidden') || element.classList.contains('desktop-hidden')) {
    element.remove();
    return;
  }

  // Extract from the desktop child banner
  const desktop = element.querySelector('.mobile-hidden.banner');
  if (!desktop) {
    element.remove();
    return;
  }

  // Remove mobile banner so it doesn't leak
  const mobile = element.querySelector('.desktop-hidden.banner');
  if (mobile) mobile.remove();

  // Row 1: Background image — it's a CSS background-image on the banner div, not an <img>
  const imageHint = document.createComment(' field:image ');
  const imageCell = document.createElement('div');
  imageCell.append(imageHint);

  // Extract background-image URL from inline style or data attribute
  const bgUrl = desktop.getAttribute('data-img')
    || (desktop.style.backgroundImage && desktop.style.backgroundImage.replace(/url\(["']?/, '').replace(/["']?\)/, ''));

  if (bgUrl) {
    const img = document.createElement('img');
    // Resolve relative URL to absolute
    const base = document.baseURI || document.location?.href || '';
    try {
      img.src = new URL(bgUrl, base).href;
    } catch (e) {
      img.src = bgUrl;
    }
    img.alt = '';
    const p = document.createElement('p');
    p.append(img);
    imageCell.append(p);
  }

  // Row 2: Text content
  const textHint = document.createComment(' field:text ');
  const textCell = document.createElement('div');
  textCell.append(textHint);

  const contentCol = desktop.querySelector('.grid-half.flex-wpr');
  if (contentCol) {
    // Card product image + award badge
    const cardImages = contentCol.querySelectorAll('img.custom-banner-card-img');
    if (cardImages.length) {
      const imgWrapper = document.createElement('p');
      cardImages.forEach((ci) => imgWrapper.append(ci.cloneNode(true)));
      textCell.append(imgWrapper);
    }

    // Card name label (e.g. "RBC Avion Visa Infinite")
    const label = contentCol.querySelector('.text-bold.text-small, p.text-bold');
    if (label) {
      const h2Label = document.createElement('h2');
      h2Label.textContent = label.textContent.trim();
      textCell.append(h2Label);
    }

    // Main heading
    const heading = contentCol.querySelector('h2');
    if (heading) {
      const p = document.createElement('p');
      p.innerHTML = heading.innerHTML;
      // Make the key number bold
      textCell.append(p);
    }

    // Remaining paragraphs (tagline, CTAs)
    contentCol.querySelectorAll(':scope > p:not(.text-bold):not(.text-small)').forEach((p) => {
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

  element.replaceWith(block);
}
