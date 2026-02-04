/**
 * Input sanitization and validation utilities for Phase 7
 * Provides lightweight helpers for person names and phone numbers
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Sanitize person name - allows only letters, spaces, hyphens, and apostrophes
 * Removes any special characters or digits
 */
export function sanitizePersonName(input: string): string {
  // Allow letters (any language), spaces, hyphens, apostrophes
  return input.replace(/[^a-zA-Z\s\-']/g, '');
}

/**
 * Validate person name
 */
export function validatePersonName(name: string): ValidationResult {
  const sanitized = sanitizePersonName(name);
  
  if (sanitized.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: 'Name cannot be empty',
    };
  }
  
  if (sanitized.trim().length < 2) {
    return {
      isValid: false,
      errorMessage: 'Name must be at least 2 characters',
    };
  }
  
  // Check if original had invalid characters
  if (sanitized !== name) {
    return {
      isValid: false,
      errorMessage: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }
  
  return { isValid: true };
}

/**
 * Sanitize phone number - allows only digits and optional leading '+'
 * Removes any letters or special characters except '+'
 */
export function sanitizePhoneNumber(input: string): string {
  // Allow digits and optional leading '+'
  if (input.startsWith('+')) {
    return '+' + input.slice(1).replace(/[^\d]/g, '');
  }
  return input.replace(/[^\d]/g, '');
}

/**
 * Validate phone number
 */
export function validatePhoneNumber(phone: string): ValidationResult {
  const sanitized = sanitizePhoneNumber(phone);
  
  if (sanitized.trim().length === 0) {
    return {
      isValid: false,
      errorMessage: 'Phone number cannot be empty',
    };
  }
  
  // Check minimum length (at least 10 digits for most countries)
  const digitsOnly = sanitized.replace(/\+/g, '');
  if (digitsOnly.length < 10) {
    return {
      isValid: false,
      errorMessage: 'Phone number must be at least 10 digits',
    };
  }
  
  // Check if original had invalid characters
  if (sanitized !== phone) {
    return {
      isValid: false,
      errorMessage: 'Phone number can only contain digits and optional leading +',
    };
  }
  
  return { isValid: true };
}
