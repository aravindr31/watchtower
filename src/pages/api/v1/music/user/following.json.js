import { getData } from "../../../../../lib/music";

export const GET = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  const access_token = authHeader.split(" ")[1];
  try {
    const { success, data } = await getData(
      access_token,
      "/me/following?type=artist"
    );
    if (!success) throw new Error();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(null, { status: 500 });
  }
};
