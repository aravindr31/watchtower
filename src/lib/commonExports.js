// export const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

import { ACCESS_TOKEN, ACCOUNT_ID } from "astro:env/server";

export const tmdbAPI_baseUrl = "https://api.themoviedb.org/3";

export const tmdbAPI_fetchOptions = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
};

export const watchedlistId = "8499444";

export const accountId = ACCOUNT_ID;
