/**
 * Safe return path validation and normalization
 * Ensures return paths are internal, valid, and safe to navigate to
 */

const UNSAFE_PATHS = ['/login', '/reset', '/admin'];
const UNSAFE_PATH_PREFIXES = ['/admin'];

/**
 * Validate and normalize a return path
 * Returns a safe path or the default fallback
 */
export function getSafeReturnPath(
  returnPath: string | null | undefined,
  defaultPath: string = '/dashboard'
): string {
  // No return path provided
  if (!returnPath || typeof returnPath !== 'string') {
    return defaultPath;
  }

  // Must be a valid path string
  const trimmed = returnPath.trim();
  if (!trimmed || !trimmed.startsWith('/')) {
    return defaultPath;
  }

  // Check against unsafe exact paths
  if (UNSAFE_PATHS.includes(trimmed)) {
    return defaultPath;
  }

  // Check against unsafe path prefixes
  for (const prefix of UNSAFE_PATH_PREFIXES) {
    if (trimmed.startsWith(prefix)) {
      return defaultPath;
    }
  }

  // Path is safe
  return trimmed;
}

/**
 * Check if a path is safe to store as a return path
 */
export function isSafeReturnPath(path: string | null | undefined): boolean {
  if (!path || typeof path !== 'string') {
    return false;
  }

  const trimmed = path.trim();
  if (!trimmed || !trimmed.startsWith('/')) {
    return false;
  }

  if (UNSAFE_PATHS.includes(trimmed)) {
    return false;
  }

  for (const prefix of UNSAFE_PATH_PREFIXES) {
    if (trimmed.startsWith(prefix)) {
      return false;
    }
  }

  return true;
}
