"use strict";

const ORDERED_NOTES = [
  { file: "section1.md", title: "Section 1" },
  { file: "section2.md", title: "Section 2" }
];

const CALLOUT_TYPES = [
  "definition",
  "proposition",
  "lemma",
  "theorem",
  "remark",
  "corollary",
  "example"
];

const storagePrefix = window.COURSE_NOTES_STORAGE_PREFIX ||
  `course-notes:${window.location.pathname.replace(/\/index\.html$/, "/")}:`;
let bookmarkMemory = null;

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeMathHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

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

    return {
      type: "escapedDollar",
      raw: match[0]
    };
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

    return {
      type: "displayMath",
      raw: match[0],
      text: match[1].trim()
    };
  },
  renderer(token) {
    return `\\[\n${escapeMathHtml(token.text)}\n\\]\n`;
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

    return {
      type: "inlineMath",
      raw: match[0],
      text: match[1]
    };
  },
  renderer(token) {
    return `\\(${escapeMathHtml(token.text)}\\)`;
  }
};

function configureMarkdown() {
  if (!window.marked?.use || !window.marked?.parse) {
    throw new Error("The Markdown renderer did not load.");
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
}

function renderMarkdown(markdown) {
  return window.marked.parse(markdown);
}

function sectionMarkup(note, index, body) {
  const sectionNumber = index + 1;
  return [
    `<section id="sec-${sectionNumber}" class="note-section" data-sec="${sectionNumber}" data-file="${escapeHtml(note.file)}">`,
    `<h1>${escapeHtml(note.title)}</h1>`,
    body,
    "</section>"
  ].join("");
}

async function loadNote(note, index) {
  try {
    const notePath = note.file.split("/").map(encodeURIComponent).join("/");
    const response = await fetch(`notes/${notePath}`);
    if (!response.ok) {
      return sectionMarkup(
        note,
        index,
        `<blockquote class="load-error">⚠️ Could not load ${escapeHtml(note.file)}.</blockquote>`
      );
    }

    return sectionMarkup(note, index, renderMarkdown(await response.text()));
  } catch (error) {
    return sectionMarkup(
      note,
      index,
      `<blockquote class="load-error">⚠️ Could not load ${escapeHtml(note.file)}.</blockquote>`
    );
  }
}

async function loadAll() {
  const content = byId("content");
  const parts = await Promise.all(ORDERED_NOTES.map(loadNote));
  content.innerHTML = parts.join("\n");

  buildToc();
  autoNumberCallouts();
  addBookmarkButtons();

  if (window.MathJax?.typesetPromise) {
    try {
      await window.MathJax.typesetPromise([content]);
    } catch (error) {
      console.error("MathJax could not typeset the notes.", error);
    }
  }
}

function buildToc() {
  const toc = byId("toc");
  const content = byId("content");
  const list = document.createElement("div");
  list.className = "toc-list";

  content.querySelectorAll(".note-section > h1").forEach((heading) => {
    const link = document.createElement("a");
    link.href = `#${heading.parentElement.id}`;
    link.textContent = heading.textContent;
    list.appendChild(link);
  });

  toc.replaceChildren(list);
}

function stripCalloutType(label, type) {
  const walker = document.createTreeWalker(label, NodeFilter.SHOW_TEXT);
  const pattern = new RegExp(`^\\s*${type}\\s*:?[ \\t]*`, "i");
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

function autoNumberCallouts() {
  byId("content").querySelectorAll(".note-section").forEach((section) => {
    const sectionNumber = section.dataset.sec || "0";
    const counters = Object.fromEntries(CALLOUT_TYPES.map((type) => [type, 0]));

    section.querySelectorAll(".callout").forEach((callout) => {
      const type = CALLOUT_TYPES.find((candidate) => callout.classList.contains(candidate));
      if (!type) return;

      counters[type] += 1;
      const number = `${sectionNumber}.${counters[type]}`;
      if (!callout.id) callout.id = `${type}-${sectionNumber}-${counters[type]}`;

      const label = callout.querySelector(":scope > .label");
      if (!label || label.dataset.numbered === "true") return;

      const title = label.cloneNode(true);
      title.querySelectorAll(".bookmark-btn").forEach((button) => button.remove());
      stripCalloutType(title, type);

      const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
      const typeSpan = document.createElement("span");
      typeSpan.className = "callout-type";
      typeSpan.textContent = typeLabel;

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

      label.dataset.numbered = "true";
    });
  });
}

function safeRead(key) {
  try {
    return localStorage.getItem(`${storagePrefix}${key}`);
  } catch (error) {
    return null;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(`${storagePrefix}${key}`, value);
  } catch (error) {
    // The site still works when storage is disabled.
  }
}

function getTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(theme, button, persist = false) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = nextTheme;

  if (persist) safeWrite("theme", nextTheme);
  if (!button) return;

  const isDark = nextTheme === "dark";
  button.textContent = isDark ? "🌙" : "☀️";
  button.setAttribute("aria-pressed", String(isDark));
  button.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
  button.title = `Switch to ${isDark ? "light" : "dark"} mode`;
}

function setupTheme() {
  const button = byId("themeToggle");
  if (!button) return;

  applyTheme(getTheme(), button);
  button.addEventListener("click", () => {
    applyTheme(getTheme() === "dark" ? "light" : "dark", button, true);
  });
}

function normalizeText(element, selectorToExclude = ".bookmark-btn") {
  const clone = element.cloneNode(true);
  clone.querySelectorAll(selectorToExclude).forEach((node) => node.remove());
  return clone.textContent.trim().replace(/\s+/g, " ");
}

function textHash(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function stableBookmarkId(element) {
  const section = element.closest(".note-section");
  const file = section?.dataset.file || "notes";
  const base = `bookmark-${file.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}-${textHash(normalizeText(element))}`;
  let id = base;
  let suffix = 2;

  while (document.getElementById(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  return id;
}

function getBookmarks() {
  if (bookmarkMemory !== null) return [...bookmarkMemory];

  const raw = safeRead("bookmarks");
  if (!raw) {
    bookmarkMemory = [];
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    bookmarkMemory = Array.isArray(parsed)
      ? [...new Set(parsed.filter((id) => typeof id === "string"))]
      : [];
  } catch (error) {
    bookmarkMemory = [];
  }
  return [...bookmarkMemory];
}

function saveBookmarks(bookmarks) {
  bookmarkMemory = [...new Set(bookmarks)];
  safeWrite("bookmarks", JSON.stringify(bookmarkMemory));
}

function toggleBookmark(id) {
  const bookmarks = getBookmarks();
  const index = bookmarks.indexOf(id);
  if (index >= 0) bookmarks.splice(index, 1);
  else bookmarks.push(id);
  saveBookmarks(bookmarks);
  renderBookmarks();
}

function removeBookmark(id) {
  saveBookmarks(getBookmarks().filter((bookmark) => bookmark !== id));
  renderBookmarks();
}

function addBookmarkButtons() {
  document.querySelectorAll("#content .bookmark-btn").forEach((button) => button.remove());

  const blocks = Array.from(document.querySelectorAll("#content .callout, #content p"))
    .filter((element) => element.classList.contains("callout") || !element.closest(".callout"));

  blocks.forEach((element) => {
    element.classList.add("bookmarkable");
    if (!element.id) element.id = stableBookmarkId(element);

    const container = element.classList.contains("callout")
      ? element.querySelector(":scope > .label") || element
      : element;
    const plainText = normalizeText(container);
    element.dataset.plain = plainText;
    container.dataset.plain = plainText;

    const button = document.createElement("button");
    button.className = "bookmark-btn";
    button.type = "button";
    button.title = "Toggle bookmark";
    button.setAttribute("aria-label", "Toggle bookmark");
    button.setAttribute("aria-pressed", "false");
    button.textContent = "🔖";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleBookmark(element.id);
    });
    container.appendChild(button);
  });

  renderBookmarks();
}

function findNearestHeading(element) {
  const section = element.closest(".note-section");
  if (!section) return null;

  let nearest = null;
  section.querySelectorAll("h1, h2, h3").forEach((heading) => {
    if (heading === element || heading.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING) {
      nearest = heading;
    }
  });
  return nearest;
}

function headingNumber(heading, counters) {
  if (heading.tagName === "H1") {
    counters.h1 += 1;
    counters.h2 = 0;
    counters.h3 = 0;
    return `${counters.h1}. `;
  }
  if (heading.tagName === "H2") {
    counters.h2 += 1;
    counters.h3 = 0;
    return `${counters.h1}.${counters.h2} `;
  }

  counters.h3 += 1;
  return `${counters.h1}.${counters.h2}.${counters.h3} `;
}

function renderBookmarks() {
  const panelList = byId("bookmarkList");
  if (!panelList) return;

  const stored = getBookmarks();
  const content = byId("content");
  const bookmarks = stored.filter((id) => {
    const element = byId(id);
    return element && content.contains(element) && element.classList.contains("bookmarkable");
  });
  if (bookmarks.length !== stored.length) saveBookmarks(bookmarks);

  document.querySelectorAll("#content .bookmarkable").forEach((element) => {
    const isBookmarked = bookmarks.includes(element.id);
    element.classList.toggle("bookmarked", isBookmarked);
    element.querySelector(":scope > .bookmark-btn, :scope > .label > .bookmark-btn")
      ?.setAttribute("aria-pressed", String(isBookmarked));
  });

  const headings = Array.from(document.querySelectorAll("#content h1, #content h2, #content h3"));
  headings.forEach((heading) => {
    if (!heading.dataset.plain) heading.dataset.plain = normalizeText(heading);
  });
  const bookmarksByHeading = new Map(headings.map((heading) => [heading, []]));
  bookmarks.forEach((id) => {
    const element = byId(id);
    const heading = findNearestHeading(element) || headings[0];
    if (!heading) return;
    if (!bookmarksByHeading.has(heading)) bookmarksByHeading.set(heading, []);
    bookmarksByHeading.get(heading).push(element);
  });

  const counters = { h1: 0, h2: 0, h3: 0 };
  const fragment = document.createDocumentFragment();

  headings.forEach((heading) => {
    const item = document.createElement("li");
    item.className = `heading-item level-${heading.tagName.slice(1)}`;

    const title = document.createElement("strong");
    title.textContent = `${headingNumber(heading, counters)}${heading.dataset.plain || "(Untitled)"}`;
    item.appendChild(title);

    const childBookmarks = bookmarksByHeading.get(heading) || [];
    if (childBookmarks.length) {
      const list = document.createElement("ul");
      list.className = "heading-bookmark-list";

      childBookmarks.forEach((bookmarkedElement) => {
        const bookmarkItem = document.createElement("li");
        bookmarkItem.className = "bookmark-item";

        const link = document.createElement("a");
        link.href = `#${bookmarkedElement.id}`;
        link.textContent = bookmarkedElement.dataset.plain || normalizeText(bookmarkedElement);
        link.addEventListener("click", (event) => {
          event.preventDefault();
          bookmarkedElement.scrollIntoView({ behavior: "smooth", block: "start" });
        });

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "bookmark-remove";
        removeButton.title = "Remove bookmark";
        removeButton.setAttribute("aria-label", "Remove bookmark");
        removeButton.textContent = "🔖";
        removeButton.addEventListener("click", () => removeBookmark(bookmarkedElement.id));

        bookmarkItem.append(link, removeButton);
        list.appendChild(bookmarkItem);
      });

      item.appendChild(list);
    }

    fragment.appendChild(item);
  });

  panelList.replaceChildren(fragment);
}

function setBookmarkPanelOpen(open) {
  const button = byId("toggleBookmarks");
  const panel = byId("bookmarkPanel");
  if (!button || !panel) return;

  panel.hidden = !open;
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", `${open ? "Hide" : "Show"} bookmarks`);
  button.title = `${open ? "Hide" : "Show"} bookmarks`;
}

function setupBookmarkPanel() {
  const button = byId("toggleBookmarks");
  if (!button) return;

  button.addEventListener("click", () => {
    setBookmarkPanelOpen(button.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setBookmarkPanelOpen(false);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  setupTheme();
  setupBookmarkPanel();

  try {
    configureMarkdown();
    await loadAll();
  } catch (error) {
    console.error(error);
    byId("content").innerHTML = '<blockquote class="load-error">⚠️ The notes could not be rendered. Reload the page or check the browser console.</blockquote>';
  }
});
