import { ShowCollection } from "./db";

const getShowCollection = async () => {
  return await ShowCollection();
};

export const getAllShows = async () => {
  try {
    const collection = await getShowCollection();
    const totalItems = await collection.countDocuments();
    return totalItems;
  } catch (err) {
    console.log("Error Fetching all shows", err.message);
    throw new Error(err);
  }
};

export const checkIfShowExists = async (idList) => {
  try {
    if (idList.length > 0) {
      const collection = await getShowCollection();
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
    throw new Error("Error checking ids", error);
  }
};

export const createShow = async (newShow) => {
  try {
    const collection = await ShowCollection();
    const result = await collection.insertMany(newShow);
    return result;
  } catch (error) {
    console.error("Error creating show:", error.message);
  }
};

export const getPageWiseShows = async (page) => {
  try {
    const pageSize = 24;
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
      totalItems: totalItems,
    };
  } catch (err) {
    console.log("Error Fetching page-wise shows", err.message);
    // throw new Error("failed to fetch page-wise shows");
  }
};
