import { spotify } from "../../../../lib/authdata";

export const GET = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) return;
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(spotify.CLIENT_ID + ":" + spotify.CLIENT_SECRET).toString(
            "base64"
          ),
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: spotify.REDIRECT_URL,
        grant_type: "authorization_code",
      }),
    });
    if (!response.ok) throw new Error("Failed to fetch access-token");
    const data = await response.json();
    // const { access_token, refresh_token } = data;
    // console.log(data);
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (err) {
    console.log(err);
    return new Response(null, { status: 500 });
  }
};
