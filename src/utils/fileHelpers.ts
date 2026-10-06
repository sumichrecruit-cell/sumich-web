/**
 * File utility helpers for viewing, downloading, and printing uploaded files
 * across the Sumich Solutions platform.
 */

export interface DownloadOptions {
  fileDataUrl?: string;
  fileName: string;
  content?: string;
  fileType?: string;
}

export interface PrintOptions {
  fileDataUrl?: string;
  fileName?: string;
  title: string;
  content?: string;
  applicantName?: string;
  details?: Record<string, string>;
  category?: string;
}

/**
 * Downloads any file - whether a base64 Data URL, Object URL, or generated text/dossier.
 */
export function downloadUploadedFile(options: DownloadOptions): void {
  const { fileDataUrl, fileName, content, fileType } = options;

  if (fileDataUrl) {
    const link = document.createElement('a');
    link.href = fileDataUrl;
    link.download = fileName || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Create a blob fallback from textual/dossier content
  const safeName = fileName || 'sumich_document.txt';
  const mime = fileType || (safeName.endsWith('.html') ? 'text/html;charset=utf-8' : 'text/plain;charset=utf-8');
  const bodyText = content || `SUMICH SOLUTIONS LIMITED\nOfficial Document: ${safeName}\nExported: ${new Date().toLocaleString()}\nLicensed by PSRA (PSRA/REG/KEN/2023/0488)`;
  
  const blob = new Blob([bodyText], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = safeName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Direct iframe-based printing for clean, unclipped output with official Sumich Letterhead.
 * Bypasses modal backdrop and viewport scroll issues.
 */
export function printDirectViaIframe(htmlContent: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    window.print();
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    try {
      iframe.contentWindow?.print();
    } catch (err) {
      console.warn('Iframe print error, falling back to window.print():', err);
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2500);
    }
  }, 400);
}

/**
 * Generates an official, print-ready HTML page for any document or image file.
 */
export function generatePrintableDocumentHtml(options: PrintOptions): string {
  const { fileDataUrl, fileName, title, content, applicantName, details, category } = options;
  const isImage = Boolean(
    (fileDataUrl && fileDataUrl.startsWith('data:image/')) ||
    /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(fileName || '')
  );

  const detailsRows = details
    ? Object.entries(details)
        .map(([k, v]) => `<tr><td style="padding: 6px 12px; font-weight: bold; color: #475569; text-transform: uppercase; font-size: 11px; width: 35%; border-bottom: 1px solid #e2e8f0;">${k.replace(/([A-Z])/g, ' $1')}</td><td style="padding: 6px 12px; color: #0f172a; font-size: 12px; border-bottom: 1px solid #e2e8f0;">${v || 'N/A'}</td></tr>`)
        .join('')
    : '';

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${title || 'Sumich Solutions Document'} - ${fileName || 'Document'}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      margin: 0;
      padding: 20px;
      line-height: 1.5;
    }
    .header-table {
      width: 100%;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .company-title {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #0f172a;
    }
    .company-sub {
      font-size: 11px;
      font-weight: 700;
      color: #b45309;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .company-meta {
      font-size: 10px;
      color: #64748b;
    }
    .doc-meta {
      text-align: right;
      font-size: 11px;
      color: #334155;
    }
    .title-banner {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #f59e0b;
      padding: 12px 16px;
      margin-bottom: 20px;
      border-radius: 6px;
    }
    .title-text {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }
    .table-details {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }
    .content-box {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 16px;
      border-radius: 6px;
      white-space: pre-wrap;
      line-height: 1.6;
      color: #1e293b;
    }
    .image-preview {
      text-align: center;
      margin: 20px 0;
    }
    .image-preview img {
      max-width: 100%;
      max-height: 650px;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .footer-table {
      width: 100%;
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #e2e8f0;
      font-size: 10px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="vertical-align: top;">
        <div class="company-title">SUMICH SOLUTIONS LIMITED</div>
        <div class="company-sub">Security & Guarding Services &middot; Nairobi, Kenya</div>
        <div class="company-meta">PSRA Certified: PSRA/REG/KEN/2023/0488 &middot; Reg: CPR/2023/108422</div>
      </td>
      <td class="doc-meta" style="vertical-align: top;">
        <div><strong>${category || 'Official Document Archive'}</strong></div>
        <div>File: <span style="font-family: monospace;">${fileName || 'document'}</span></div>
        <div>Date: ${new Date().toLocaleDateString('en-GB')}</div>
      </td>
    </tr>
  </table>

  <div class="title-banner">
    <div class="title-text">${title || 'DOCUMENT DOSSIER'}</div>
    ${applicantName ? `<div style="font-size: 12px; color: #475569;">Subject / Applicant: <strong>${applicantName}</strong></div>` : ''}
  </div>

  ${isImage && fileDataUrl ? `
    <div class="image-preview">
      <img src="${fileDataUrl}" alt="${title || 'Document'}" />
    </div>
  ` : ''}

  ${detailsRows ? `
    <table class="table-details">
      ${detailsRows}
    </table>
  ` : ''}

  ${content ? `
    <div style="font-size: 12px; font-weight: bold; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; color: #334155;">Document Content & Specifications:</div>
    <div class="content-box">${content}</div>
  ` : ''}

  <table class="footer-table">
    <tr>
      <td>
        <strong>SUMICH SOLUTIONS LIMITED KENYA</strong><br />
        Headquarters: Vision Plaza, 3rd Floor, Mombasa Road, Nairobi<br />
        Private Security Regulatory Authority (PSRA) License: PSRA/REG/KEN/2023/0488
      </td>
      <td style="text-align: right;">
        <strong>Authorized Records Directorate</strong><br />
        Official Digitally Verified Record<br />
        Security Vetting & Documentation Authority
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Triggers direct high-fidelity print for any document or image.
 */
export function printUploadedFile(options: PrintOptions): void {
  const html = generatePrintableDocumentHtml(options);
  printDirectViaIframe(html);
}
