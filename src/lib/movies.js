import { MovieCollection } from "./db";

const getMovieCollection = async () => {
  return await MovieCollection();
};

export const getAllMovies = async () => {
  try {
    const collection = await getMovieCollection();
    const totalItems = await collection.countDocuments();
    const movieData = await collection.find({}).toArray();
    return {
      movies: movieData,
      totalItems,
    };
  } catch (err) {
    console.log("Error Fetching all movies", err.message);
    throw new Error("failed to fetch all movies");
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
