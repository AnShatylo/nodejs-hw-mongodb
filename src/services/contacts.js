import contactsCollection from '../db/models/Contacts.js';

export const getAllContacts = () => contactsCollection.find();

export const getContactById = (id) => contactsCollection.findById(id);
