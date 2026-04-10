import "./style.css";
import { marked } from "marked";
import hljs from "highlight.js";
import html2pdf from "html2pdf.js";

marked.setOptions({
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true,
});

const STORAGE_KEY = "markdown-editor-content";

const editor = document.getElementById("editor");
const preview = document.getElementById("preview");
const saveStatus = document.getElementById("save-status");
const charCount = document.getElementById("char-count");

const savedContent = localStorage.getItem(STORAGE_KEY);
if (savedContent) {
  editor.value = savedContent;
  renderPreview();
  updateCharCount();
}

let saveTimer = null;

function renderPreview() {
  const markdown = editor.value;
  preview.innerHTML = marked.parse(markdown);
  preview.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
}

function updateCharCount() {
  const count = editor.value.length;
  charCount.textContent = `${count} character${count !== 1 ? "s" : ""}`;
}

function saveContent() {
  clearTimeout(saveTimer);
  saveStatus.textContent = "Saving...";

  saveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, editor.value);
    saveStatus.textContent = "Saved";
    setTimeout(() => {
      saveStatus.textContent = "Saved";
    }, 1500);
  }, 300);
}

editor.addEventListener("input", () => {
  renderPreview();
  updateCharCount();
  saveContent();
});

editor.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    e.preventDefault();
    const start = editor.selectionStart;
    const end = editor.selectionEnd;

    editor.value =
      editor.value.substring(0, start) + "  " + editor.value.substring(end);
    editor.selectionStart = editor.selectionEnd = start + 2;

    renderPreview();
    saveContent();
  }
});

const exportBtn = document.getElementById("export-pdf");

exportBtn.addEventListener("click", async () => {
  const element = preview.cloneNode(true);
  element.style.cssText = `
    padding: 40px;
    max-width: none;
    background: #ffffff;
    color: #1e1e1e;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
  `;

  element.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
    h.style.color = "#111111";
    h.style.borderBottom = "1px solid #e5e5e5";
    h.style.paddingBottom = "0.2em";
    h.style.marginTop = "1.5em";
    h.style.marginBottom = "0.5em";
  });

  element.querySelectorAll("h1").forEach((h) => {
    h.style.fontSize = "1.8em";
  });
  element.querySelectorAll("h2").forEach((h) => {
    h.style.fontSize = "1.5em";
  });
  element.querySelectorAll("h3").forEach((h) => {
    h.style.fontSize = "1.25em";
  });

  element.querySelectorAll("pre").forEach((pre) => {
    pre.style.cssText = `
      background: #f5f5f5;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 12px;
      overflow-x: auto;
      font-size: 9pt;
      line-height: 1.5;
      page-break-inside: avoid;
    `;
    pre.querySelector("code").style.cssText = `
      background: transparent;
      color: #333333;
      font-size: inherit;
      padding: 0;
    `;
  });

  element.querySelectorAll("code").forEach((code) => {
    if (!code.closest("pre")) {
      code.style.cssText = `
        background: #f0f0f0;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.9em;
        color: #c7254e;
      `;
    }
  });

  element.querySelectorAll("table").forEach((table) => {
    table.style.cssText = `
      width: 100%;
      border-collapse: collapse;
      margin: 1em 0;
      font-size: 10pt;
      page-break-inside: avoid;
    `;
    table.querySelectorAll("th, td").forEach((cell) => {
      cell.style.cssText = `
        border: 1px solid #d0d0d0;
        padding: 8px 12px;
        text-align: left;
      `;
    });
    table.querySelectorAll("th").forEach((th) => {
      th.style.background = "#f5f5f5";
      th.style.fontWeight = "600";
    });
  });

  element.querySelectorAll("blockquote").forEach((bq) => {
    bq.style.cssText = `
      margin: 1em 0;
      padding: 0.5em 1em;
      border-left: 4px solid #6366f1;
      background: #f9f9f9;
      color: #555555;
    `;
  });

  element.querySelectorAll("img").forEach((img) => {
    img.style.maxWidth = "100%";
    img.style.height = "auto";
    img.style.borderRadius = "4px";
  });

  element.querySelectorAll("a").forEach((a) => {
    a.style.color = "#6366f1";
    a.style.textDecoration = "none";
  });

  const opt = {
    margin: 15,
    filename: "document.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: {
      mode: "avoid-all",
      before: ".page-break-before",
      after: ".page-break-after",
    },
  };

  exportBtn.disabled = true;
  exportBtn.textContent = "Exporting...";

  await html2pdf().set(opt).from(element).save();

  exportBtn.disabled = false;
  exportBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="12" y1="18" x2="12" y2="12"/>
    <polyline points="9 15 12 18 15 15"/>
  </svg> Export PDF`;
});

renderPreview();
