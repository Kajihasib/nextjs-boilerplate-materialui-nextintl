import { cookies } from "next/headers";

/**
 * Fetches data from the server with optional caching and includes an authorization token if available.
 *
 * @template T - The expected type of the response data.
 * @param {string} url - The endpoint to fetch data from (relative to `BASE_URL`).
 * @param {boolean} [cache=false] - Whether to cache the response (`force-cache`) or disable caching (`no-cache`).
 * @returns {Promise<T>} The parsed JSON response as the specified type.
 *
 * @throws {Error} If the fetch request fails or the response status is not OK.
 *
 * @example
 * const data = await getServerData<MyResponseType>('/api/data', true);
 */
export const getServerData = async <T>(
  url: string,
  cache: boolean = false
): Promise<T> => {
  const headers = new Headers();
  const cookieStore = cookies();
  const userTokenCookie = (await cookieStore).get("user_token");
  const userToken = userTokenCookie?.value;

  if (userToken) {
    headers.append("Authorization", userToken);
  }

  headers.append("Accept", "application/json");
  headers.append("Content-Type", "application/json");

  const response = await fetch(`${process.env.BASE_URL}${url}`, {
    cache: cache ? "force-cache" : "no-cache",
    headers: headers,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch data from ${url}. Status: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
};
