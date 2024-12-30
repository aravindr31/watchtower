import { SPOTIFY_API_BASEURL } from "./commonExports";

export const getData = async (access_token, endpoint) => {
  const url = `${SPOTIFY_API_BASEURL}${endpoint}`;
  console.log(url);
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + access_token,
      },
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    const data = await response.json();
    return { data, success: true };
  } catch (err) {
    console.error(err);
    return { data: {}, success: false };
  }
};
