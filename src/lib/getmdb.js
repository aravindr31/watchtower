export const getAllMovies = async (page) => {
  const pageSize = 20; // Number of items per page
  const skipCount = (page - 1) * pageSize; // Calculate the number of items to skip

  const movieData = await (
    await MovieCollection()
  )
    .find({})
    .skip(skipCount) // Skip the appropriate number of items
    .limit(pageSize) // Limit the number of items to the page size
    .toArray();

  return movieData;
};
