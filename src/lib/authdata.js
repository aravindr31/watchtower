import {
  JWT_ISSUER,
  JWT_AUDIENCE,
  JWT_EXPIRATION_TIME,
} from "astro:env/server";
import { jwtVerify, SignJWT } from "jose";
import { AuthCollection } from "./db";

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
