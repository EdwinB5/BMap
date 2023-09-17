/**
 * Fetches data from a specified URL and returns it as a JavaScript object.
 *
 * @param {string} dataUrl - The URL from which to fetch the data.
 * @returns {Promise<object>} A Promise that resolves with the fetched data as a JavaScript object.
 * @throws {Error} Throws an error if the network request fails or if the response is not valid JSON.
 */
export async function fetchData(dataUrl) {
  try {
    // Send a GET request to the specified URL.
    const response = await fetch(dataUrl);

    // Check if the response status is OK (200).
    if (!response.ok) {
      throw new Error(
        `Network response was not ok. Status: ${response.status}`
      );
    }

    // Parse the response body as JSON and store it in dataLoaded.
    const dataLoaded = await response.json();

    // Return the fetched data as a JavaScript object.
    return dataLoaded;
  } catch (error) {
    // Handle any errors that occur during the fetch operation.
    throw new Error(`Error fetching data: ${error.message}`);
  }
}
