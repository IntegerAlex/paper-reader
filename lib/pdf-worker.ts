import * as pdfjsLib from "pdfjs-dist";

// Set the worker source to the local copy in public/
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export { pdfjsLib };
