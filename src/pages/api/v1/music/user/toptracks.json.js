import { getData } from "../../../../../lib/music";

export const GET = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  const access_token = authHeader.split(" ")[1];
  try {
    const { success, data } = await getData(
      access_token,
      "/me/top/tracks?time_range=short_term&limit=10"
    );
    const playerData = await getData(access_token, `/me/player`);
    if (!success) throw new Error();
    const minifiedData = data.items.map((track) => ({
      id: track.id,
      now_playing: playerData.success
        ? playerData.data.item.id == track.id
          ? true
          : false
        : false,
      duration: new Date(track.duration_ms)
        .toISOString()
        .split("T")[1]
        .substring(0, 8),
      album: {
        id: track.album.id,
        name: track.album.name,
        images: track.album.images,
      },
      artists: track.artists.map((artist) => ({
        id: artist.id,
        name: artist.name,
      })),
      name: track.name,
    }));
    return new Response(JSON.stringify(minifiedData), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response(null, { status: 500 });
  }
};
