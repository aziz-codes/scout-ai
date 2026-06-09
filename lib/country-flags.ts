// ─── Country name → ISO 3166-1 alpha-2 code mapping ──────────────────────────
// Used to generate flag URLs from the flagcdn.com service

const COUNTRY_CODES: Record<string, string> = {
  "Mexico": "mx",
  "South Africa": "za",
  "South Korea": "kr",
  "Czech Republic": "cz",
  "Canada": "ca",
  "Bosnia and Herzegovina": "ba",
  "United States": "us",
  "Paraguay": "py",
  "Haiti": "ht",
  "Scotland": "gb-sct",
  "Australia": "au",
  "Turkey": "tr",
  "Brazil": "br",
  "Morocco": "ma",
  "Qatar": "qa",
  "Switzerland": "ch",
  "Ivory Coast": "ci",
  "Ecuador": "ec",
  "Germany": "de",
  "Curaçao": "cw",
  "Netherlands": "nl",
  "Japan": "jp",
  "Sweden": "se",
  "Tunisia": "tn",
  "Iran": "ir",
  "New Zealand": "nz",
  "Spain": "es",
  "Cape Verde": "cv",
  "Belgium": "be",
  "Egypt": "eg",
  "Saudi Arabia": "sa",
  "Uruguay": "uy",
  "France": "fr",
  "Senegal": "sn",
  "Iraq": "iq",
  "Norway": "no",
  "Argentina": "ar",
  "Algeria": "dz",
  "Austria": "at",
  "Jordan": "jo",
  "Portugal": "pt",
  "Democratic Republic of the Congo": "cd",
  "England": "gb-eng",
  "Croatia": "hr",
  "Uzbekistan": "uz",
  "Colombia": "co",
  "Ghana": "gh",
  "Panama": "pa",
  "Serbia": "rs",
  "Cameroon": "cm",
  "Nigeria": "ng",
  "Poland": "pl",
  "Peru": "pe",
  "Chile": "cl",
  "Denmark": "dk",
  "Italy": "it",
  "Wales": "gb-wls",
  "USA": "us",
  "Korea Republic": "kr",
};

// flagcdn.com only supports specific widths
const SUPPORTED_WIDTHS = [20, 40, 80, 160, 320] as const;

function nearestWidth(size: number): number {
  let best: number = SUPPORTED_WIDTHS[0];
  for (const w of SUPPORTED_WIDTHS) {
    if (w >= size) return w;
    best = w;
  }
  return best;
}

/**
 * Get a flag image URL from flagcdn.com for a given country name.
 * Automatically maps to the nearest supported width (20, 40, 80, 160, 320).
 */
export function getFlagUrl(countryName: string, size: number = 80): string {
  const code = COUNTRY_CODES[countryName];
  const w = nearestWidth(size);
  if (!code) {
    // Fallback: use the country name's first two chars as code
    return `https://flagcdn.com/w${w}/${countryName.slice(0, 2).toLowerCase()}.png`;
  }
  return `https://flagcdn.com/w${w}/${code}.png`;
}

/**
 * Get ISO 3166-1 alpha-2 code from country name.
 */
export function getCountryCode(countryName: string): string | undefined {
  return COUNTRY_CODES[countryName];
}
