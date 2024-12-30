import { ACCESS_TOKEN, ACCOUNT_ID } from "astro:env/server";

export const TMDB_BASEURL = "https://api.themoviedb.org/3";

export const YTS_BASEURL = "https://yts.mx/api/v2";

export const SPOTIFY_API_BASEURL = "https://api.spotify.com/v1";

export const TMDB_HEADER = {
  headers: {
    accept: "application/json",
    "content-type": "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

export const watchedlistId = "8499444";

export const accountId = ACCOUNT_ID;
