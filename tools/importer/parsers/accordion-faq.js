/* eslint-disable */
/* global WebImporter */

/**
 * Parser: Accordion FAQ
 * Selector: #accordionSet2
 * Source: FAQ items in .accordion-panel divs across two .grid-half columns.
 * Accordion-faq-item fields: summary (text, hinted), text (richtext, collapsed — no hint).
 * Each accordion-panel = one row with 2 columns: [summary, text content].
 */
export default function parse(element, { document }) {
  const panels = element.querySelectorAll('.accordion-panel');
  const cells = [];

  panels.forEach((panel) => {
    // Summary column — question text from the toggle button
    const summaryCell = document.createElement('div');
    const summaryComment = document.createComment(' field:summary ');
    summaryCell.append(summaryComment);
    const toggleBtn = panel.querySelector('button.collapse-toggle');
    if (toggleBtn) {
      const p = document.createElement('p');
      p.textContent = toggleBtn.textContent.trim();
      summaryCell.append(p);
    }

    // Text column — answer content from .collapse-inner
    const textCell = document.createElement('div');
    const collapseInner = panel.querySelector('.collapse-content .collapse-inner');
    if (collapseInner) {
      [...collapseInner.children].forEach((child) => {
        textCell.append(child.cloneNode(true));
      });
    }

    cells.push([summaryCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Accordion FAQ',
    cells,
  });

  element.replaceWith(block);
}
