// Curated list of 29 popular countries for international phone input
export interface CountryData {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dialCode: string;
  flag: string; // Unicode flag emoji
  format?: string; // Placeholder format hint
}

export const PHONE_COUNTRIES: CountryData[] = [
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳', format: 'XXXXXXXXXX' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸', format: 'XXX XXX XXXX' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧', format: 'XXXX XXXXXX' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪', format: 'XX XXX XXXX' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦', format: 'XXX XXX XXXX' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺', format: 'XXX XXX XXX' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬', format: 'XXXX XXXX' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾', format: 'XX XXXX XXXX' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰', format: 'XXX XXXXXXX' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩', format: 'XXXX XXXXXX' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰', format: 'XX XXX XXXX' },
  { code: 'NP', name: 'Nepal', dialCode: '+977', flag: '🇳🇵', format: 'XXX XXX XXXX' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦', format: 'XX XXX XXXX' },
  { code: 'QA', name: 'Qatar', dialCode: '+974', flag: '🇶🇦', format: 'XXXX XXXX' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965', flag: '🇰🇼', format: 'XXXX XXXX' },
  { code: 'OM', name: 'Oman', dialCode: '+968', flag: '🇴🇲', format: 'XXXX XXXX' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973', flag: '🇧🇭', format: 'XXXX XXXX' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪', format: 'XXX XXXXXXX' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷', format: 'X XX XX XX XX' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹', format: 'XXX XXX XXXX' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸', format: 'XXX XXX XXX' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱', format: 'X XX XX XX XX' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵', format: 'XX XXXX XXXX' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳', format: 'XXX XXXX XXXX' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷', format: 'XX XXXX XXXX' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭', format: 'XX XXX XXXX' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩', format: 'XXX XXXX XXXX' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭', format: 'XXX XXX XXXX' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳', format: 'XX XXXX XXXX' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿', format: 'XX XXX XXXX' },
];

export function findCountryByCode(code: string): CountryData | undefined {
  return PHONE_COUNTRIES.find(c => c.code === code);
}

export function findCountryByDialCode(dialCode: string): CountryData | undefined {
  return PHONE_COUNTRIES.find(c => c.dialCode === dialCode);
}
