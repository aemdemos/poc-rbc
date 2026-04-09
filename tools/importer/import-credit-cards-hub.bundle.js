var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-credit-cards-hub.js
  var import_credit_cards_hub_exports = {};
  __export(import_credit_cards_hub_exports, {
    default: () => import_credit_cards_hub_default
  });

  // tools/importer/parsers/hero-promo.js
  function parse(element, { document }) {
    if (element.classList.contains("mobile-hidden") || element.classList.contains("desktop-hidden")) {
      element.remove();
      return;
    }
    const desktop = element.querySelector(".mobile-hidden.banner");
    if (!desktop) {
      element.remove();
      return;
    }
    const mobile = element.querySelector(".desktop-hidden.banner");
    if (mobile) mobile.remove();
    const bgImg = desktop.querySelector(":scope > img");
    const bgUrl = bgImg ? bgImg.src : "";
    const imageHint = document.createComment(" field:image ");
    const imageCell = document.createElement("div");
    imageCell.append(imageHint);
    const contentCol = desktop.querySelector(".grid-half.flex-wpr");
    if (contentCol) {
      const cardImg = contentCol.querySelector("img.custom-banner-card-img");
      if (cardImg) {
        const p = document.createElement("p");
        const img = document.createElement("img");
        img.src = cardImg.src;
        img.alt = cardImg.alt || "";
        p.append(img);
        imageCell.append(p);
      }
    }
    const textHint = document.createComment(" field:text ");
    const textCell = document.createElement("div");
    textCell.append(textHint);
    if (contentCol) {
      const heading = contentCol.querySelector("h2");
      if (heading) {
        textCell.append(heading.cloneNode(true));
      }
      contentCol.querySelectorAll(":scope > p").forEach((p) => {
        textCell.append(p.cloneNode(true));
      });
    }
    const cells = [
      [imageCell],
      [textCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "hero-promo",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse2(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll("a.category-button-container");
    items.forEach((item) => {
      const img = item.querySelector("img");
      const labelEl = item.querySelector("span.category-button-link");
      const href = item.getAttribute("href");
      const image = img ? img.cloneNode(true) : "";
      const textEl = document.createElement("div");
      if (labelEl && href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = labelEl.textContent.trim();
        textEl.append(link);
      } else if (labelEl) {
        textEl.textContent = labelEl.textContent.trim();
      }
      cells.push([
        document.createComment(" field:image "),
        image,
        textEl
      ]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards (category)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-info.js
  function parse3(element, { document }) {
    const textCol = element.querySelector(".what-is-cc-content");
    const imgCol = element.querySelector(".what-is-cc-img");
    const leftCell = document.createElement("div");
    if (textCol) {
      [...textCol.children].forEach((child) => {
        leftCell.append(child.cloneNode(true));
      });
    }
    const rightCell = document.createElement("div");
    const existingImg = imgCol ? imgCol.querySelector("img") : null;
    if (existingImg) {
      rightCell.append(existingImg.cloneNode(true));
    } else {
      const img = document.createElement("img");
      img.src = "https://www.rbcroyalbank.com/credit-cards/transformer/img/what-is-cc-img.svg";
      img.alt = "What is a Credit Card illustration";
      rightCell.append(img);
    }
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Columns Info",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card-carousel-offer.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll(".carousel-item");
    const cells = [];
    items.forEach((item) => {
      const top = item.querySelector(".carousel-item-top");
      const bottom = item.querySelector(".carousel-item-bottom");
      const imageCell = document.createElement("div");
      const imageComment = document.createComment(" field:image ");
      imageCell.append(imageComment);
      const cardImg = bottom ? bottom.querySelector("img") : null;
      if (cardImg) {
        imageCell.append(cardImg.cloneNode(true));
      }
      const textCell = document.createElement("div");
      if (top) {
        const badges = top.querySelectorAll(".card-details-offer-caption, .card-image-caption");
        badges.forEach((badge) => {
          const p = document.createElement("p");
          p.textContent = badge.textContent.trim();
          textCell.append(p);
        });
        const heading = top.querySelector(".h2");
        if (heading) {
          const h2 = document.createElement("h2");
          h2.innerHTML = heading.innerHTML;
          textCell.append(h2);
        }
        const paragraphs = top.querySelectorAll("p");
        paragraphs.forEach((p) => {
          const text = p.textContent.trim();
          if (text && !p.classList.contains("hide")) {
            textCell.append(p.cloneNode(true));
          }
        });
      }
      if (bottom) {
        const applyBtn = bottom.querySelector("a.btn");
        if (applyBtn) {
          const p = document.createElement("p");
          const a = applyBtn.cloneNode(true);
          p.append(a);
          textCell.append(p);
        }
        const detailsLink = bottom.querySelector("a.view-details-carousel-cta");
        if (detailsLink) {
          const p = document.createElement("p");
          const a = detailsLink.cloneNode(true);
          p.append(a);
          textCell.append(p);
        }
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Card Carousel Offer",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-tool.js
  function parse5(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".card-tools-grid-item");
    items.forEach((item) => {
      const heading = item.querySelector("h3");
      const cta = item.querySelector("a.btn");
      const img = item.querySelector("img");
      const image = img ? img.cloneNode(true) : "";
      const textEl = document.createElement("div");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        textEl.append(h3);
      }
      if (cta) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.setAttribute("href", cta.getAttribute("href"));
        link.textContent = cta.textContent.trim();
        p.append(link);
        textEl.append(p);
      }
      cells.push([
        document.createComment(" field:image "),
        image,
        textEl
      ]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards (tool)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-product.js
  function parse6(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".card-container");
    items.forEach((item) => {
      const cardImg = item.querySelector(".card-image-container img.card-image");
      const image = cardImg ? cardImg.cloneNode(true) : "";
      const textEl = document.createElement("div");
      const title = item.querySelector("h4.card-title");
      if (title) {
        const h4 = document.createElement("h4");
        h4.textContent = title.textContent.trim();
        textEl.append(h4);
      }
      const feeLabel = item.querySelector(".card-details-annual-fee-container .no-wrap");
      const feeValue = item.querySelector(".card-details-annual-fee");
      if (feeLabel && feeValue) {
        const p = document.createElement("p");
        p.textContent = `${feeLabel.textContent.trim()} ${feeValue.textContent.trim()}`;
        textEl.append(p);
      }
      const offerCaption = item.querySelector(".card-details-offer-caption");
      if (offerCaption) {
        const strong = document.createElement("strong");
        strong.textContent = offerCaption.textContent.trim();
        textEl.append(strong);
      }
      const offerContent = item.querySelector(".card-details-offer-content");
      if (offerContent) {
        const p = document.createElement("p");
        p.textContent = offerContent.textContent.trim();
        textEl.append(p);
      }
      const features = item.querySelectorAll(".desktop-only-flex .card-details-features-item");
      if (features.length > 0) {
        const ul = document.createElement("ul");
        features.forEach((feat) => {
          const content = feat.querySelector(".card-details-features-item-content, .card-details-features-heading");
          if (content) {
            const li = document.createElement("li");
            li.textContent = content.textContent.trim();
            ul.append(li);
          }
        });
        if (ul.children.length > 0) {
          textEl.append(ul);
        }
      }
      const applyBtn = item.querySelector("a.btn.primary, a.btn.secondary");
      if (applyBtn) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.setAttribute("href", applyBtn.getAttribute("href"));
        link.textContent = applyBtn.textContent.trim();
        p.append(link);
        textEl.append(p);
      }
      const compareLink = item.querySelector("a.standalone-link");
      if (compareLink) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.setAttribute("href", compareLink.getAttribute("href"));
        link.textContent = compareLink.textContent.trim();
        p.append(link);
        textEl.append(p);
      }
      cells.push([
        document.createComment(" field:image "),
        image,
        textEl
      ]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards (product)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-type.js
  function parse7(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".grid-one-fourth");
    items.forEach((item) => {
      const img = item.querySelector(".type-img-wpr img");
      const image = img ? img.cloneNode(true) : "";
      const textEl = document.createElement("div");
      const titleEl = item.querySelector(".h3");
      if (titleEl) {
        const h3 = document.createElement("h3");
        h3.textContent = titleEl.textContent.trim();
        textEl.append(h3);
      }
      const desc = item.querySelector("p.pad-r, div > p:not(.mega-menu-lob-title)");
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textEl.append(p);
      }
      const benefitsList = item.querySelector("ul.disc-list");
      if (benefitsList) {
        const ul = benefitsList.cloneNode(true);
        textEl.append(ul);
      }
      const viewLink = item.querySelector("a.standalone-link");
      if (viewLink) {
        const p = document.createElement("p");
        const link = document.createElement("a");
        link.setAttribute("href", viewLink.getAttribute("href"));
        link.textContent = viewLink.textContent.trim();
        p.append(link);
        textEl.append(p);
      }
      cells.push([
        document.createComment(" field:image "),
        image,
        textEl
      ]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards (type)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse8(element, { document }) {
    const gridHalves = element.querySelectorAll(":scope > .grid-half");
    const leftCell = document.createElement("div");
    if (gridHalves[0]) {
      [...gridHalves[0].querySelectorAll("h3, p, a, .phone-block-img img")].forEach((el) => {
        if (el.tagName === "IMG") {
          leftCell.append(el.cloneNode(true));
        } else {
          leftCell.append(el.cloneNode(true));
        }
      });
      if (!leftCell.hasChildNodes()) {
        leftCell.append(gridHalves[0].cloneNode(true));
      }
    }
    const rightCell = document.createElement("div");
    if (gridHalves[1]) {
      const blocks = gridHalves[1].querySelectorAll(".block-wpr");
      blocks.forEach((blockEl) => {
        const inner = blockEl.querySelector(".block-inner") || blockEl;
        [...inner.children].forEach((child) => {
          rightCell.append(child.cloneNode(true));
        });
        if (blockEl !== blocks[blocks.length - 1]) {
          rightCell.append(document.createElement("hr"));
        }
      });
      if (!rightCell.hasChildNodes()) {
        rightCell.append(gridHalves[1].cloneNode(true));
      }
    }
    const cells = [[leftCell, rightCell]];
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Columns Feature",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse9(element, { document }) {
    const cells = [];
    const items = element.querySelectorAll(".grid-one-third");
    items.forEach((item) => {
      const img = item.querySelector("img");
      const image = img ? img.cloneNode(true) : "";
      const textEl = document.createElement("div");
      const link = item.querySelector("a");
      const headingEl = item.querySelector(".h4, h4");
      if (link && headingEl) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.textContent = headingEl.textContent.trim();
        p.append(a);
        textEl.append(p);
      } else if (link) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.setAttribute("href", link.getAttribute("href"));
        a.textContent = link.textContent.trim();
        p.append(a);
        textEl.append(p);
      } else if (headingEl) {
        const p = document.createElement("p");
        p.textContent = headingEl.textContent.trim();
        textEl.append(p);
      }
      if (image || textEl.children.length) {
        cells.push([
          document.createComment(" field:image "),
          image,
          textEl
        ]);
      }
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Cards (article)",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse10(element, { document }) {
    const panels = element.querySelectorAll(".accordion-panel");
    const cells = [];
    panels.forEach((panel) => {
      const summaryCell = document.createElement("div");
      const summaryComment = document.createComment(" field:summary ");
      summaryCell.append(summaryComment);
      const toggleBtn = panel.querySelector("button.collapse-toggle");
      if (toggleBtn) {
        const p = document.createElement("p");
        p.textContent = toggleBtn.textContent.trim();
        summaryCell.append(p);
      }
      const textCell = document.createElement("div");
      const collapseInner = panel.querySelector(".collapse-content .collapse-inner");
      if (collapseInner) {
        [...collapseInner.children].forEach((child) => {
          textCell.append(child.cloneNode(true));
        });
      }
      cells.push([summaryCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "Accordion FAQ",
      cells
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/rbc-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        ".onetrust-pc-dark-filter",
        ".ot-sdk-container"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#smart-bnr-rbcapp",
        ".smart-bnr-wpr"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#search-bar",
        ".search-bar"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "section.disclaimer.display-none"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "#skip-nav",
        "#side-menu-id",
        ".side-menu",
        ".breadcrumb-wpr",
        ".nav-inner",
        "nav.breadcrumb",
        "link",
        "noscript",
        "iframe"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".compare-tray",
        ".popup_wrapper",
        ".popup_background",
        "#compareToolModal_wrapper",
        "#compareToolModal_background"
      ]);
      element.querySelectorAll('img[src*="bat.bing.com"], img[src*="facebook.com/tr"], img[src*="doubleclick"], img[src*="analytics"]').forEach((el) => el.remove());
      WebImporter.DOMUtils.remove(element, [
        ".no-result-found",
        ".stacked-img-wrapper",
        "#no-cards-found",
        "#categories-filter",
        ".filter-row"
      ]);
      element.querySelectorAll("#results").forEach((el) => el.remove());
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-dig-id");
        el.removeAttribute("data-dig-category");
        el.removeAttribute("data-dig-action");
        el.removeAttribute("data-dig-label");
        el.removeAttribute("data-dig-details");
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/rbc-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element.getRootNode() };
      const sections = [...template.sections].reverse();
      sections.forEach((section) => {
        let sectionEl = null;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.append(metadataBlock);
        }
        if (section.id !== "section-1") {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-credit-cards-hub.js
  var parsers = {
    "hero-promo": parse,
    "cards-category": parse2,
    "columns-info": parse3,
    "card-carousel-offer": parse4,
    "cards-tool": parse5,
    "cards-product": parse6,
    "cards-type": parse7,
    "columns-feature": parse8,
    "cards-article": parse9,
    "accordion-faq": parse10
  };
  var PAGE_TEMPLATE = {
    name: "credit-cards-hub",
    description: "Credit cards landing/hub page featuring hero banner, card category navigation, promotional offers carousel, card comparison tools, featured credit card listings, card type exploration with benefits, mobile app promotion, awards section, resource articles, and FAQ accordion.",
    urls: [
      "https://www.rbcroyalbank.com/credit-cards/index.html"
    ],
    blocks: [
      { name: "hero-promo", instances: ["#banner-text .banner"] },
      { name: "cards-category", instances: ["#category-buttons .category-button-grid"] },
      { name: "columns-info", instances: ["#what-is-cc .what-is-cc-container"] },
      { name: "card-carousel-offer", instances: [".offer-carousel-container"] },
      { name: "cards-tool", instances: ["#what-is-cc ~ section.section-cool-white .section-inner"] },
      { name: "cards-product", instances: ["#card-grid-container"] },
      { name: "cards-type", instances: ["#card-type .grid-wpr"] },
      { name: "columns-feature", instances: ["#card-type ~ section:has(.phone-block-wpr) > .section-inner > .grid-wpr.eh-wpr"] },
      { name: "cards-article", instances: ["section:not(.section-cool-white):has(h2.mar-b.text-center) .grid-wpr.eh-wpr"] },
      { name: "accordion-faq", instances: ["#accordionSet2"] }
    ],
    sections: [
      { id: "section-1", name: "Hero Banner", selector: "#banner-text", style: null, blocks: ["hero-promo"], defaultContent: [] },
      { id: "section-2", name: "Card Category Navigation", selector: "#category-buttons", style: "cool-white", blocks: ["cards-category"], defaultContent: ["#category-buttons .category-menu-heading"] },
      { id: "section-3", name: "What is a Credit Card", selector: "#what-is-cc", style: null, blocks: ["columns-info"], defaultContent: [] },
      { id: "section-4", name: "Best Current Offers Carousel", selector: "#what-is-cc ~ section:has(.offer-carousel-container)", style: null, blocks: ["card-carousel-offer"], defaultContent: ["#what-is-cc ~ section:has(.offer-carousel-container) h2"] },
      { id: "section-5", name: "Find and Compare Tools", selector: "#what-is-cc ~ section.section-cool-white", style: "cool-white", blocks: ["cards-tool"], defaultContent: ["#what-is-cc ~ section.section-cool-white > .section-inner > h2"] },
      { id: "section-6", name: "Popular Credit Cards", selector: "section:has(#card-grid-container)", style: null, blocks: ["cards-product"], defaultContent: [".subheading-title", ".subheading-paragraph"] },
      { id: "section-7", name: "Credit Card Types", selector: "#card-type", style: null, blocks: ["cards-type"], defaultContent: ["#card-type > .section-inner > h2", "#card-type > .section-inner > p"] },
      { id: "section-8", name: "More Features", selector: "#card-type ~ section:has(.phone-block-wpr)", style: null, blocks: ["columns-feature"], defaultContent: [".how-to-apply-title"] },
      { id: "section-9", name: "Credit Card Resources", selector: "#card-type ~ section:has(h2.mar-b.text-center)", style: null, blocks: ["cards-article"], defaultContent: ["#card-type ~ section:has(h2.mar-b.text-center) h2", "#card-type ~ section:has(h2.mar-b.text-center) > .section-inner > p"] },
      { id: "section-10", name: "FAQ", selector: "section:has(#accordionSet2)", style: null, blocks: ["accordion-faq"], defaultContent: ["section:has(#accordionSet2) h2", "section:has(#accordionSet2) .text-center a"] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_credit_cards_hub_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_credit_cards_hub_exports);
})();
