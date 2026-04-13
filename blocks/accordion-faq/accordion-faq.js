import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];
  const mid = Math.ceil(items.length / 2);

  // Create two independent columns so expanding one doesn't affect the other
  const col1 = document.createElement('div');
  col1.className = 'accordion-faq-column';
  const col2 = document.createElement('div');
  col2.className = 'accordion-faq-column';

  items.forEach((row, i) => {
    const li = document.createElement('div');
    li.className = 'accordion-faq-item';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);

    const [label, body] = [...li.children];
    if (label !== null && label !== undefined) {
      label.className = 'accordion-faq-item-label';
      label.addEventListener('click', () => li.classList.toggle('active'));
    }
    if (body !== null && body !== undefined) body.className = 'accordion-faq-item-body';

    if (i < mid) {
      col1.append(li);
    } else {
      col2.append(li);
    }
  });

  block.textContent = '';
  block.append(col1);
  block.append(col2);
}
