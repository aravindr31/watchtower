import {
  JWT_ISSUER,
  JWT_AUDIENCE,
  JWT_EXPIRATION_TIME,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URL,
} from "astro:env/server";

import { jwtVerify, SignJWT } from "jose";
import { AuthCollection } from "./db";

export const spotify = {
  BASEURL: "https://accounts.spotify.com/authorize",
  SCOPES: [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-read-private",
    "user-read-email",
    "user-follow-read",
  ],
  REDIRECT_URL: SPOTIFY_REDIRECT_URL,
  CLIENT_ID: SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: SPOTIFY_CLIENT_SECRET,
};

const getAuthCollection = async () => {
  return await AuthCollection();
};

export const getAccountSecret = async () => {
  try {
    const collection = await getAuthCollection();
    const data = await collection
      .find(
        {
          type: "SECRET",
        },
        { projection: { _id: 0, data: 1 } }
      )
      .toArray();
    return data[0].data;
  } catch (err) {
    console.log(err);
  }
};

const secret = new TextEncoder().encode(await getAccountSecret().data);

const alg = "HS256";

export const verifyToken = async (token) => {
  try {
    const verifed = await jwtVerify(token, secret, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    return verifed.payload;
  } catch (err) {
    throw new Error(err.code);
  }
};

export const generateToken = async () => {
  return await new SignJWT({ "urn:watchtower:admin": true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setExpirationTime(JWT_EXPIRATION_TIME)
    .sign(secret);
};

export const authUrl = () => {
  return `${spotify.BASEURL}?client_id=${spotify.CLIENT_ID}&redirect_uri=${
    spotify.REDIRECT_URL
  }&scope=${spotify.SCOPES.join("%20")}&response_type=code&show_dialog=true`;
};
