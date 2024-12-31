import { useSnackbar } from "notistack";
const { enqueueSnackbar } = useSnackbar();
/**
 * Obfuscates a string by replacing all characters except the first two and last two with asterisks (*).
 *
 * If the input string is less than or equal to 4 characters long, the function will return the string unchanged.
 *
 * @param {string} input - The string to be obfuscated.
 * @returns {string} The obfuscated string with only the first two and last two characters visible.
 *
 * @example
 * // returns "ab****yz"
 * obfuscateString("abcdefghyz");
 *
 * @example
 * // returns "test"
 * obfuscateString("test"); // Strings with 4 or fewer characters are not obfuscated
 */
export const obfuscateString = (input: string): string => {
  if (input.length <= 4) {
    return input;
  }
  const firstTwo = input.slice(0, 2);
  const lastTwo = input.slice(-2);
  const obfuscatedPart = "*".repeat(input.length - 4);
  return firstTwo + obfuscatedPart + lastTwo;
};
/**
 * Copies the provided text to the clipboard using the Clipboard API.
 *
 * If the copy operation is successful, a toast notification is shown indicating success.
 * If the operation fails, a toast notification shows the error message.
 *
 * @param {string} text - The text to be copied to the clipboard.
 * @returns {Promise<void>} A promise that resolves when the copy operation is complete.
 *
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    enqueueSnackbar("Copied to clipboard!", {
      variant: "info",
    });
  } catch (err) {
    enqueueSnackbar(`Failed to copy text: ${err}`, {
      variant: "error",
    });
  }
};

/**
 * Calculates a future date by adding a specified number of days to the current date.
 *
 * @param {number} days - The number of days to add to the current date. Defaults to 365 if not provided.
 * @returns {Date} The calculated future date.
 */
export const daysCount = (days: number) => {
  const date = new Date();
  days = days || 365;
  date.setTime(+date + days * 86400000); // 24 * 60 * 60 * 1000
  return date;
};

/**
 * Converts an object into a query string, omitting keys with empty, null, or undefined values.
 *
 * @param {Record<string, string | number | boolean | null | undefined>} obj - The object to be converted.
 * @returns {string} The resulting query string.
 *
 * @example
 * // Returns "name=John&age=30&active=true"
 * objectToQueryString({ name: "John", age: 30, active: true, empty: null });
 */
export const objectToQueryString = (
  obj: Record<string, string | number | boolean | null | undefined>
): string => {
  const str: string[] = [];
  for (const data in obj) {
    if (obj.hasOwnProperty(data)) {
      if (obj[data] !== "" && obj[data] !== null && obj[data] !== undefined) {
        str.push(
          encodeURIComponent(data) + "=" + encodeURIComponent(String(obj[data]))
        );
      }
    }
  }
  return str.join("&");
};
