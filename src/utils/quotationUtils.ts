/**
 * Quotation & Financial Formatting Utilities for SUMICH SOLUTIONS LIMITED
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const TENS = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertLessThanThousand(num: number): string {
  let result = '';
  if (num >= 100) {
    result += ONES[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num >= 20) {
    result += TENS[Math.floor(num / 10)] + (num % 10 > 0 ? '-' + ONES[num % 10] : '');
  } else if (num > 0) {
    result += ONES[num];
  }
  return result.trim();
}

/**
 * Converts a numeric amount to formal Kenyan Shillings in words.
 * Example: 224460 -> "Two Hundred and Twenty-Four Thousand, Four Hundred and Sixty Kenya Shillings Only"
 */
export function numberToKenyanShillingsWords(amount: number): string {
  if (!amount || isNaN(amount) || amount === 0) {
    return 'Zero Kenya Shillings Only';
  }

  const rounded = Math.round(amount);
  if (rounded === 0) return 'Zero Kenya Shillings Only';

  let remaining = rounded;
  let words = '';

  const billions = Math.floor(remaining / 1_000_000_000);
  remaining %= 1_000_000_000;
  if (billions > 0) {
    words += convertLessThanThousand(billions) + ' Billion ';
  }

  const millions = Math.floor(remaining / 1_000_000);
  remaining %= 1_000_000;
  if (millions > 0) {
    words += convertLessThanThousand(millions) + ' Million ';
  }

  const thousands = Math.floor(remaining / 1_000);
  remaining %= 1_000;
  if (thousands > 0) {
    words += convertLessThanThousand(thousands) + ' Thousand ';
  }

  if (remaining > 0) {
    words += convertLessThanThousand(remaining);
  }

  return words.trim() + ' Kenya Shillings Only';
}

export function formatKES(amount: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount || 0);
}

export function generateNextQuotationNumber(
  prefix: string = 'SUMICH/QTN',
  yearFormat: 'YYYY' | 'YY' | 'NONE' = 'YYYY',
  digits: number = 4,
  sequence: number = 1
): string {
  const currentYear = new Date().getFullYear();
  let yearPart = '';
  if (yearFormat === 'YYYY') {
    yearPart = `/${currentYear}`;
  } else if (yearFormat === 'YY') {
    yearPart = `/${String(currentYear).slice(-2)}`;
  }

  const seqStr = String(sequence).padStart(digits, '0');
  return `${prefix}${yearPart}/${seqStr}`;
}

export function generateNextInvoiceNumber(
  prefix: string = 'SUMICH/INV',
  yearFormat: 'YYYY' | 'YY' | 'NONE' = 'YYYY',
  digits: number = 4,
  sequence: number = 1
): string {
  const currentYear = new Date().getFullYear();
  let yearPart = '';
  if (yearFormat === 'YYYY') {
    yearPart = `/${currentYear}`;
  } else if (yearFormat === 'YY') {
    yearPart = `/${String(currentYear).slice(-2)}`;
  }

  const seqStr = String(sequence).padStart(digits, '0');
  return `${prefix}${yearPart}/${seqStr}`;
}
