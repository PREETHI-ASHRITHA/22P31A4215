// Validate if a string is a valid URL
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Check if a string is alphanumeric
export const isAlphanumeric = (str) => /^[a-zA-Z0-9]+$/.test(str);

// Generate a random short code (6 chars)
export const generateCode = () => {
  return Math.random().toString(36).substring(2, 8);
};
