import { TMDB_BASEURL, TMDB_HEADER, accountId } from "../../lib/commonExports";
import { checkIfExists } from "./checkids.json";
import { addToDB } from "./dbdata.json";
import { getMinimalMovieData } from "./getmdetail.json";
import { getMinimalTvData } from "./getsdetail.json";

const dbInsert = async (selector, id) => {
  const idCheck = await checkIfExists(selector, [id]);
  if (idCheck.length > 0) {
    const dataToInsert =
      selector == "movie"
        ? await getMinimalMovieData(id)
        : selector == "tv"
        ? await getMinimalTvData(id)
        : null;

    return await addToDB(selector, [dataToInsert]);
  }
};

export const POST = async ({ request }) => {
  const data = await request.json();
  const requestBody = {
    media_type: data.media,
    media_id: parseInt(data.id),
    watchlist: true,
  };
  const url = `${TMDB_BASEURL}/account/${accountId}/watchlist`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: TMDB_HEADER.headers,
      body: JSON.stringify(requestBody),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        `Error: ${response.status} - ${response.statusText} - ${result.status_message}`
      );
    }
    const dbResponse = await dbInsert(data.media, data.id);
    if (!dbResponse.acknowledged) {
      throw new Error(`Error: ${dbResponse.status} - ${dbResponse.statusText}`);
    }
    const responseData = { ...result, success: true };

    return new Response(JSON.stringify(responseData), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (err) {
    console.error("API Error:", err.message);

    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        status: 500,
      }
    );
  }
};
