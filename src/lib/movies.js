import { MovieCollection } from "./db";

export const getAllMovies = async () => {
  const movieData = await (await MovieCollection()).find({}).toArray();
  return movieData;
};

export const createMovie = async (newMovie) => {
  try {
    const collection = await MovieCollection();
    const result = await collection.insertOne(newMovie);
    return result;
  } catch (error) {
    console.error("Error creating movie:", error.message);
    throw new Error("Failed to create movie.");
  }
};

export const getPageWiseMovies = async (page) => {
  const pageSize = 20;
  const skipCount = (page - 1) * pageSize;

  const totalItems = await (await MovieCollection()).countDocuments();

  const movieData = await (await MovieCollection())
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
};
