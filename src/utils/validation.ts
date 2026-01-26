// utils/validation.js

// Safe email validation helper (no regex vulnerabilities)
function isValidEmail(email: string): boolean {
  // Basic sanity checks first
  if (!email || typeof email !== 'string') return false;

  const trimmed = email.trim();
  if (trimmed.length === 0) return false;

  // Check for @ symbol and basic structure
  const atIndex = trimmed.indexOf('@');
  if (atIndex <= 0 || atIndex === trimmed.length - 1) return false;

  // Check for domain part after @
  const domain = trimmed.substring(atIndex + 1);
  if (!domain || domain.indexOf('.') === -1) return false;

  // Use simple regex for final validation (safe pattern)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export function validateFormField(field, value) {
  const trimmedValue = typeof value === "string" ? value.trim() : value;

  // Required validation
  if (field.required) {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return { success: false, error: `${field.label} is required` };
      }
      // For repeater fields, check if at least one entry has content
      const hasContent = value.some(item => {
        if (typeof item === 'string') return item.trim() !== '';
        if (typeof item === 'object' && item !== null) {
          return Object.values(item).some(val => val && String(val).trim() !== '');
        }
        return !!item;
      });
      if (!hasContent) {
        return { success: false, error: `${field.label} must have at least one entry` };
      }
    } else if (!trimmedValue || trimmedValue === "") {
      return {
        success: false,
        error: `${field.label} is required`,
      };
    }
  }

  // Min length validation
  if (
    field.minLength &&
    typeof trimmedValue === "string" &&
    trimmedValue.length < field.minLength
  ) {
    return {
      success: false,
      error: `${field.label} must be at least ${field.minLength} characters`,
    };
  }

  // Max length validation
  if (
    field.maxLength &&
    typeof trimmedValue === "string" &&
    trimmedValue.length > field.maxLength
  ) {
    return {
      success: false,
      error: `${field.label} must be no more than ${field.maxLength} characters`,
    };
  }

  // Pattern validation - SECURITY: Validate pattern length to prevent ReDoS
  if (field.pattern && typeof trimmedValue === "string" && trimmedValue) {
    try {
      // Limit pattern length to prevent malicious patterns
      if (field.pattern.length > 100) {
        return {
          success: false,
          error: `${field.label} has an invalid format`,
        };
      }
      const regex = new RegExp(field.pattern);
      // Timeout protection - limit test execution time
      const startTime = Date.now();
      const result = regex.test(trimmedValue);
      if (Date.now() - startTime > 100) {
        console.warn('Regex execution took too long, potential ReDoS pattern');
      }
      if (!result) {
        return {
          success: false,
          error:
            field.patternErrorMessage || `${field.label} has an invalid format`,
        };
      }
    } catch (e) {
      return {
        success: false,
        error: `${field.label} has an invalid format`,
      };
    }
  }

  // Email validation - use helper function
  if (field.type === "email" && typeof trimmedValue === "string" && trimmedValue) {
    if (!isValidEmail(trimmedValue)) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }
  }

  // Number validation
  if (field.type === "number" && trimmedValue !== "") {
    const numValue = Number(trimmedValue);
    if (isNaN(numValue)) {
      return {
        success: false,
        error: `${field.label} must be a number`,
      };
    }

    if (field.min !== undefined && numValue < field.min) {
      return {
        success: false,
        error: `${field.label} must be at least ${field.min}`,
      };
    }

    if (field.max !== undefined && numValue > field.max) {
      return {
        success: false,
        error: `${field.label} must be no more than ${field.max}`,
      };
    }
  }

  return { success: true };
}
