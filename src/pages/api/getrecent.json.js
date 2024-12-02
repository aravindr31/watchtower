import {
  TMDB_BASEURL,
  TMDB_HEADER,
  watchedlistId,
} from "../../lib/commonExports";

export const GET = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const pageValue = reqUrl.searchParams.get("page") || 1;

  const url = `${TMDB_BASEURL}/list/${watchedlistId}?sort_by=created_at.asc&page=${pageValue}`;

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
