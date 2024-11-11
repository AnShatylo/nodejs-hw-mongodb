import contactsCollection from '../db/models/Contacts.js';

import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
}) => {
  const query = contactsCollection.find();

  const totalItems = await contactsCollection
    .find()
    .merge(query)
    .countDocuments();

  const skip = (page - 1) * perPage;
  const data = await query
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const paginationData = calculatePaginationData({ totalItems, page, perPage });

  return {
    data,
    ...paginationData,
  };
};

export const getContactById = (id) => contactsCollection.findById(id);

export const addContact = (payload) => contactsCollection.create(payload);

export const updateContact = async ({ _id, payload, options = {} }) => {
  const rawResult = await contactsCollection.findOneAndUpdate(
    { _id },
    payload,
    {
      ...options,
      new: true,
      includeResultMetadata: true,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteContact = (filter) =>
  contactsCollection.findOneAndDelete(filter);
