(function () {
  "use strict";

  const vscode = acquireVsCodeApi();
  const CALLOUT_TYPES = [
    "definition",
    "proposition",
    "lemma",
    "theorem",
    "remark",
    "corollary",
    "example"
  ];
  const BLOCK_RENDERERS = [
    "blockquote",
    "code",
    "heading",
    "hr",
    "html",
    "list",
    "paragraph",
    "table"
  ];

  let current = {
    uri: "",
    version: -1,
    markdown: "",
    cssText: "",
    sectionNumber: 1,
    autoNumberCallouts: true,
    openCollapsedProofs: false
  };
  let pendingRender;
  let rendering = false;
  let markdownConfigured = false;
  let scrollSaveTimer;
  let highlightTimer;

  const content = document.getElementById("content");
  const status = document.getElementById("preview-status");
  const workspaceStyle = document.getElementById("workspace-style");

  const escapedDollarExtension = {
    name: "escapedDollar",
    level: "inline",
    start(source) {
      const index = source.indexOf("\\$");
      return index < 0 ? undefined : index;
    },
    tokenizer(source) {
      const match = /^\\\$/.exec(source);
      if (!match) return undefined;
      return { type: "escapedDollar", raw: match[0] };
    },
    renderer() {
      return '<span class="tex2jax_ignore">$</span>';
    }
  };

  const displayMathExtension = {
    name: "displayMath",
    level: "block",
    start(source) {
      const match = /(^|\n)\$\$(?!\$)/.exec(source);
      if (!match) return undefined;
      return match.index + (match[1] ? 1 : 0);
    },
    tokenizer(source) {
      const match = /^\$\$[ \t]*\n([\s\S]*?)\n\$\$[ \t]*(?:\n|$)/.exec(source);
      if (!match || !match[1].trim()) return undefined;
      return { type: "displayMath", raw: match[0], text: match[1].trim() };
    },
    renderer(token) {
      const attributes = sourceAttributes(token);
      return `<div class="math-source-block"${attributes}>\\[\n${escapeMathHtml(token.text)}\n\\]</div>\n`;
    }
  };

  const inlineMathExtension = {
    name: "inlineMath",
    level: "inline",
    start(source) {
      const index = source.search(/\$(?!\$)/);
      return index < 0 ? undefined : index;
    },
    tokenizer(source) {
      const match = /^\$(?!\$|\s)((?:\\.|[^\\$\n])+?)\$(?!\$)/.exec(source);
      if (!match || /\s$/.test(match[1])) return undefined;
      return { type: "inlineMath", raw: match[0], text: match[1] };
    },
    renderer(token) {
      return `\\(${escapeMathHtml(token.text)}\\)`;
    }
  };

  function configureMarkdown() {
    if (markdownConfigured) return;
    if (!window.marked?.use || !window.marked?.lexer || !window.marked?.parser) {
      throw new Error("The Markdown renderer did not load. Check your internet connection and reload the preview.");
    }

    window.marked.use({
      gfm: true,
      breaks: false,
      extensions: [
        escapedDollarExtension,
        displayMathExtension,
        inlineMathExtension
      ]
    });
    markdownConfigured = true;
  }

  function renderMarkdown(markdown) {
    configureMarkdown();
    const source = String(markdown || "").replace(/\r\n?/g, "\n");
    const renderer = createSourceRenderer();
    const options = {
      ...window.marked.defaults,
      gfm: true,
      breaks: false,
      renderer
    };
    const tokens = window.marked.lexer(source, options);
    assignSourcePositions(tokens);
    return window.marked.parser(tokens, options);
  }

  function createSourceRenderer() {
    const renderer = new window.marked.Renderer();

    BLOCK_RENDERERS.forEach((method) => {
      const original = renderer[method];
      renderer[method] = function (token) {
        const html = original.call(this, token);
        return annotateFirstTag(html, token);
      };
    });

    return renderer;
  }

  function assignSourcePositions(tokens) {
    let line = 0;

    tokens.forEach((token) => {
      const raw = typeof token.raw === "string" ? token.raw : "";
      const lineCount = countNewlines(raw);
      token.sourceLine = line;
      token.sourceEndLine = line + lineCount;
      token.sourceKey = `${token.type}-${hashText(normalizeKeyText(raw))}`;
      line += lineCount;
    });
  }

  function annotateFirstTag(html, token) {
    if (!html || !Number.isInteger(token.sourceLine)) return html;
    if (/^\s*<\//.test(html)) return html;
    const attributes = sourceAttributes(token);
    return html.replace(/^(\s*<[A-Za-z][^\s/>]*)/, `$1${attributes}`);
  }

  function sourceAttributes(token) {
    if (!Number.isInteger(token.sourceLine)) return "";
    return ` data-source-line="${token.sourceLine}" data-source-end-line="${token.sourceEndLine}" data-source-key="${escapeAttribute(token.sourceKey)}"`;
  }

  function countNewlines(value) {
    return (value.match(/\n/g) || []).length;
  }

  function normalizeKeyText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function hashText(value) {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(36);
  }

  function escapeAttribute(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function escapeMathHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function queueRender(message) {
    if (!isRenderMessage(message)) return;
    if (message.uri === current.uri && message.version < current.version) return;
    pendingRender = message;
    if (!rendering) void drainRenderQueue();
  }

  async function drainRenderQueue() {
    rendering = true;
    while (pendingRender) {
      const message = pendingRender;
      pendingRender = undefined;
      await render(message);
    }
    rendering = false;
  }

  async function render(message) {
    const previousAnchor = current.version >= 0
      ? captureViewportAnchor()
      : savedAnchorFor(message.uri);
    const detailStates = captureDetailStates();

    current = {
      uri: message.uri,
      version: message.version,
      markdown: message.markdown,
      cssText: message.cssText || "",
      sectionNumber: positiveInteger(message.sectionNumber, 1),
      autoNumberCallouts: message.autoNumberCallouts !== false,
      openCollapsedProofs: message.openCollapsedProofs === true
    };

    content.setAttribute("aria-busy", "true");
    showStatus("Updating preview…", false);
    workspaceStyle.textContent = current.cssText;

    try {
      clearMathTypesetting();
      const html = renderMarkdown(current.markdown);
      content.innerHTML = `<section class="note-section" data-sec="${current.sectionNumber}">${html}</section>`;

      if (current.autoNumberCallouts) autoNumberCallouts();
      restoreDetailStates(detailStates);
      await typesetMath();
      hideStatus();
      restoreViewportAnchor(previousAnchor);
      persistState();
    } catch (error) {
      console.error(error);
      content.replaceChildren();
      showStatus(`Preview failed: ${error.message || error}`, true);
    }
  }

  function clearMathTypesetting() {
    if (window.MathJax && typeof window.MathJax.typesetClear === "function") {
      try {
        window.MathJax.typesetClear([content]);
      } catch (_error) {
        // The old preview may not have completed its first MathJax pass.
      }
    }
  }

  async function typesetMath() {
    if (!window.MathJax) return;
    if (window.MathJax.startup?.promise) await window.MathJax.startup.promise;
    if (typeof window.MathJax.typesetPromise === "function") {
      await window.MathJax.typesetPromise([content]);
    }
  }

  function autoNumberCallouts() {
    const counters = Object.fromEntries(CALLOUT_TYPES.map((type) => [type, 0]));

    content.querySelectorAll(".callout").forEach((callout) => {
      const type = CALLOUT_TYPES.find((candidate) => callout.classList.contains(candidate));
      if (!type) return;

      counters[type] += 1;
      const number = `${current.sectionNumber}.${counters[type]}`;
      if (!callout.id) callout.id = `${type}-${current.sectionNumber}-${counters[type]}`;

      const label = callout.querySelector(":scope > .label");
      if (!label) return;

      const title = label.cloneNode(true);
      stripCalloutType(title, type);

      const typeSpan = document.createElement("span");
      typeSpan.className = "callout-type";
      typeSpan.textContent = type.charAt(0).toUpperCase() + type.slice(1);

      const numberSpan = document.createElement("span");
      numberSpan.className = "callout-num";
      numberSpan.textContent = number;

      label.replaceChildren(typeSpan, " ", numberSpan);
      if (title.textContent.trim() || title.querySelector("*")) {
        const titleSpan = document.createElement("span");
        titleSpan.className = "callout-title";
        titleSpan.append(": ");
        while (title.firstChild) titleSpan.appendChild(title.firstChild);
        label.appendChild(titleSpan);
      }
    });
  }

  function stripCalloutType(label, type) {
    const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
    const pattern = new RegExp(`^\\s*${type}\\s*:?\\s*`, "i");
    let node = walker.nextNode();

    while (node) {
      if (node.textContent.trim()) {
        node.textContent = node.textContent.replace(pattern, "");
        break;
      }
      node = walker.nextNode();
    }

    while (label.firstChild?.nodeType === Node.TEXT_NODE && !label.firstChild.textContent.trim()) {
      label.firstChild.remove();
    }
  }

  function captureDetailStates() {
    const states = new Map();
    content.querySelectorAll("details[data-source-key]").forEach((detail) => {
      const key = detail.dataset.sourceKey;
      if (!states.has(key)) states.set(key, []);
      states.get(key).push(detail.open);
    });
    return states;
  }

  function restoreDetailStates(states) {
    const used = new Map();
    content.querySelectorAll("details").forEach((detail) => {
      const key = detail.dataset.sourceKey;
      const index = used.get(key) || 0;
      const saved = key ? states.get(key)?.[index] : undefined;
      used.set(key, index + 1);
      detail.open = typeof saved === "boolean" ? saved : current.openCollapsedProofs;
    });
  }

  function captureViewportAnchor() {
    const nodes = mappedElements();
    if (!nodes.length) return fallbackScrollAnchor();

    const targetY = Math.min(48, Math.max(1, window.innerHeight - 1));
    let anchor = document.elementFromPoint(Math.max(1, window.innerWidth / 2), targetY)?.closest?.("[data-source-line]");

    if (!anchor || !content.contains(anchor)) {
      anchor = nodes.find((node) => node.getBoundingClientRect().bottom >= targetY) || nodes[nodes.length - 1];
    }

    const rectangle = anchor.getBoundingClientRect();
    return {
      key: anchor.dataset.sourceKey || "",
      line: numberFromDataset(anchor.dataset.sourceLine),
      offset: rectangle.top,
      ratio: scrollRatio()
    };
  }

  function fallbackScrollAnchor() {
    return { key: "", line: 0, offset: 0, ratio: scrollRatio() };
  }

  function restoreViewportAnchor(anchor) {
    if (!anchor) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let target = findByStableKey(anchor.key, anchor.line);
        if (!target) target = nearestMappedElement(anchor.line);

        if (target) {
          window.scrollBy(0, target.getBoundingClientRect().top - anchor.offset);
        } else {
          const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
          window.scrollTo(0, maximum * clamp(anchor.ratio, 0, 1));
        }
      });
    });
  }

  function findByStableKey(key, oldLine) {
    if (!key) return undefined;
    const matches = mappedElements().filter((node) => node.dataset.sourceKey === key);
    if (!matches.length) return undefined;
    return matches.sort((left, right) => (
      Math.abs(numberFromDataset(left.dataset.sourceLine) - oldLine) -
      Math.abs(numberFromDataset(right.dataset.sourceLine) - oldLine)
    ))[0];
  }

  function savedAnchorFor(uri) {
    const state = vscode.getState();
    if (!state || state.uri !== uri) return undefined;
    if (state.anchor && typeof state.anchor === "object") return state.anchor;
    if (Number.isFinite(state.scrollY)) {
      return { key: "", line: 0, offset: 0, ratio: Number(state.scrollRatio) || 0 };
    }
    return undefined;
  }

  function persistState() {
    const anchor = captureViewportAnchor();
    vscode.setState({
      uri: current.uri,
      version: current.version,
      scrollY: window.scrollY,
      scrollRatio: scrollRatio(),
      anchor
    });
  }

  function scrollRatio() {
    const maximum = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return maximum ? window.scrollY / maximum : 0;
  }

  function handlePreviewDoubleClick(event) {
    const element = event.target instanceof Element ? event.target : event.target?.parentElement;
    const mapped = element?.closest?.("[data-source-line]");
    if (!mapped || !content.contains(mapped)) return;

    const selection = window.getSelection();
    let word = selection ? selection.toString().trim() : "";
    if (word.length > 160 || /[\r\n]/.test(word)) word = "";

    vscode.postMessage({
      type: "revealSource",
      uri: current.uri,
      version: current.version,
      line: numberFromDataset(mapped.dataset.sourceLine),
      word
    });
  }

  function handleContentLinkClick(event) {
  const anchor = event.target.closest("a[href]");
  if (!anchor || !content.contains(anchor)) return;

  const rawHref = anchor.getAttribute("href");
  if (!rawHref || rawHref.startsWith("#")) return; // let in-page anchors behave normally

  event.preventDefault();
  vscode.postMessage({ type: "openLink", href: rawHref });
}

  function revealPreview(message) {
    if (!isRevealMessage(message)) return;
    if (message.uri !== current.uri || message.version !== current.version) return;

    const line = Math.max(0, Math.floor(message.line));
    const word = typeof message.word === "string" ? message.word.trim() : "";
    const target = bestMappedElement(line, word);
    if (!target) return;

    target.closest("details:not([open])")?.setAttribute("open", "");
    let parent = target.parentElement?.closest("details:not([open])");
    while (parent) {
      parent.open = true;
      parent = parent.parentElement?.closest("details:not([open])");
    }

    target.scrollIntoView({ block: "center", behavior: "auto" });
    highlightMappedElement(target);
    selectTextWithin(target, word);
  }

  function bestMappedElement(line, word) {
    const nodes = mappedElements();
    if (!nodes.length) return undefined;

    const containing = nodes.filter((node) => {
      const start = numberFromDataset(node.dataset.sourceLine);
      const end = numberFromDataset(node.dataset.sourceEndLine, start);
      return start <= line && end >= line;
    });
    const pool = containing.length ? containing : nodes;
    const wordMatches = word
      ? pool.filter((node) => visibleText(node).toLocaleLowerCase().includes(word.toLocaleLowerCase()))
      : [];
    const candidates = wordMatches.length ? wordMatches : pool;

    return candidates.sort((left, right) => {
      const leftStart = numberFromDataset(left.dataset.sourceLine);
      const rightStart = numberFromDataset(right.dataset.sourceLine);
      const leftEnd = numberFromDataset(left.dataset.sourceEndLine, leftStart);
      const rightEnd = numberFromDataset(right.dataset.sourceEndLine, rightStart);
      const leftDistance = line < leftStart ? leftStart - line : line > leftEnd ? line - leftEnd : 0;
      const rightDistance = line < rightStart ? rightStart - line : line > rightEnd ? line - rightEnd : 0;
      if (leftDistance !== rightDistance) return leftDistance - rightDistance;
      return (leftEnd - leftStart) - (rightEnd - rightStart);
    })[0];
  }

  function nearestMappedElement(line) {
    return bestMappedElement(Number.isFinite(line) ? line : 0, "");
  }

  function mappedElements() {
    return Array.from(content.querySelectorAll("[data-source-line]"));
  }

  function visibleText(element) {
    return element.innerText || element.textContent || "";
  }

  function highlightMappedElement(element) {
    document.querySelectorAll(".source-sync-target").forEach((node) => node.classList.remove("source-sync-target"));
    if (highlightTimer) clearTimeout(highlightTimer);
    element.classList.add("source-sync-target");
    highlightTimer = setTimeout(() => element.classList.remove("source-sync-target"), 1400);
  }

  function selectTextWithin(element, word) {
    if (!word || /\s/.test(word)) return;
    const wanted = word.toLocaleLowerCase();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest("mjx-container, script, style")) return NodeFilter.FILTER_REJECT;
        return node.textContent.toLocaleLowerCase().includes(wanted)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP;
      }
    });
    const textNode = walker.nextNode();
    if (!textNode) return;

    const index = textNode.textContent.toLocaleLowerCase().indexOf(wanted);
    const range = document.createRange();
    range.setStart(textNode, index);
    range.setEnd(textNode, index + word.length);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  function showStatus(message, isError) {
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
    status.hidden = false;
  }

  function hideStatus() {
    content.setAttribute("aria-busy", "false");
    status.hidden = true;
    status.classList.remove("is-error");
  }

  function isRenderMessage(message) {
    return message &&
      message.type === "render" &&
      typeof message.uri === "string" &&
      Number.isInteger(message.version) &&
      typeof message.markdown === "string";
  }

  function isRevealMessage(message) {
    return message &&
      message.type === "revealPreview" &&
      typeof message.uri === "string" &&
      Number.isInteger(message.version) &&
      Number.isFinite(message.line);
  }

  function numberFromDataset(value, fallback = 0) {
    const number = Number.parseInt(value, 10);
    return Number.isFinite(number) ? number : fallback;
  }

  function positiveInteger(value, fallback) {
    return Number.isInteger(value) && value > 0 ? value : fallback;
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, Number(value) || 0));
  }

  window.addEventListener("message", (event) => {
    const message = event.data || {};
    if (message.type === "render") queueRender(message);
    if (message.type === "revealPreview") revealPreview(message);
  });

  window.addEventListener("scroll", () => {
    if (scrollSaveTimer) clearTimeout(scrollSaveTimer);
    scrollSaveTimer = setTimeout(persistState, 100);
  }, { passive: true });

  content.addEventListener("dblclick", handlePreviewDoubleClick);
  content.addEventListener("click", handleContentLinkClick);
  vscode.postMessage({ type: "ready" });
})();
