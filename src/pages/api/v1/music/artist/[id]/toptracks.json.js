import { getData } from "../../../../../../lib/music";

export const GET = async ({ request, params }) => {
  const authHeader = request.headers.get("authorization");
  const access_token = authHeader.split(" ")[1];
  const { id } = params;
  try {
    const { success, data } = await getData(
      access_token,
      `/artists/${id}/top-tracks`
    );

    if (!success) throw new Error();
    const minifiedData = data.tracks.map((track) => ({
      id: track.id,
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
