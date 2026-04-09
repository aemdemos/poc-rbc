/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: RBC section breaks and section-metadata.
 * Adds <hr> between sections and section-metadata blocks for styled sections.
 * Runs afterTransform only. Uses payload.template.sections from page-templates.json.
 * Selectors from captured DOM of https://www.rbcroyalbank.com/credit-cards/index.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument
      ? { document: element.ownerDocument }
      : { document: element.getRootNode() };

    // Process sections in reverse order to avoid shifting DOM positions
    const sections = [...template.sections].reverse();

    sections.forEach((section) => {
      // Try selector (string or array)
      let sectionEl = null;
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      for (const sel of selectors) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }
      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(metadataBlock);
      }

      // Add <hr> before section (except first section)
      if (section.id !== 'section-1') {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
