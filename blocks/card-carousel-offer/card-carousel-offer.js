import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation, getBlockId } from '../../scripts/scripts.js';
import { createSliderControls } from '../../scripts/slider.js';
import { createCard } from '../card/card.js';

function updateNavButtons(block, current, total) {
  const prev = block.querySelector('.slide-prev');
  const next = block.querySelector('.slide-next');
  if (prev) prev.disabled = current <= 0;
  if (next) next.disabled = current >= total - 1;
}

function scrollToSlide(block, index) {
  const container = block.querySelector('.card-carousel-offer-slides');
  const slides = container?.querySelectorAll('.card-carousel-offer-slide');
  if (!container || !slides?.length) return;

  const clamped = Math.max(0, Math.min(index, slides.length - 1));
  const target = slides[clamped];
  container.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  block.dataset.activeSlide = clamped;
  updateNavButtons(block, clamped, slides.length);
}

function getCurrentIndex(block) {
  const container = block.querySelector('.card-carousel-offer-slides');
  const slides = container?.querySelectorAll('.card-carousel-offer-slide');
  if (!container || !slides?.length) return 0;
  const { scrollLeft } = container;
  const len = Math.min(slides.length, 100);
  for (let i = 0; i < len; i += 1) {
    if (scrollLeft < slides[i].offsetLeft + slides[i].offsetWidth) return i;
  }
  return slides.length - 1;
}

/**
 * Adds semantic classes to card body children so CSS doesn't rely on :nth-child.
 * Identifies badges (short uppercase text before the heading), the heading,
 * description paragraphs, and CTA links.
 */
function decorateSlideContent(slide) {
  const body = slide.querySelector('.cards-card-body');
  if (!body) return;

  const children = [...body.children];
  let foundHeading = false;
  let ctaStarted = false;

  children.forEach((el) => {
    // Heading
    if (el.tagName === 'H2') {
      el.classList.add('offer-heading');
      foundHeading = true;
      return;
    }

    // Before heading = badges
    if (!foundHeading && el.tagName === 'P') {
      el.classList.add('offer-badge');
      return;
    }

    // After heading: check if it's a CTA link paragraph
    if (foundHeading && el.tagName === 'P') {
      const hasApplyLink = el.querySelector('a[href*="apply"]');
      const hasViewLink = el.querySelector('a') && !el.querySelector('a[href*="apply"]');
      const isOnlyLink = el.children.length === 1 && el.querySelector('a');

      if (hasApplyLink || (isOnlyLink && hasViewLink) || ctaStarted) {
        el.classList.add('offer-cta');
        ctaStarted = true;
      } else {
        el.classList.add('offer-desc');
      }
    }
  });

  // Wrap CTA paragraphs in a row div for easier layout
  const ctas = body.querySelectorAll('.offer-cta');
  if (ctas.length > 0) {
    const ctaRow = document.createElement('div');
    ctaRow.className = 'offer-cta-row';
    ctas[0].before(ctaRow);

    // CTAs go in a left-side wrapper
    const ctaLeft = document.createElement('div');
    ctaLeft.className = 'offer-cta-left';
    ctas.forEach((cta) => ctaLeft.append(cta));
    ctaRow.append(ctaLeft);

    // Move card image into the CTA row (right side)
    const cardImage = slide.querySelector('.cards-card-image');
    if (cardImage) {
      cardImage.classList.add('offer-cta-right');
      ctaRow.append(cardImage);
    }
  }
}

export default function decorate(block) {
  const blockId = getBlockId('card-carousel-offer');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `carousel-${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.children];
  const isSingleSlide = rows.length < 2;

  const container = document.createElement('div');
  // eslint-disable-next-line secure-coding/no-hardcoded-credentials
  container.classList.add('card-carousel-offer-slides-container');

  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('card-carousel-offer-slides');
  slidesWrapper.setAttribute('tabindex', '0');
  slidesWrapper.setAttribute('aria-label', 'Card carousel slides');

  if (!isSingleSlide) {
    const { buttonsContainer } = createSliderControls(rows.length, {
      indicatorsAriaLabel: `Card Carousel Slide Controls for ${blockId}`,
    });
    container.append(buttonsContainer);
  }

  rows.forEach((row, idx) => {
    const card = createCard(row);
    card.classList.add('card-carousel-offer-slide');
    card.dataset.slideIndex = idx;
    decorateSlideContent(card);
    slidesWrapper.append(card);
    row.remove();
  });

  slidesWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  container.append(slidesWrapper);
  block.prepend(container);

  if (!isSingleSlide) {
    const prev = block.querySelector('.slide-prev');
    const next = block.querySelector('.slide-next');

    if (prev) {
      prev.addEventListener('click', () => {
        const current = getCurrentIndex(block);
        scrollToSlide(block, current - 1);
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        const current = getCurrentIndex(block);
        scrollToSlide(block, current + 1);
      });
    }

    slidesWrapper.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const current = getCurrentIndex(block);
      scrollToSlide(block, e.key === 'ArrowLeft' ? current - 1 : current + 1);
    });

    slidesWrapper.addEventListener('scroll', () => {
      const current = getCurrentIndex(block);
      updateNavButtons(block, current, slidesWrapper.querySelectorAll('.card-carousel-offer-slide').length);
    });

    updateNavButtons(block, 0, rows.length);

    block.querySelectorAll('.cards-card-image img').forEach((img) => {
      if (img.src.includes('width=750')) {
        img.src = img.src.replace('width=750', 'width=400');
      }
    });
  }
}
