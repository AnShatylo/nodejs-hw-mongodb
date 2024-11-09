import contactsCollection from '../db/models/Contacts.js';

export const getAllContacts = () => contactsCollection.find();

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
