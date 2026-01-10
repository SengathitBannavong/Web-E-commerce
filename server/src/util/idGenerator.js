import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique review ID
 * Format: R + 7-digit number (fits in 8 chars)
 */
export const generateReviewId = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 10); // Single random digit
  return `R${timestamp}${random}`;
};

/**
 * Generate a unique comment ID  
 * Format: C + 7-digit number (fits in 8 chars)
 */
export const generateCommentId = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 10); // Single random digit
  return `C${timestamp}${random}`;
};

/**
 * Generate a unique product ID
 * Format: P + 7-digit number (fits in 8 chars)
 */
export const generateProductId = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 10); // Single random digit
  return `P${timestamp}${random}`;
};

/**
 * Generate a unique user ID
 * Format: U + 7-digit number (fits in 8 chars)
 */
export const generateUserId = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 10); // Single random digit
  return `U${timestamp}${random}`;
};

/**
 * Generate a unique order ID
 * Format: O + 7-digit number (fits in 8 chars)
 */
export const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 10); // Single random digit
  return `O${timestamp}${random}`;
};

/**
 * Generate a unique cart ID
 * Format: T + 7-digit number (fits in 8 chars) 
 */
export const generateCartId = () => {
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 10); // Single random digit
  return `T${timestamp}${random}`;
};

/**
 * Generate a UUID v4
 * For cases where you need a standard UUID
 */
export const generateUUID = () => {
  return uuidv4();
};

/**
 * Generate a short random string
 * @param {number} length - Length of the random string (default: 8)
 */
export const generateShortId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate a numeric ID
 * @param {number} length - Length of the numeric ID (default: 10)
 */
export const generateNumericId = (length = 10) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

/**
 * Generate an alphanumeric ID with prefix
 * @param {string} prefix - Prefix for the ID
 * @param {number} length - Length of the random part (default: 8)
 */
export const generatePrefixedId = (prefix, length = 8) => {
  const timestamp = Date.now().toString(36);
  const random = generateShortId(length);
  return `${prefix}-${timestamp}-${random}`;
};