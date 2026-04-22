const FALLBACK_MANIFEST = {
  brand: {
    name: "pugtools",
    tagline: "Minecraft tools for builders, creators, and players.",
    description: "Fast Minecraft utilities and practical guides to help you build, plan, optimize, and create without bouncing between unrelated sites.",
    shortPitch: "One place for practical Minecraft tools.",
    audiences: ["Builders", "Content creators", "Map makers", "Technical players", "General players"],
  },
  categories: [
    {
      slug: "building",
      name: "Building tools",
      description: "Shape planners and layout helpers for circles, curves, arches, and cleaner builds.",
    },
    {
      slug: "optimization",
      name: "Optimization tools",
      description: "Planning utilities that cut guesswork, cost, and repeated trial and error.",
    },
    {
      slug: "reference",
      name: "Guides and reference",
      description: "Fast lookup pages and practical references to keep nearby while you play.",
    },
    {
      slug: "creator",
      name: "Creator tools",
      description: "Utilities that help with exports, showcases, packs, and explainer-friendly workflows.",
    },
  ],
  tools: [
    {
      name: "Circle Generator",
      shortName: "Circle",
      description: "Plan block-perfect circles with diameter controls, quadrant views, and quick PNG export.",
      path: "/circle-generator/",
      slug: "circle",
      kind: "Building utility",
      statusLabel: "Live now",
      highlight: "Builder favorite",
      featuredRank: 4,
      categories: ["building", "creator"],
    },
    {
      name: "Curve Generator",
      shortName: "Curve",
      description: "Lay out arches and custom curves with editable handles, coordinate copy, and fast preview export.",
      path: "/curve-generator/",
      slug: "curve",
      kind: "Layout planner",
      statusLabel: "Live now",
      highlight: "Smooth shape planning",
      featuredRank: 5,
      categories: ["building", "creator"],
    },
    {
      name: "Enchant Optimizer",
      shortName: "Enchant",
      description: "Find lower-cost anvil merge orders for stacked enchant plans without spreadsheet cleanup.",
      path: "/enchant-optimizer/",
      slug: "enchant",
      kind: "Optimization planner",
      statusLabel: "Live now",
      highlight: "Survival shortcut",
      featuredRank: 3,
      categories: ["optimization"],
    },
    {
      name: "Mob Dub",
      shortName: "Mob Dub",
      description: "Browse mob sound sets, swap in your own takes, and export a resource pack without the manual cleanup.",
      path: "/mob-dub/",
      slug: "mob-dub",
      kind: "Creator workflow",
      statusLabel: "Live now",
      highlight: "Pack-building helper",
      featuredRank: 1,
      categories: ["creator", "reference"],
    },
    {
      name: "Potions Plus",
      shortName: "Potions",
      description: "Browse brewing chains, search potion outcomes, and move through recipes without tab chaos.",
      path: "/potions-plus/",
      slug: "potions",
      kind: "Reference guide",
      statusLabel: "Live now",
      highlight: "Brewing lookup",
      featuredRank: 2,
      categories: ["reference"],
    },
    {
      name: "Conversion Studio",
      shortName: "Convert",
      description: "Convert audio and image files between formats in the browser without uploads or installs.",
      path: "/conversion-studio/",
      slug: "conversion-studio",
      kind: "File utility",
      statusLabel: "Live now",
      highlight: "Browser-based conversion",
      featuredRank: 6,
      categories: ["creator"],
    },
  ],
};

async function bootstrapSite() {
  const manifest = await loadManifest();
  const view = document.body.dataset.view || "";

  mountSiteChrome(manifest, view);
  enhanceMetadata(manifest);
  initAnalytics(manifest, view);

  if (view === "home") {
    renderHome(manifest);
  }

  bindAnalyticsInteractions();
}

async function loadManifest() {
  try {
    const response = await fetch("shared/tools.json");
    if (!response.ok) {
      throw new Error(`Unable to load tools manifest: ${response.status}`);
    }
    return await response.json();
  } catch (_error) {
    return FALLBACK_MANIFEST;
  }
}

function mountSiteChrome(manifest, view) {
  const headerRoot = document.querySelector("[data-site-header]");
  const footerRoot = document.querySelector("[data-site-footer]");

  if (headerRoot) {
    headerRoot.replaceChildren(createSiteHeader(manifest.brand || FALLBACK_MANIFEST.brand));
  }

  if (footerRoot) {
    footerRoot.replaceChildren(createSiteFooter(manifest.brand || FALLBACK_MANIFEST.brand, sortTools(manifest.tools || FALLBACK_MANIFEST.tools)));
  }
}

function createSiteHeader(brand) {
  const header = element("header", { className: "site-header" });
  const brandLink = element("a", {
    className: "site-brand",
    attrs: {
      href: "/",
      "aria-label": "Open the pugtools home page",
    },
  });
  const brandMark = element("span", { className: "site-brand__mark", text: "PT", attrs: { "aria-hidden": "true" } });
  const brandCopy = element("span", { className: "site-brand__copy" });
  const brandTitle = element("span", { className: "site-brand__title", text: brand.name || "pugtools" });
  const brandTagline = element("span", {
    className: "site-brand__tagline",
    text: brand.shortPitch || brand.tagline || FALLBACK_MANIFEST.brand.shortPitch,
  });

  brandCopy.append(brandTitle, brandTagline);
  brandLink.append(brandMark, brandCopy);

  const nav = element("nav", {
    className: "site-header__nav",
    attrs: { "aria-label": "Primary" },
  });

  const navLinks = [
    { href: "/#guides", key: "guides", label: "Guides" },
    { href: "/#creators", key: "creators", label: "Creators" },
    { href: "/#about", key: "about", label: "About" },
  ];

  navLinks.forEach((link) => {
    const anchor = element("a", {
      className: "site-nav__link",
      text: link.label,
      attrs: { href: link.href },
    });

    nav.append(anchor);
  });

  header.append(brandLink, nav);
  return header;
}

function createSiteFooter(brand, tools) {
  const footer = element("footer", { className: "site-footer" });
  const intro = element("div", { className: "site-footer__intro" });
  intro.append(
    element("p", { className: "eyebrow eyebrow--tight", text: "pugtools" }),
    element("h2", { className: "site-footer__title", text: brand.shortPitch || "One place for practical Minecraft tools." }),
    element("p", {
      className: "site-footer__copy",
      text: brand.description || FALLBACK_MANIFEST.brand.description,
    }),
    element("a", {
      className: "button button--secondary button--footer",
      text: "Open the landing page",
      attrs: { href: "/" },
    }),
  );

  const grid = element("div", { className: "site-footer__grid" });
  grid.append(
    createFooterColumn("Explore", [
      footerLink("Home", "/"),
      footerLink("Creators", "/#creators"),
      footerLink("About", "/#about"),
    ]),
    createFooterColumn("Current tools", tools.map((tool) => footerLink(tool.name, tool.path))),
    createFooterColumn("Next up", [
      footerLink("Guides and references", "/#guides"),
      footerText("Creator resources and support pages"),
      footerText("Privacy and analytics page"),
      footerText("Changelog and updates page"),
    ]),
  );

  const meta = element("div", { className: "site-footer__meta" });
  meta.append(
    element("p", {
      text: `© ${new Date().getFullYear()} ${brand.name || "pugtools"}. Built for practical Minecraft planning, reference, and creation.`,
    }),
  );

  footer.append(intro, grid, meta);
  return footer;
}

function createFooterColumn(title, items) {
  const section = element("section", { className: "site-footer__column" });
  const list = element("ul", { className: "site-footer__list" });

  items.forEach((item) => {
    list.append(element("li", {}, item));
  });

  section.append(element("h3", { className: "site-footer__heading", text: title }), list);
  return section;
}

function footerLink(label, href) {
  return element("a", { className: "site-footer__link", text: label, attrs: { href } });
}

function footerText(label) {
  return element("span", { className: "site-footer__muted", text: label });
}

function renderHome(manifest) {
  const brand = manifest.brand || FALLBACK_MANIFEST.brand;
  const tools = sortTools(manifest.tools || FALLBACK_MANIFEST.tools);
  const categories = manifest.categories || FALLBACK_MANIFEST.categories;
  const categoriesBySlug = indexBySlug(categories);

  renderAudienceBadges(brand.audiences || []);
  renderHeroToolList(tools);
  renderHeroStats(tools, categories);
  renderLineup(tools);
  renderFeaturedTools(tools, categoriesBySlug);
  renderCategoryPreview(categories, tools, categoriesBySlug);
  renderCreatorTools(tools);
}

function renderAudienceBadges(audiences) {
  const root = document.getElementById("hero-audiences");
  if (!root) {
    return;
  }

  root.replaceChildren(...audiences.map((audience) => createBadge(audience, "outline")));
}

function renderHeroToolList(tools) {
  const root = document.getElementById("hero-tool-list");
  if (!root) {
    return;
  }

  root.replaceChildren(...tools.map((tool) => createHeroToolLink(tool)));
}

function createHeroToolLink(tool) {
  const anchor = element("a", {
    className: "hero-spotlight__item",
    attrs: {
      href: tool.path,
      "data-tool-slug": tool.slug,
      "data-tool-location": "hero-list",
    },
  });

  anchor.append(
    element("span", { className: "hero-spotlight__title", text: tool.name }),
    element("span", { className: "hero-spotlight__meta", text: `${tool.highlight} · ${tool.kind}` }),
  );

  return anchor;
}

function renderHeroStats(tools, categories) {
  const root = document.getElementById("hero-stats");
  if (!root) {
    return;
  }

  const stats = [
    { value: String(tools.length), label: "live tools", note: "ready to use today" },
    { value: String(categories.length), label: "clear lanes", note: "building, optimization, guides, creators" },
    { value: "Next", label: "guides and resources", note: "designed into the layout already" },
  ];

  root.replaceChildren(
    ...stats.map((stat) => {
      const card = element("article", { className: "stat-card" });
      card.append(
        element("strong", { className: "stat-card__value", text: stat.value }),
        element("span", { className: "stat-card__label", text: stat.label }),
        element("span", { className: "stat-card__note", text: stat.note }),
      );
      return card;
    }),
  );
}

function renderLineup(tools) {
  const root = document.getElementById("lineup-list");
  if (!root) {
    return;
  }

  root.replaceChildren(
    ...tools.map((tool) =>
      element("a", {
        className: "lineup-pill",
        text: tool.name,
        attrs: {
          href: tool.path,
          "data-tool-slug": tool.slug,
          "data-tool-location": "lineup",
        },
      }),
    ),
  );
}

function renderFeaturedTools(tools, categoriesBySlug) {
  const root = document.getElementById("featured-tools");
  if (!root) {
    return;
  }

  root.replaceChildren(...tools.map((tool, index) => createToolCard(tool, categoriesBySlug, "featured", index)));
}

function renderCategoryPreview(categories, tools) {
  const root = document.getElementById("category-preview");
  if (!root) {
    return;
  }

  root.replaceChildren(...categories.map((category) => createCategoryCard(category, tools)));
}

function createCategoryCard(category, tools) {
  const relevantTools = tools.filter((tool) => Array.isArray(tool.categories) && tool.categories.includes(category.slug));
  const card = element("article", { className: "category-card" });
  const heading = element("div", { className: "category-card__heading" });
  heading.append(
    element("p", { className: "eyebrow eyebrow--tight", text: `${relevantTools.length} ${relevantTools.length === 1 ? "tool" : "tools"}` }),
    element("h3", { text: category.name }),
  );

  const chipRow = element("div", { className: "category-card__chips" });
  relevantTools.forEach((tool) => {
    chipRow.append(
      element("a", {
        className: "category-chip",
        text: tool.shortName || tool.name,
        attrs: {
          href: tool.path,
          "data-tool-slug": tool.slug,
          "data-tool-location": `category-${category.slug}`,
        },
      }),
    );
  });

  card.append(
    heading,
    element("p", { className: "section-copy", text: category.description }),
    chipRow,
  );

  return card;
}

function renderCreatorTools(tools) {
  const root = document.getElementById("creator-tool-list");
  if (!root) {
    return;
  }

  const creatorTools = tools.filter((tool) => Array.isArray(tool.categories) && tool.categories.includes("creator"));
  root.replaceChildren(
    ...creatorTools.map((tool) =>
      element("a", {
        className: "tag-link",
        text: `${tool.name} · ${tool.highlight}`,
        attrs: {
          href: tool.path,
          "data-tool-slug": tool.slug,
          "data-tool-location": "creator-section",
        },
      }),
    ),
  );
}

function createToolCard(tool, categoriesBySlug, location, index) {
  const card = element("a", {
    className: "tool-card reveal",
    attrs: {
      href: tool.path,
      "data-tool-slug": tool.slug,
      "data-tool-location": location,
      "data-categories": Array.isArray(tool.categories) ? tool.categories.join(" ") : "",
      style: `animation-delay: ${index * 70}ms`,
    },
  });

  const heading = element("div", { className: "tool-card__heading" });
  const badgeRow = element("div", { className: "tool-card__badges" });
  badgeRow.append(
    createBadge(tool.highlight || tool.statusLabel || "Featured", "accent"),
    createBadge(tool.kind || "Tool", "soft"),
  );

  heading.append(
    badgeRow,
    element("h3", { className: "tool-card__title", text: tool.name }),
    element("p", { className: "tool-card__description", text: tool.description }),
  );

  const footer = element("div", { className: "tool-card__footer" });
  const tags = element("div", { className: "tool-card__tags" });

  (tool.categories || []).forEach((categorySlug) => {
    const category = categoriesBySlug[categorySlug];
    if (category) {
      tags.append(createBadge(category.name, "outline"));
    }
  });

  footer.append(tags, element("span", { className: "tool-card__cta", text: "Open tool" }));
  card.append(heading, footer);
  return card;
}

function createBadge(text, tone) {
  const className = tone ? `badge badge--${tone}` : "badge";
  return element("span", { className, text });
}

function indexBySlug(items) {
  return Object.fromEntries(items.map((item) => [item.slug, item]));
}

function sortTools(tools) {
  return [...tools].sort((left, right) => {
    const leftRank = Number(left.featuredRank || 999);
    const rightRank = Number(right.featuredRank || 999);
    return leftRank - rightRank;
  });
}

function initAnalytics(manifest, view) {
  if (!window.PugtoolsAnalytics) {
    return;
  }

  window.PugtoolsAnalytics.initPage({
    page: window.location.pathname,
    title: document.title,
  });
  window.PugtoolsAnalytics.bindOutboundLinks(document);

  if (view === "home" && window.PugtoolsAnalytics.trackHomepageView) {
    window.PugtoolsAnalytics.trackHomepageView({
      page: window.location.pathname,
      tool_count: (manifest.tools || []).length,
      category_count: (manifest.categories || []).length,
    });
  }
}

function bindAnalyticsInteractions() {
  document.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target || !window.PugtoolsAnalytics) {
      return;
    }

    const cta = target.closest("[data-analytics-cta]");
    if (cta && window.PugtoolsAnalytics.trackCtaClick) {
      window.PugtoolsAnalytics.trackCtaClick(cta.getAttribute("data-analytics-cta") || "cta", {
        location: cta.getAttribute("data-analytics-location") || "unknown",
        destination: cta.getAttribute("href") || undefined,
        page: window.location.pathname,
      });
    }

    const toolLink = target.closest("[data-tool-slug]");
    if (toolLink && window.PugtoolsAnalytics.trackToolCardClick) {
      window.PugtoolsAnalytics.trackToolCardClick(toolLink.getAttribute("data-tool-slug") || "unknown", {
        location: toolLink.getAttribute("data-tool-location") || "unknown",
        page: window.location.pathname,
        destination: toolLink.getAttribute("href") || undefined,
      });
    }
  });
}

function enhanceMetadata(manifest) {
  const canonical = document.querySelector('link[rel="canonical"]');
  const ogUrl = document.querySelector('meta[property="og:url"]');
  const currentPath = window.location.pathname;
  const resolvedUrl = resolvePublicUrl(currentPath);

  if (canonical) {
    canonical.setAttribute("href", resolvedUrl || currentPath);
  }

  if (ogUrl) {
    ogUrl.setAttribute("content", resolvedUrl || currentPath);
  }

  const structuredDataScript = document.getElementById("structured-data");
  if (structuredDataScript) {
    structuredDataScript.textContent = JSON.stringify(createStructuredData(manifest, resolvedUrl), null, 2);
  }
}

function createStructuredData(manifest, pageUrl) {
  const homeUrl = resolvePublicUrl("/");
  const pageName = "pugtools homepage";
  const pageDescription = manifest.brand?.description || FALLBACK_MANIFEST.brand.description;
  const graph = [];

  const website = {
    "@type": "WebSite",
    name: manifest.brand?.name || FALLBACK_MANIFEST.brand.name,
    description: manifest.brand?.description || FALLBACK_MANIFEST.brand.description,
    inLanguage: "en",
  };

  if (homeUrl) {
    website.url = homeUrl;
  }

  graph.push(website);

  const collectionPage = {
    "@type": "CollectionPage",
    name: pageName,
    description: pageDescription,
    isPartOf: {
      "@type": "WebSite",
      name: manifest.brand?.name || FALLBACK_MANIFEST.brand.name,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: sortTools(manifest.tools || FALLBACK_MANIFEST.tools).map((tool, index) => {
        const listItem = {
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          description: tool.description,
        };

        const toolUrl = resolvePublicUrl(tool.path);
        if (toolUrl) {
          listItem.url = toolUrl;
        }

        return listItem;
      }),
    },
  };

  if (homeUrl) {
    collectionPage.isPartOf.url = homeUrl;
  }

  if (pageUrl) {
    collectionPage.url = pageUrl;
  }

  graph.push(collectionPage);

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

function resolvePublicUrl(pathname) {
  const origin = window.location.origin || "";
  if (!origin || origin.includes("127.0.0.1") || origin.includes("localhost")) {
    return null;
  }
  return new URL(pathname, origin).toString();
}

function element(tagName, options = {}, children = []) {
  const node = document.createElement(tagName);
  const list = Array.isArray(children) ? children.flat() : [children];

  if (options.className) {
    node.className = options.className;
  }

  if (options.text !== undefined) {
    node.textContent = options.text;
  }

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([name, value]) => {
      if (value !== undefined && value !== null) {
        node.setAttribute(name, String(value));
      }
    });
  }

  list.forEach((child) => {
    if (child === null || child === undefined) {
      return;
    }
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });

  return node;
}

document.addEventListener("DOMContentLoaded", () => {
  void bootstrapSite();
});
