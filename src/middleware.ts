import { defineMiddleware } from "astro:middleware";
import { generateToken, verifyToken, authUrl } from "./lib/authdata";

export const onRequest = defineMiddleware(
  async ({ request, url, cookies, redirect, rewrite }, next) => {
    if (
      url.pathname == "/api/v1/auth/markaswatched" ||
      url.pathname == "/api/v1/media/torrent.json"
    ) {
      try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader)
          throw new Error(
            "Unauthorised request - missing Authorization header"
          );
        const token = authHeader?.split(" ")[1];
        if (token == null)
          throw new Error("Unauthorised request - access token required");

        await verifyToken(token);
        return next();
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ valid: false, error: err }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (url.pathname == "/authorize") {
      try {
        const cookies = request.headers.get("cookie");
        const accessToken = cookies
          ?.split(";")
          .find((cookie) => cookie.startsWith("access-token"));
        const token = accessToken ? accessToken.split("=")[1] : null;
        const referer = request.headers.get("referer");

        if (token) {
          await verifyToken(token);
          return redirect(referer || "/", 302);
        } else return next();
      } catch (err) {
        console.error("invalid totp code");
        return next();
      }
    }

    if (url.pathname === "/api/v1/auth/verifytoken") {
      const response = await next();

      try {
        const { valid } = await response.json();

        if (valid) {
          const jwt = await generateToken();
          cookies.set("access-token", jwt, {
            httpOnly: false,
            path: "/",
            maxAge: 3600,
            sameSite: "strict",
          });
        }
        const responseObject = {
          statusCode: valid == true ? 201 : 401,
          message: valid == true ? "success" : "Invalid Passcode",
        };
        return new Response(
          JSON.stringify({ valid, message: responseObject.message }),
          {
            status: responseObject.statusCode,
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (err) {
        console.error("Error processing response:", err);
        return new Response(
          JSON.stringify({ error: "Internal server error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    if (url.pathname == "/music") {
      const getAuthorized = url.searchParams.get("getAuthorized") || false;
      console.log(getAuthorized);
      const access_token = cookies.get("access-token")?.boolean || false;
      try {
        if (!access_token) return rewrite("/403");
        const spotify_access_token =
          cookies.get("spotify-access-token")?.boolean || false;

        url.searchParams.delete("getAuthorized");
        if (!spotify_access_token && !getAuthorized) return redirect("/", 301);
        if (!spotify_access_token && getAuthorized) {
          console.log("Unauthorised request");
          const redirectUrl = authUrl();
          return Response.redirect(redirectUrl, 301);
        }
        return await next();
      } catch (error) {
        console.log(error);
      }
    }

    if (url.pathname.includes("/api/v1/music/")) {
      try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader || authHeader.split(" ")[1] == "undefined") {
          console.warn("Unauthorised request");
          return new Response(JSON.stringify({}), {
            status: 302,
            headers: { Location: `${url.origin}` },
          });
        }
        return next();
      } catch (error) {
        console.log(error);
      }
    }

    if (url.pathname == "/api/v1/auth/spotifyauth") {
      const response = await next();
      try {
        if (!response.ok) throw new Error();
        const { access_token, refresh_token, expires_in, scope } =
          await response.json();
        cookies.set("spotify-access-token", access_token, {
          httpOnly: false,
          path: "/",
          maxAge: 3600,
          sameSite: "strict",
        });
        cookies.set("spotify-refresh-token", refresh_token, {
          httpOnly: false,
          path: "/",
          maxAge: 3600,
          sameSite: "strict",
        });
        return redirect(`${url.origin}`, 302);
      } catch (err) {
        console.log("inisde error");
        console.log(err);
        return new Response(null, { status: 500 });
      }
    }
    return next();
  }
);
