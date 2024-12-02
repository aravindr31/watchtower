import {
  tmdbAPI_baseUrl,
  tmdbAPI_fetchOptions,
  accountId,
} from "../../lib/commonExports";

export const GET = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const movieId = reqUrl.searchParams.get("id") || 1;

  const url = `${tmdbAPI_baseUrl}/tv/${movieId}?append_to_response=credits,videos,images`;
  try {
    const response = await fetch(url, tmdbAPI_fetchOptions);
    console.log("from getmovies");
    console.log(response);
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
