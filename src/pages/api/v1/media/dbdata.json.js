import { createMovie, getAllMovies } from "../../../../lib/movies";
import { createShow, getAllShows } from "../../../../lib/shows";

export const addToDB = async (selector, data) => {
  return selector === "movie"
    ? await createMovie(data)
    : selector === "tv"
    ? await createShow(data)
    : null;
};

export const GET = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const page = reqUrl.searchParams.get("page") || 1;
  const movies = await getAllMovies(page);
  if (!movies) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }
  const shows = await getAllShows(page);
  if (!shows) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }
  return new Response(JSON.stringify({ movies, shows }), {
    status: 200,
  });
};

export const POST = async ({ request }) => {
  const reqUrl = new URL(request.url);
  const selector = reqUrl.searchParams.get("insert") || 1;
  const data = await request.json();
  const dataAdded = await addToDB(selector, data);
  return new Response(JSON.stringify(dataAdded), {
    status: 200,
  });
};
