
const MONTHS_ES: Record<string, number> = {
  "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
  "julio": 7, "agosto": 8, "septiembre": 9, "octubre": 10, "noviembre": 11, "diciembre": 12
};

const MONTHS_EN: Record<string, number> = {
  "january": 1, "february": 2, "march": 3, "april": 4, "may": 5, "june": 6,
  "july": 7, "august": 8, "september": 9, "october": 10, "november": 11, "december": 12,
  "jan": 1, "feb": 2, "mar": 3, "apr": 4, "jun": 6, "jul": 7, "aug": 8, "sep": 9, "oct": 10, "nov": 11, "dec": 12
};

/**
 * Parses a date string or object into a sortable number (YYYYMM).
 * Returns a very high number for current dates like "Presente" or "Actualidad".
 */
export function parseToDateValue(date: string | { month?: string; year?: string } | undefined): number {
  if (!date) return 0;

  // Handle object format { month: "Marzo", year: "2022" }
  if (typeof date === 'object') {
    const year = parseInt(date.year || '0');
    if (isNaN(year) || year === 0) return 0;
    
    let monthValue = 0;
    if (date.month) {
      const m = date.month.toLowerCase();
      monthValue = MONTHS_ES[m] || MONTHS_EN[m] || 0;
    }
    return year * 100 + monthValue;
  }

  // Handle string format
  const lowerDate = date.toLowerCase().trim();

  // Present dates
  if (lowerDate === 'presente' || lowerDate === 'actualidad' || lowerDate === 'present' || lowerDate === 'now') {
    return 999999;
  }

  // Try parsing YYYY
  if (/^\d{4}$/.test(lowerDate)) {
    return parseInt(lowerDate) * 100;
  }

  // Try parsing "Month YYYY"
  const parts = lowerDate.split(/\s+/);
  if (parts.length >= 2) {
    const lastPart = parts[parts.length - 1];
    const year = parseInt(lastPart);
    if (!isNaN(year) && year > 1900 && year < 2100) {
      const firstPart = parts[0];
      const monthValue = MONTHS_ES[firstPart] || MONTHS_EN[firstPart] || 0;
      return year * 100 + monthValue;
    }
  }

  // Fallback: try native Date parsing if it looks like a standard format
  const timestamp = Date.parse(date);
  if (!isNaN(timestamp)) {
    const d = new Date(timestamp);
    return d.getFullYear() * 100 + (d.getMonth() + 1);
  }

  return 0;
}
