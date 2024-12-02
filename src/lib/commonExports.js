import { ACCESS_TOKEN, ACCOUNT_ID } from "astro:env/server";

export const TMDB_BASEURL = "https://api.themoviedb.org/3";

export const TMDB_HEADER = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

export const watchedlistId = "8499444";

export const accountId = ACCOUNT_ID;
