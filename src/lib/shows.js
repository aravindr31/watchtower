import { ShowCollection } from "./db";

export const getAllShows = async () => {
  const showData = await (await ShowCollection()).find({}).toArray();
  return showData;
};

export const createShow = async (newShow) => {
  try {
    const collection = await ShowCollection();
    const result = await collection.insertOne(newShow);
    return result;
  } catch (error) {
    console.error("Error creating movie:", error.message);
    throw new Error("Failed to create movie.");
  }
};

export const getPageWiseShows = async (page) => {
  const pageSize = 20;
  const skipCount = (page - 1) * pageSize;

  const totalItems = await (await ShowCollection()).countDocuments();

  const showData = await (await ShowCollection())
    .find({})
    .sort({ _id: -1 })
    .skip(skipCount)
    .limit(pageSize)
    .toArray();

  return {
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    shows: showData,
  };
};
