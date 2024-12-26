import { getPageWiseMovies } from "../../../../lib/movies";

export const GET = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const page = reqUrl.searchParams.get("page") || 1;
  const movies = await getPageWiseMovies(page);
  if (!movies) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  return new Response(JSON.stringify(movies), {
    status: 200,
  });
};
