import { defineMiddleware } from "astro:middleware";
import { generateToken, verifyToken } from "./lib/authdata";

export const onRequest = defineMiddleware(
  async ({ request, url, cookies, redirect }, next) => {
    if (url.pathname == "/api/markaswatched") {
      try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader)
          throw new Error(
            "Unauthorised request - missing Authorization header"
          );
        const token = authHeader.split(" ")[1];
        if (token == null)
          throw new Error("Unauthorised request - access token required");

        await verifyToken(token);
        return next();
      } catch (err) {
        console.log(err);
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
        console.log("token invalid");
        return next();
      }
    }

    if (url.pathname === "/api/auth") {
      const response = await next();

      try {
        const { valid } = await response.json();

        if (valid) {
          const jwt = await generateToken();
          console.log("Generated JWT:", jwt);

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

    return next();
  }
);
