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
    // No-loop navigation: clamp at first/last slide
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

    // Keyboard navigation
    slidesWrapper.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      e.preventDefault();
      const current = getCurrentIndex(block);
      scrollToSlide(block, e.key === 'ArrowLeft' ? current - 1 : current + 1);
    });

    // Sync button state on scroll
    slidesWrapper.addEventListener('scroll', () => {
      const current = getCurrentIndex(block);
      updateNavButtons(block, current, slidesWrapper.querySelectorAll('.card-carousel-offer-slide').length);
    });

    // Initial button state
    updateNavButtons(block, 0, rows.length);

    // Request higher resolution for card images
    block.querySelectorAll('.cards-card-image img').forEach((img) => {
      if (img.src.includes('width=750')) {
        img.src = img.src.replace('width=750', 'width=400');
      }
    });
  }
}
