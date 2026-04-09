/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroPromoParser from './parsers/hero-promo.js';
import cardsCategoryParser from './parsers/cards-category.js';
import columnsInfoParser from './parsers/columns-info.js';
import cardCarouselOfferParser from './parsers/card-carousel-offer.js';
import cardsToolParser from './parsers/cards-tool.js';
import cardsProductParser from './parsers/cards-product.js';
import cardsTypeParser from './parsers/cards-type.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';

// TRANSFORMER IMPORTS
import rbcCleanupTransformer from './transformers/rbc-cleanup.js';
import rbcSectionsTransformer from './transformers/rbc-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-promo': heroPromoParser,
  'cards-category': cardsCategoryParser,
  'columns-info': columnsInfoParser,
  'card-carousel-offer': cardCarouselOfferParser,
  'cards-tool': cardsToolParser,
  'cards-product': cardsProductParser,
  'cards-type': cardsTypeParser,
  'columns-feature': columnsFeatureParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'credit-cards-hub',
  description: 'Credit cards landing/hub page featuring hero banner, card category navigation, promotional offers carousel, card comparison tools, featured credit card listings, card type exploration with benefits, mobile app promotion, awards section, resource articles, and FAQ accordion.',
  urls: [
    'https://www.rbcroyalbank.com/credit-cards/index.html',
  ],
  blocks: [
    { name: 'hero-promo', instances: ['#banner-text .banner'] },
    { name: 'cards-category', instances: ['#category-buttons .category-button-grid'] },
    { name: 'columns-info', instances: ['#what-is-cc .what-is-cc-container'] },
    { name: 'card-carousel-offer', instances: ['.offer-carousel-container'] },
    { name: 'cards-tool', instances: ['#what-is-cc ~ section.section-cool-white .section-inner'] },
    { name: 'cards-product', instances: ['#card-grid-container'] },
    { name: 'cards-type', instances: ['#card-type .grid-wpr'] },
    { name: 'columns-feature', instances: ['#card-type ~ section:has(.phone-block-wpr) > .section-inner > .grid-wpr.eh-wpr'] },
    { name: 'cards-article', instances: ['section:not(.section-cool-white):has(h2.mar-b.text-center) .grid-wpr.eh-wpr'] },
    { name: 'accordion-faq', instances: ['#accordionSet2'] },
  ],
  sections: [
    { id: 'section-1', name: 'Hero Banner', selector: '#banner-text', style: null, blocks: ['hero-promo'], defaultContent: [] },
    { id: 'section-2', name: 'Card Category Navigation', selector: '#category-buttons', style: 'cool-white', blocks: ['cards-category'], defaultContent: ['#category-buttons .category-menu-heading'] },
    { id: 'section-3', name: 'What is a Credit Card', selector: '#what-is-cc', style: null, blocks: ['columns-info'], defaultContent: [] },
    { id: 'section-4', name: 'Best Current Offers Carousel', selector: '#what-is-cc ~ section:has(.offer-carousel-container)', style: null, blocks: ['card-carousel-offer'], defaultContent: ['#what-is-cc ~ section:has(.offer-carousel-container) h2'] },
    { id: 'section-5', name: 'Find and Compare Tools', selector: '#what-is-cc ~ section.section-cool-white', style: 'cool-white', blocks: ['cards-tool'], defaultContent: ['#what-is-cc ~ section.section-cool-white > .section-inner > h2'] },
    { id: 'section-6', name: 'Popular Credit Cards', selector: 'section:has(#card-grid-container)', style: null, blocks: ['cards-product'], defaultContent: ['.subheading-title', '.subheading-paragraph'] },
    { id: 'section-7', name: 'Credit Card Types', selector: '#card-type', style: null, blocks: ['cards-type'], defaultContent: ['#card-type > .section-inner > h2', '#card-type > .section-inner > p'] },
    { id: 'section-8', name: 'More Features', selector: '#card-type ~ section:has(.phone-block-wpr)', style: null, blocks: ['columns-feature'], defaultContent: ['.how-to-apply-title'] },
    { id: 'section-9', name: 'Credit Card Resources', selector: '#card-type ~ section:has(h2.mar-b.text-center)', style: null, blocks: ['cards-article'], defaultContent: ['#card-type ~ section:has(h2.mar-b.text-center) h2', '#card-type ~ section:has(h2.mar-b.text-center) > .section-inner > p'] },
    { id: 'section-10', name: 'FAQ', selector: 'section:has(#accordionSet2)', style: null, blocks: ['accordion-faq'], defaultContent: ['section:has(#accordionSet2) h2', 'section:has(#accordionSet2) .text-center a'] },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  rbcCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [rbcSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
