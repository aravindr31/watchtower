import { getData } from "../../../../../lib/music";

export const GET = async ({ request, params }) => {
  const authHeader = request.headers.get("authorization");
  const access_token = authHeader.split(" ")[1];
  const { id } = params;

  try {
    const { success, data } = await getData(access_token, `/artists/${id}`);

    if (!success) throw new Error();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(null, { status: 500 });
  }
};
