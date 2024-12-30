import { getData } from "../../../../../lib/music";

export const GET = async ({ request, params }) => {
  const authHeader = request.headers.get("authorization");
  const access_token = authHeader.split(" ")[1];
  const { id } = params;
  console.log("album-id - ", id);
  try {
    const { success, data } = await getData(access_token, `/albums/${id}`);
    const playerData = await getData(access_token, `/me/player`);
    console.log(playerData);
    if (!success) throw new Error();
    const minifiedData = {
      name: data.name,
      id: data.id,
      images: data.images,
      tracks: data.tracks.items.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.album_type,
        track_number: item.track_number,
        now_playing: playerData.success
          ? playerData.data.item.id == item.id
            ? true
            : false
          : false,
        duration: new Date(item.duration_ms)
          .toISOString()
          .split("T")[1]
          .substring(0, 8),
        artists: item.artists.map((artist) => ({
          id: artist.id,
          name: artist.name,
        })),
      })),
    };
    return new Response(JSON.stringify(minifiedData), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(null, { status: 500 });
  }
};
