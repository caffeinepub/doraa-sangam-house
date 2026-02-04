import { PHONE_COUNTRIES, type CountryData } from './phoneCountries';

/**
 * Attempts to detect the user's country from browser locale/language settings.
 * Falls back to India (IN) if detection fails or country is not in our supported list.
 */
export function detectCountryFromLocale(): CountryData {
  try {
    // Try to get country from Intl API (most reliable)
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Map common time zones to countries
      const timeZoneMap: Record<string, string> = {
        'Asia/Kolkata': 'IN',
        'Asia/Calcutta': 'IN',
        'America/New_York': 'US',
        'America/Los_Angeles': 'US',
        'America/Chicago': 'US',
        'Europe/London': 'GB',
        'Asia/Dubai': 'AE',
        'America/Toronto': 'CA',
        'Australia/Sydney': 'AU',
        'Asia/Singapore': 'SG',
        'Asia/Kuala_Lumpur': 'MY',
        'Asia/Karachi': 'PK',
        'Asia/Dhaka': 'BD',
        'Asia/Colombo': 'LK',
        'Asia/Kathmandu': 'NP',
        'Asia/Riyadh': 'SA',
        'Asia/Qatar': 'QA',
        'Asia/Kuwait': 'KW',
        'Asia/Muscat': 'OM',
        'Asia/Bahrain': 'BH',
        'Europe/Berlin': 'DE',
        'Europe/Paris': 'FR',
        'Europe/Rome': 'IT',
        'Europe/Madrid': 'ES',
        'Europe/Amsterdam': 'NL',
        'Asia/Tokyo': 'JP',
        'Asia/Shanghai': 'CN',
        'Asia/Seoul': 'KR',
        'Asia/Bangkok': 'TH',
        'Asia/Jakarta': 'ID',
        'Asia/Manila': 'PH',
        'Asia/Ho_Chi_Minh': 'VN',
        'Pacific/Auckland': 'NZ',
      };
      
      const detectedCode = timeZoneMap[timeZone];
      if (detectedCode) {
        const country = PHONE_COUNTRIES.find(c => c.code === detectedCode);
        if (country) return country;
      }
    }

    // Fallback: Try navigator.language (e.g., "en-US", "en-GB")
    if (typeof navigator !== 'undefined' && navigator.language) {
      const langParts = navigator.language.split('-');
      if (langParts.length > 1) {
        const regionCode = langParts[1].toUpperCase();
        const country = PHONE_COUNTRIES.find(c => c.code === regionCode);
        if (country) return country;
      }
    }
  } catch (error) {
    console.warn('Country detection failed:', error);
  }

  // Default to India
  return PHONE_COUNTRIES[0]; // India is first in the list
}
