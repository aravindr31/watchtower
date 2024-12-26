import { getPageWiseShows } from "../../../../lib/shows";

export const GET = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const page = reqUrl.searchParams.get("page") || 1;
  const shows = await getPageWiseShows(page);
  if (!shows) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(shows), {
    status: 200,
  });
};
