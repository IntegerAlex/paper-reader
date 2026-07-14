const WORKER_CODE = `
self.onmessage = async (e) => {
  const { type, payload } = e.data;

  if (type === "search") {
    const { query, pages, pdfData } = payload;

    if (!query || !pages || pages.length === 0) {
      self.postMessage({ type: "search-result", results: [] });
      return;
    }

    const results = [];
    const lowerQuery = query.toLowerCase();

    try {
      importScripts("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.9.155/build/pdf.min.js");

      const doc = await self.pdfjsLib.getDocument({ data: pdfData }).promise;

      for (const pageNum of pages) {
        try {
          const page = await doc.getPage(pageNum);
          const textContent = await page.getTextContent();
          const fullText = textContent.items.map((item) => item.str).join(" ");

          let startIndex = 0;
          const lowerText = fullText.toLowerCase();

          while ((startIndex = lowerText.indexOf(lowerQuery, startIndex)) !== -1) {
            results.push({ page: pageNum, index: startIndex });
            startIndex += lowerQuery.length;
          }
        } catch {
          // Skip failed pages
        }

        self.postMessage({ type: "search-progress", page: pageNum, total: pages.length });
      }

      doc.destroy();
    } catch (err) {
      self.postMessage({ type: "search-error", error: err?.message || "Worker load failed" });
    }

    self.postMessage({ type: "search-result", results });
  }
};
`;

let workerInstance: Worker | null = null;

function getSearchWorker(): Worker {
  if (!workerInstance) {
    const blob = new Blob([WORKER_CODE], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    workerInstance = new Worker(url);
  }
  return workerInstance;
}

export function searchInWorker(
  query: string,
  pdfData: ArrayBuffer,
  pages: number[]
): Promise<{ page: number; index: number }[]> {
  return new Promise((resolve) => {
    const worker = getSearchWorker();
    const timeout = setTimeout(() => resolve([]), 30000);

    const handler = (e: MessageEvent) => {
      if (e.data.type === "search-result") {
        clearTimeout(timeout);
        worker.removeEventListener("message", handler);
        resolve(e.data.results);
      }
    };

    worker.addEventListener("message", handler);

    const buffer = pdfData.slice(0);
    worker.postMessage(
      { type: "search", payload: { query, pdfData: buffer, pages } },
      [buffer]
    );
  });
}

export function terminateSearchWorker() {
  if (workerInstance) {
    workerInstance.terminate();
    workerInstance = null;
  }
}
