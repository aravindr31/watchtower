import { checkIfShowExists } from "../../../../lib/shows";
import { checkIfMovieExists } from "../../../../lib/movies";

export const checkIfExists = async (selector, ids) => {
  try {
    const data =
      selector === "movie"
        ? await checkIfMovieExists(ids)
        : selector === "tv"
        ? await checkIfShowExists(ids)
        : null;
    return data;
  } catch (err) {
    console.log("Error While checking for media existance");
    throw new Error(err);
  }
};

export const POST = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const selector = reqUrl.searchParams.get("checkon");
  const data = await request.json();
  const checkedIds =
    selector != null ? await checkIfExists(selector, data) : null;
  return new Response(JSON.stringify(checkedIds), {
    status: 200,
  });
};
