"use strict";

const ORDERED_NOTES = [
  { file: "session1.md", title: "Session 1" },
  { file: "session2.md", title: "Session 2" }
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

  wrapCollapsibleContent();
  buildToc();
  autoNumberCallouts();

  if (window.MathJax?.typesetPromise) {
    try {
      await window.MathJax.typesetPromise([content]);
    } catch (error) {
      console.error("MathJax could not typeset the notes.", error);
    }
  }
}

function wrapCollapsibleContent() {
  byId("content").querySelectorAll(".collapsible").forEach((details) => {
    if (details.querySelector(":scope > .collapsible__content")) return;

    const summary = details.querySelector(":scope > summary");
    const wrapper = document.createElement("div");
    wrapper.className = "collapsible__content";

    [...details.childNodes]
      .filter((node) => node !== summary)
      .forEach((node) => wrapper.appendChild(node));

    details.appendChild(wrapper);
  });
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

document.addEventListener("DOMContentLoaded", async () => {
  setupTheme();

  try {
    configureMarkdown();
    await loadAll();
  } catch (error) {
    console.error(error);
    byId("content").innerHTML = '<blockquote class="load-error">⚠️ The notes could not be rendered. Reload the page or check the browser console.</blockquote>';
  }
});
