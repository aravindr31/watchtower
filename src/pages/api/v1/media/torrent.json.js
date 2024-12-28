import { YTS_BASEURL } from "../../../../lib/commonExports";

export const GET = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const id = requestUrl.searchParams.get("id");
  const url = `${YTS_BASEURL}/movie_details.json?imdb_id=${id}`;
  try {
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const result = await response.json();
    const data = result?.data;
    if (data.movie.imdb_code == "tt") {
      return new Response(
        JSON.stringify({
          success: false,
          message: `Data Not Found for ${id}`,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
          },
        }
      );
    }
    const responseData = {
      success: true,
      torrents: data?.movie.torrents.map((torrent) =>
        Object.keys(torrent).reduce((acc, key) => {
          if (
            ![
              "size_bytes",
              "date_uploaded",
              "date_uploaded_unix",
              "hash",
            ].includes(key)
          ) {
            acc[key] = torrent[key];
          }
          return acc;
        }, {})
      ),
    };
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
};
