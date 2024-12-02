import { createMovie, getAllMovies } from "../../lib/movies";

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

  return new Response(JSON.stringify(movies), {
    status: 200,
  });
};

export const POST = async ({ request }) => {
  const newMovie = await request.json();
  const movie = await createMovie(newMovie);
  return new Response(JSON.stringify(movie), {
    status: 200,
  });
};
