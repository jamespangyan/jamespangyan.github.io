import * as pdfjs from "../vendor/pdfjs/pdf.min.mjs";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("../vendor/pdfjs/pdf.worker.min.mjs", import.meta.url).href;

const viewer = document.getElementById("cv-pdf-viewer");
const canvas = document.getElementById("cv-pdf-canvas");
const status = document.getElementById("cv-page-status");
const previous = document.getElementById("cv-previous");
const next = document.getElementById("cv-next");
const pageText = document.getElementById("cv-page-text");
let pdf;
let pageNumber = 1;
let rendering = false;
let resizePending = false;

async function renderPage() {
  if (!pdf) return;
  if (rendering) {
    resizePending = true;
    return;
  }
  rendering = true;
  previous.disabled = true;
  next.disabled = true;
  try {
    const page = await pdf.getPage(pageNumber);
    const original = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: Math.max(1, viewer.clientWidth - 2) / original.width });
    const pixelRatio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * pixelRatio);
    canvas.height = Math.floor(viewport.height * pixelRatio);
    canvas.style.height = `${viewport.height}px`;
    await page.render({
      canvasContext: canvas.getContext("2d"),
      viewport,
      transform: pixelRatio === 1 ? null : [pixelRatio, 0, 0, pixelRatio, 0, 0],
    }).promise;
    const text = await page.getTextContent();
    pageText.textContent = text.items.map(item => item.str).join(" ");
    status.textContent = `Page ${pageNumber} of ${pdf.numPages}`;
    previous.disabled = pageNumber === 1;
    next.disabled = pageNumber === pdf.numPages;
  } catch (error) {
    status.textContent = "Please use the PDF link above to view the CV.";
    console.error("Could not display CV page", error);
  } finally {
    rendering = false;
    if (resizePending) {
      resizePending = false;
      renderPage();
    }
  }
}

previous.addEventListener("click", () => {
  if (pageNumber > 1 && !rendering) {
    pageNumber -= 1;
    renderPage();
  }
});
next.addEventListener("click", () => {
  if (pdf && pageNumber < pdf.numPages && !rendering) {
    pageNumber += 1;
    renderPage();
  }
});
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderPage, 150);
});

try {
  pdf = await pdfjs.getDocument({ url: viewer.dataset.pdfUrl, useWasm: false }).promise;
  await renderPage();
} catch (error) {
  status.textContent = "Please use the PDF link above to view the CV.";
  console.error("Could not load CV PDF", error);
}
