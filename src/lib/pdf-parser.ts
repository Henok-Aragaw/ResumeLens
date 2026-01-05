export async function extractTextFromPdf(file: File): Promise<string> {
  if (typeof window === 'undefined') return '';

  try {
    const { getDocumentProxy, extractText } = await import('unpdf');
    const arrayBuffer = await file.arrayBuffer();
    
    // Load and parse
    const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
    const { text } = await extractText(pdf);

    return text.join('\n');
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("Failed to read PDF file.");
  }
}