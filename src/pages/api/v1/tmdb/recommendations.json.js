import {
  TMDB_BASEURL,
  TMDB_HEADER,
  accountId,
} from "../../../../lib/commonExports";

export const GET = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const id = reqUrl.searchParams.get("id") || 1;
  const media_type = reqUrl.searchParams.get("media") || "";

  const url = `${TMDB_BASEURL}/${media_type}/${id}/recommendations?language=en-US&page=1`;
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
