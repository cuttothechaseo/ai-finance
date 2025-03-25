import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function parseFile(file: Buffer, fileType: string): Promise<string> {
  try {
    switch (fileType.toLowerCase()) {
      case 'application/pdf':
        const pdfData = await pdfParse(file);
        return pdfData.text;

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const { value: docxText } = await mammoth.extractRawText({ buffer: file });
        return docxText;

      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error('Failed to parse file');
  }
} 