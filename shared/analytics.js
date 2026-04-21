(function attachPugtoolsAnalytics(global) {
  const queue = [];
  const pageViewKeys = new Set();
  const noop = function () {};

  function track(name, detail) {
    const payload = {
      detail: detail || {},
      name,
      timestamp: new Date().toISOString(),
    };

    queue.push(payload);

    try {
      global.dispatchEvent(new CustomEvent("pugtools:analytics", { detail: payload }));
    } catch (_error) {
      // Ignore environments without CustomEvent support.
    }

    if (typeof global.plausible === "function") {
      try {
        global.plausible(name, { props: payload.detail });
      } catch (_error) {
        // Ignore provider failures so analytics never blocks UX.
      }
    }

    return payload;
  }

  function initPage(options) {
    const detail = options || {};
    const page = detail.page || global.location?.pathname || "/";
    const title = detail.title || global.document?.title || "";
    const key = [page, detail.tool || "", title].join("::");

    if (!pageViewKeys.has(key)) {
      pageViewKeys.add(key);
      track("page_view", { page, title, tool: detail.tool || undefined });
    }

    if (detail.tool) {
      track("tool_opened", { page, tool: detail.tool });
    }
  }

  function bindOutboundLinks(root) {
    const scope = root || global.document;
    if (!scope || !scope.querySelectorAll) {
      return noop;
    }

    const onClick = function (event) {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!link) {
        return;
      }

      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("/") || href.startsWith("#") || href.startsWith("http://127.0.0.1") || href.startsWith("http://localhost")) {
        return;
      }

      track("outbound_link_click", {
        href,
        label: (link.textContent || "").trim() || undefined,
      });
    };

    scope.addEventListener("click", onClick, { passive: true });
    return function unbind() {
      scope.removeEventListener("click", onClick);
    };
  }

  const api = {
    bindOutboundLinks,
    getQueue: function () {
      return queue.slice();
    },
    initPage,
    track,
    trackCopy: function (tool, detail) {
      return track("copy_result", Object.assign({ tool }, detail || {}));
    },
    trackDownload: function (tool, detail) {
      return track("download_export", Object.assign({ tool }, detail || {}));
    },
    trackCtaClick: function (cta, detail) {
      return track("cta_clicked", Object.assign({ cta }, detail || {}));
    },
    trackHomepageView: function (detail) {
      return track("homepage_viewed", detail || {});
    },
    trackOutbound: function (href, detail) {
      return track("outbound_link_click", Object.assign({ href }, detail || {}));
    },
    trackPageView: function (detail) {
      return track("page_view", detail || {});
    },
    trackToolCardClick: function (tool, detail) {
      return track("tool_card_clicked", Object.assign({ tool }, detail || {}));
    },
    trackToolOpen: function (tool, detail) {
      return track("tool_opened", Object.assign({ tool }, detail || {}));
    },
    trackToolUse: function (tool, detail) {
      return track("tool_used", Object.assign({ tool }, detail || {}));
    },
  };

  global.PugtoolsAnalytics = api;
}(window));
