import type { CountryData } from './phoneCountries';

export interface PhoneValidationResult {
  isValid: boolean;
  e164?: string; // International format with +
  errorMessage?: string;
}

// Country-specific validation rules (digit counts for national numbers)
const COUNTRY_RULES: Record<string, { minDigits: number; maxDigits: number }> = {
  IN: { minDigits: 10, maxDigits: 10 }, // India
  US: { minDigits: 10, maxDigits: 10 }, // United States
  CA: { minDigits: 10, maxDigits: 10 }, // Canada
  GB: { minDigits: 10, maxDigits: 10 }, // United Kingdom
  AE: { minDigits: 9, maxDigits: 9 },   // UAE
  AU: { minDigits: 9, maxDigits: 9 },   // Australia
  SG: { minDigits: 8, maxDigits: 8 },   // Singapore
  MY: { minDigits: 9, maxDigits: 10 },  // Malaysia
  PK: { minDigits: 10, maxDigits: 10 }, // Pakistan
  BD: { minDigits: 10, maxDigits: 10 }, // Bangladesh
  LK: { minDigits: 9, maxDigits: 9 },   // Sri Lanka
  NP: { minDigits: 10, maxDigits: 10 }, // Nepal
  SA: { minDigits: 9, maxDigits: 9 },   // Saudi Arabia
  QA: { minDigits: 8, maxDigits: 8 },   // Qatar
  KW: { minDigits: 8, maxDigits: 8 },   // Kuwait
  OM: { minDigits: 8, maxDigits: 8 },   // Oman
  BH: { minDigits: 8, maxDigits: 8 },   // Bahrain
  DE: { minDigits: 10, maxDigits: 11 }, // Germany
  FR: { minDigits: 9, maxDigits: 9 },   // France
  IT: { minDigits: 10, maxDigits: 10 }, // Italy
  ES: { minDigits: 9, maxDigits: 9 },   // Spain
  NL: { minDigits: 9, maxDigits: 9 },   // Netherlands
  JP: { minDigits: 10, maxDigits: 10 }, // Japan
  CN: { minDigits: 11, maxDigits: 11 }, // China
  KR: { minDigits: 10, maxDigits: 11 }, // South Korea
  TH: { minDigits: 9, maxDigits: 9 },   // Thailand
  ID: { minDigits: 10, maxDigits: 11 }, // Indonesia
  PH: { minDigits: 10, maxDigits: 10 }, // Philippines
  VN: { minDigits: 9, maxDigits: 10 },  // Vietnam
  NZ: { minDigits: 9, maxDigits: 10 },  // New Zealand
};

/**
 * Validates a phone number for a specific country and returns E.164 format if valid.
 * @param nationalNumber - The phone number without country code (e.g., "9876543210" for India)
 * @param country - The selected country data
 */
export function validatePhoneNumber(
  nationalNumber: string,
  country: CountryData
): PhoneValidationResult {
  try {
    // Remove all non-digit characters
    const cleanNumber = nationalNumber.replace(/\D/g, '');
    
    if (!cleanNumber) {
      return {
        isValid: false,
        errorMessage: `Please enter a valid ${country.name} mobile number`,
      };
    }

    // Get validation rules for this country
    const rules = COUNTRY_RULES[country.code];
    if (!rules) {
      // Fallback for countries without specific rules
      if (cleanNumber.length < 8 || cleanNumber.length > 15) {
        return {
          isValid: false,
          errorMessage: `Please enter a valid ${country.name} mobile number`,
        };
      }
    } else {
      // Validate digit count
      if (cleanNumber.length < rules.minDigits || cleanNumber.length > rules.maxDigits) {
        return {
          isValid: false,
          errorMessage: `Please enter a valid ${country.name} mobile number`,
        };
      }
    }

    // Additional validation: must start with valid digit (not 0 or 1 for most countries)
    if (country.code === 'IN' && !cleanNumber.match(/^[6-9]/)) {
      return {
        isValid: false,
        errorMessage: `Please enter a valid ${country.name} mobile number`,
      };
    }

    // Construct E.164 format: + followed by country code and national number
    const e164 = `${country.dialCode}${cleanNumber}`;

    return {
      isValid: true,
      e164,
    };
  } catch (error) {
    console.error('Phone validation error:', error);
    return {
      isValid: false,
      errorMessage: `Please enter a valid ${country.name} mobile number`,
    };
  }
}

/**
 * Get expected digit count for a country (for UI hints)
 */
export function getExpectedDigitCount(countryCode: string): number {
  const rules = COUNTRY_RULES[countryCode];
  if (!rules) return 10; // Default
  return rules.minDigits === rules.maxDigits ? rules.minDigits : rules.minDigits;
}
