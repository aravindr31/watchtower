import { checkIfShowExists } from "../../lib/shows";
import { checkIfMovieExists } from "../../lib/movies";

export const POST = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const selector = reqUrl.searchParams.get("checkon") || 1;
  const data = await request.json();
  const checkedIds =
    selector === "movie"
      ? await checkIfMovieExists(data)
      : selector === "show"
      ? await checkIfShowExists(data)
      : null;
  return new Response(JSON.stringify(checkedIds), {
    status: 200,
  });
};
