import React from "react";
import axios from "axios";
import Cookies from "universal-cookie";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useSnackbar } from "notistack";
const { enqueueSnackbar } = useSnackbar();
const cookie = new Cookies();
interface ActionResponse {
  status: boolean;
  message: string;
}
interface ActionParams<T> {
  url: string; // The endpoint to send the POST request to (relative to `BASE_URL`).
  data?: FormData; // Optional data to send with the POST request.
  actions?: { resetForm: (values: Record<string, unknown>) => void }; // Optional actions (e.g., reset the form).
  setDisabled?: (disabled: boolean) => void; // Function to control a disabled state (e.g., for buttons).
  setLoader?: (loading: boolean) => void; // Function to control a loading state (e.g., for a spinner).
  closeModal?: (loading: boolean) => void; // Function to close a modal if applicable.
  router?: AppRouterInstance; // Next.js router instance for navigation.
  redirectTo?: string; // Path to redirect to after a successful POST request.
  isCallGetAPI?: boolean; // Whether to make an additional GET request after the POST request.
  getAPIEndpoint?: string; // The endpoint for the optional GET request.
  setState?: React.Dispatch<React.SetStateAction<T>>; // Function to update state with the GET request's data.
}
/**
 * Handles a POST request to the server with additional features such as token management,
 * state updates, navigation, and optional GET API calls.
 *
 * @template T - The expected type of the data returned by the optional GET API call.
 * @param {ActionParams<T>} params - Configuration parameters for the POST action.
 * @param {string} params.url - The endpoint to send the POST request to (relative to `BASE_URL`).
 * @param {FormData} [params.data] - The form data to be sent with the POST request.
 * @param {{ resetForm: (values: Record<string, unknown>)}} [params.actions] - Actions such as resetting a form.
 * @param {(disabled: boolean)} [params.setDisabled] - Function to control a disabled state (e.g., for a button).
 * @param {(loading: boolean)} [params.setLoader] - Function to control a loading state (e.g., for a spinner).
 * @param {(loading: boolean)} [params.closeModal] - Function to close a modal if applicable.
 * @param {AppRouterInstance} [params.router] - Next.js router instance for navigation.
 * @param {string} [params.redirectTo] - The path to redirect to after a successful POST request.
 * @param {boolean} [params.isCallGetAPI=false] - Whether to make an additional GET request after the POST request.
 * @param {string} [params.getAPIEndpoint] - The endpoint for the optional GET request.
 * @param {React.Dispatch<React.SetStateAction<T>>} [params.setState] - Function to update state with the GET request's data.
 * @param {boolean} [params.showMessage=true] - Whether to display success/error messages via toast notifications.
 *
 * @throws {Error} If the POST request fails or the GET API call fails (logs an error message via toast).
 *
 */
async function updateHandleAction<T>({
  url,
  data,
  actions,
  setDisabled,
  setLoader,
  closeModal,
  router,
  redirectTo,
  isCallGetAPI = false,
  getAPIEndpoint,
  setState,
}: ActionParams<T>): Promise<ActionResponse | void> {
  // Disable buttons and show loader during the operation
  setDisabled?.(true);
  setLoader?.(true);

  try {
    // Send the PUT request to the server
    const res = await axios.put(`${process.env.BASE_URL}${url}`, data, {
      headers: {
        Accept: "application/json",
        Authorization: cookie.get("user_token") || "",
      },
    });

    // If the response indicates success
    if (res.data?.status) {
      // Optionally fetch additional data via GET API
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
          // Update state with GET API data
          setState?.(getRes.data);
        } catch (getErr) {
          // Handle errors from the GET API
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

      // Close modal if required
      if (closeModal) {
        closeModal(false);
      }

      // Redirect to a specified route if provided
      if (router && redirectTo) {
        router?.push(redirectTo);
      }
      enqueueSnackbar(res.data.message, {
        variant: "success",
      }); // Show a success message

      // Reset the form using provided actions
      actions?.resetForm({});
    } else {
      enqueueSnackbar(res.data.message || "An error occurred", {
        variant: "error",
      }); // Show a success message
    }

    // Return the response data
    return res.data as ActionResponse;
  } catch (err: unknown) {
    // Handle errors during the PUT request
    if (axios.isAxiosError(err)) {
      enqueueSnackbar(err.response?.data?.message || err.message, {
        variant: "error",
      });
    } else {
      enqueueSnackbar("An unexpected error occurred", {
        variant: "error",
      });
    }
  } finally {
    // Re-enable buttons and hide loader after the operation
    setDisabled?.(false);
    setLoader?.(false);
  }

  return undefined; // Explicit return in case of error
}

export { updateHandleAction };
