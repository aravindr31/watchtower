import { ShowCollection } from "./db";

const getShowCollection = async () => {
  return await ShowCollection();
};

export const getAllShows = async () => {
  try {
    const collection = await getShowCollection();
    const totalItems = await collection.countDocuments();
    const showData = await collection.find({}).toArray();
    return {
      totalItems,
      shows: showData,
    };
  } catch (err) {
    console.log("Error Fetching all shows", err.message);
    throw new Error("failed to fetch all shows");
  }
};

export const createShow = async (newShow) => {
  try {
    const collection = await ShowCollection();
    const result = await collection.insertOne(newShow);
    return result;
  } catch (error) {
    console.error("Error creating show:", error.message);
    throw new Error("Failed to create show.");
  }
};

export const getPageWiseShows = async (page) => {
  try {
    const pageSize = 20;
    const skipCount = (page - 1) * pageSize;
    const collection = await ShowCollection();
    const totalItems = await collection.countDocuments();

    const showData = await collection
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
  } catch (err) {
    console.log("Error Fetching page-wise shows", err.message);
    throw new Error("failed to fetch page-wise shows");
  }
};
