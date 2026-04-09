/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: RBC Royal Bank cleanup.
 * Removes non-authorable content (header, footer, nav, cookie banners, etc.)
 * Selectors from captured DOM of https://www.rbcroyalbank.com/credit-cards/index.html
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie consent and OneTrust banners (blocks parsing)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '.onetrust-pc-dark-filter',
      '.ot-sdk-container',
    ]);

    // Remove smart app banners (blocks parsing)
    WebImporter.DOMUtils.remove(element, [
      '#smart-bnr-rbcapp',
      '.smart-bnr-wpr',
    ]);

    // Remove search overlay (blocks parsing)
    WebImporter.DOMUtils.remove(element, [
      '#search-bar',
      '.search-bar',
    ]);

    // Remove hidden disclaimer section
    WebImporter.DOMUtils.remove(element, [
      'section.disclaimer.display-none',
    ]);
  }

  if (hookName === H.after) {
    // Remove non-authorable site chrome
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      '#skip-nav',
      '#side-menu-id',
      '.side-menu',
      '.breadcrumb-wpr',
      '.nav-inner',
      'nav.breadcrumb',
      'link',
      'noscript',
      'iframe',
    ]);

    // Remove compare tray and card chooser modal
    WebImporter.DOMUtils.remove(element, [
      '.compare-tray',
      '.popup_wrapper',
      '.popup_background',
      '#compareToolModal_wrapper',
      '#compareToolModal_background',
    ]);

    // Remove tracking pixels and beacons
    element.querySelectorAll('img[src*="bat.bing.com"], img[src*="facebook.com/tr"], img[src*="doubleclick"], img[src*="analytics"]').forEach((el) => el.remove());

    // Remove no-results / empty-state messaging and search filter UI
    WebImporter.DOMUtils.remove(element, [
      '.no-result-found',
      '.stacked-img-wrapper',
      '#no-cards-found',
      '#categories-filter',
      '.filter-row',
    ]);
    // Remove card grid results container (dynamic filter UI)
    element.querySelectorAll('#results').forEach((el) => el.remove());

    // Remove tracking/data attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-dig-id');
      el.removeAttribute('data-dig-category');
      el.removeAttribute('data-dig-action');
      el.removeAttribute('data-dig-label');
      el.removeAttribute('data-dig-details');
      el.removeAttribute('onclick');
    });
  }
}
