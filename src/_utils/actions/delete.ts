import axios from "axios";
import Cookies from "universal-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSnackbar } from "notistack";
const { enqueueSnackbar } = useSnackbar();
const cookie = new Cookies();

interface DeleteActionParams<T> {
  url: string; // The endpoint to send the DELETE request to (relative to `BASE_URL`).
  data?: FormData; // Optional data to include in the DELETE request body.
  isCallGetAPI?: boolean; // Whether to call an additional GET API after the DELETE action.
  getAPIEndpoint?: string; // The endpoint for the GET API to fetch updated data.
  setState?: React.Dispatch<React.SetStateAction<T>>; // Function to update state with data from the GET API.
  router?: AppRouterInstance; // Next.js router instance for navigation.
  redirectTo?: string; // Path to redirect to after the DELETE action.
}

/**
 * Handles an HTTP DELETE request, with optional follow-up GET requests, state updates, and navigation.
 *
 * @template T - The expected type of data returned by the optional GET API.
 * @param {DeleteActionParams<T>} params - Configuration parameters for the DELETE request.
 * @param {string} params.url - The endpoint to send the DELETE request to (relative to `BASE_URL`).
 * @param {FormData} [params.data] - Optional data to include in the DELETE request body.
 * @param {boolean} [params.isCallGetAPI=false] - Whether to call an additional GET API after the DELETE action.
 * @param {string} [params.getAPIEndpoint] - The endpoint for the GET API to fetch updated data.
 * @param {React.Dispatch<React.SetStateAction<T>>} [params.setState] - Function to update state with data from the GET API.
 * @param {AppRouterInstance} [params.router] - Next.js router instance for navigation.
 * @param {string} [params.redirectTo] - Path to redirect to after the DELETE action.
 *
 * @returns {Promise<void>} Resolves when the DELETE action and any follow-up tasks are complete.
 */
async function deleteAction<T>({
  url,
  data,
  isCallGetAPI = false,
  getAPIEndpoint,
  setState,
  router,
  redirectTo,
}: DeleteActionParams<T>): Promise<void> {
  try {
    // Configuration for the DELETE request, including headers and optional body data
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: cookie.get("user_token") || "", // Include token if available
      },
    };

    // Send the DELETE request
    const res = await axios.delete(`${process.env.BASE_URL}${url}`, {
      ...config,
      data, // Include optional body data if provided
    });

    // Handle a successful response
    if (res?.data?.status) {
      // Optionally call an additional GET API to fetch updated data
      if (isCallGetAPI && getAPIEndpoint) {
        try {
          const getRes = await axios.get<T>(
            `${process.env.BASE_URL}${getAPIEndpoint}`,
            {
              headers: {
                Accept: "application/json",
                Authorization: cookie.get("user_token") || "",
              },
            }
          );
          setState?.(getRes.data); // Update state with the fetched data
        } catch (getErr) {
          if (axios.isAxiosError(getErr)) {
            enqueueSnackbar(getErr.response?.data?.message || getErr.message, {
              variant: "error",
            });
          } else {
            enqueueSnackbar(
              "Failed to fetch additional data from the GET API",
              {
                variant: "error",
              }
            );
          }
        }
      }

      // Redirect if `router` and `redirectTo` are provided
      if (router && redirectTo) {
        router?.push(redirectTo);
      }
      enqueueSnackbar(res.data.message, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(res.data.message, {
        variant: "error",
      });
    }
  } catch (err: unknown) {
    // Handle errors during the DELETE request
    if (axios.isAxiosError(err)) {
      enqueueSnackbar(err.response?.data?.message || err.message, {
        variant: "error",
      });
    } else {
      enqueueSnackbar("An unexpected error occurred", {
        variant: "error",
      });
    }
  }
}

export { deleteAction };
