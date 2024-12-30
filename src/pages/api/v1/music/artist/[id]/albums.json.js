import { getData } from "../../../../../../lib/music";

export const GET = async ({ request, params }) => {
  const authHeader = request.headers.get("authorization");
  const access_token = authHeader.split(" ")[1];
  const { id } = params;
  try {
    const { success, data } = await getData(
      access_token,
      `/artists/${id}/albums?include_groups=single%2Calbum`
    );

    if (!success) throw new Error();
    const minifiedData = data.items.map((item) => ({
      id: item.id,
      images: item.images,
      name: item.name,
      type: item.album_type,
      // artist_ids: item.artists.map((artist) => artist.id),
    }));
    return new Response(JSON.stringify(minifiedData), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(null, { status: 500 });
  }
};
