import { TMDB_BASEURL, TMDB_HEADER } from "../../../../lib/commonExports";

const frameUrl = (id) => {
  return `${TMDB_BASEURL}/movie/${id}?append_to_response=credits,videos,images`;
};

export const getMinimalMovieData = async (id) => {
  const url = frameUrl(id);
  try {
    const response = await fetch(url, TMDB_HEADER);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    const responseData = {
      id: result?.id,
      title: result?.title,
      poster_path: result?.poster_path,
      imdb_id: result?.imdb_id,
      vote_average: parseFloat(result?.vote_average.toFixed(1)),
      release_date: new Date(result?.release_date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      success: true,
    };

    return responseData;
  } catch (err) {
    console.error("API Error:", err.message);
    return { success: false, error: err.message };
  }
};

export const GET = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const movieId = reqUrl.searchParams.get("id") || 1;
  const url = frameUrl(movieId);
  try {
    const response = await fetch(url, TMDB_HEADER);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
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
