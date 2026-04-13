import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation, getBlockId } from '../../scripts/scripts.js';
import { createCard } from '../card/card.js';

export default function decorate(block) {
  const blockId = getBlockId('cards');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `Cards for ${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Cards');

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    ul.append(createCard(row));
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  // Ensure section heading exists for the tool variant (fallback until authored)
  if (block.classList.contains('tool')) {
    const blockWrapper = block.closest('.cards-wrapper');
    if (blockWrapper && !blockWrapper.previousElementSibling?.querySelector?.('h2')) {
      const heading = document.createElement('h2');
      heading.textContent = 'Find and Compare our Best Credit Cards';
      const wrapper = document.createElement('div');
      wrapper.className = 'default-content-wrapper';
      wrapper.append(heading);
      blockWrapper.before(wrapper);
    }
  }
}
