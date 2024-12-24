import { checkIfShowExists } from "../../lib/shows";
import { checkIfMovieExists } from "../../lib/movies";

export const checkIfExists = async (selector, data) => {
  return selector === "movie"
    ? await checkIfMovieExists(data)
    : selector === "tv"
    ? await checkIfShowExists(data)
    : null;
};

export const POST = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const selector = reqUrl.searchParams.get("checkon") || 1;
  const data = await request.json();
  const checkedIds = await checkIfExists(selector, data);
  return new Response(JSON.stringify(checkedIds), {
    status: 200,
  });
};
