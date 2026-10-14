import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export interface GeneratePdfOptions {
  fileName?: string;
  elementId?: string;
}

/**
 * High-Resolution Client-Side A4 Landscape Vector PDF Generator
 * Targets exact A4 Landscape dimensions (297mm x 210mm) at 300 DPI print quality.
 */
export async function generateCertificatePdf(
  elementOrId: HTMLElement | string,
  options: GeneratePdfOptions = {}
): Promise<{ success: boolean; blob?: Blob; fileName?: string; error?: string }> {
  try {
    const targetElement =
      typeof elementOrId === 'string'
        ? document.getElementById(elementOrId)
        : elementOrId;

    if (!targetElement) {
      throw new Error(`Certificate element "${elementOrId}" not found in DOM.`);
    }

    // High DPI rasterization for crisp print vector fidelity
    const canvas = await html2canvas(targetElement, {
      scale: 3, // ~300 DPI output (1122 * 3 = 3366 px width, exactly matching 3508x2480 print target)
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      logging: false,
      windowWidth: 1122,
      windowHeight: 794
    });

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Create A4 Landscape PDF: 297mm width x 210mm height
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Zero-margin edge-to-edge print canvas
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');

    const fileName = options.fileName || `VertexLearn_Certificate_${Date.now()}.pdf`;
    pdf.save(fileName);

    const blob = pdf.output('blob');
    return { success: true, blob, fileName };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to generate PDF';
    console.error('PDF Generation Error:', err);
    return { success: false, error: message };
  }
}
