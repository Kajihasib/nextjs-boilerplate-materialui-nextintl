import axios from "axios";
import Cookies from "universal-cookie";
import { useSnackbar } from "notistack";
const { enqueueSnackbar } = useSnackbar();
const cookie = new Cookies();

interface GetActionParams<T> {
  url: string; // The endpoint to send the GET request to (relative to `BASE_URL`).
  setState?: React.Dispatch<React.SetStateAction<T | null>>; // State setter to update with fetched data.
  params?: Record<string, string | number | boolean>; // Optional query parameters for the GET request.
}

/**
 * Handles an HTTP GET request to fetch data from the server, with optional state updates and error handling.
 *
 * @template T - The expected type of the data returned by the GET request.
 * @param {GetActionParams<T>} params - Configuration parameters for the GET request.
 * @param {string} params.url - The endpoint to send the GET request to (relative to `BASE_URL`).
 * @param {React.Dispatch<React.SetStateAction<T | null>>} [params.setState] - Function to update state with the fetched data.
 * @param {Record<string, string | number | boolean>} [params.params={}] - Query parameters to include in the GET request.
 *
 * @returns {Promise<void>} Resolves when the request completes successfully or fails.
 *
 * @example
 * getAction({
 *   url: "/api/data",
 *   setState: setData,
 *   params: { filter: "active" },
 * });
 */
async function getAction<T>({
  url,
  setState,
  params = {},
}: GetActionParams<T>): Promise<void> {
  try {
    // Configuration for the GET request, including headers and query parameters
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: cookie.get("user_token") || "", // Include token if available
      },
      params, // Attach query parameters to the request
    };

    // Send the GET request
    const res = await axios.get<T>(`${process.env.BASE_URL}${url}`, config);

    // Check if response data exists and update state if a setter is provided
    if (res?.data) {
      setState?.(res.data);
    } else {
      enqueueSnackbar("Failed to fetch data", {
        variant: "error",
      }); // Notify user if data is missing
    }
  } catch (err: unknown) {
    // Handle errors during the GET request
    if (axios.isAxiosError(err)) {
      enqueueSnackbar(err.response?.data?.message || err.message, {
        variant: "error",
      }); // Show API error message
    } else {
      enqueueSnackbar("An unexpected error occurred", {
        variant: "error",
      }); // Show generic error message
    }
  }
}

export { getAction };
