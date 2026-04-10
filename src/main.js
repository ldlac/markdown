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
  element.style.padding = "40px";
  element.style.maxWidth = "none";
  element.style.background = "#ffffff";

  const opt = {
    margin: 10,
    filename: "document.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
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
