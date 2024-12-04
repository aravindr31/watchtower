import { MovieCollection } from "./db";

const getMovieCollection = async () => {
  return await MovieCollection();
};

export const getAllMovies = async () => {
  try {
    const collection = await getMovieCollection();
    const totalItems = await collection.countDocuments();
    return totalItems;
  } catch (err) {
    console.log("Error Fetching all movies", err.message);
    throw new Error("failed to fetch all movies");
  }
};

export const checkIfMovieExists = async (idList) => {
  try {
    if (idList.length > 0) {
      const collection = await getMovieCollection();
      const query = { id: { $in: idList } };
      const matchingMovies = await collection
        .find(query, { projection: { _id: 0, id: 1 } })
        .toArray();
      const existingIds = matchingMovies.map((item) => item.id);
      const newIds = idList.filter((id) => !existingIds.includes(id));
      return newIds;
    } else {
      throw new Error("idList is empty");
    }
  } catch (error) {
    console.log("Error checking ids -", err.message);
    throw new Error("Error checking ids");
  }
};

export const createMovie = async (newMovie) => {
  try {
    const collection = await getMovieCollection();
    const result = await collection.insertOne(newMovie);
    return result;
  } catch (error) {
    console.error("Error creating movie:", error.message);
    throw new Error("Failed to create movie.");
  }
};

export const getPageWiseMovies = async (page) => {
  try {
    const pageSize = 20;
    const skipCount = (page - 1) * pageSize;
    const collection = await getMovieCollection();
    const totalItems = await collection.countDocuments();

    const movieData = await collection
      .find({})
      .sort({ _id: -1 })
      .skip(skipCount)
      .limit(pageSize)
      .toArray();

    return {
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
      movies: movieData,
    };
  } catch (err) {
    console.log("Error Fetching page-wise movies", err.message);
    throw new Error("failed to fetch page-wise movies");
  }
};
