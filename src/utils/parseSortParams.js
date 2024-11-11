import { SORT_ORDER, allowedSortBy } from '../constants/contacts.js';

export const parseSortParams = ({ sortBy, sortOrder }) => {
  const allowedSortOrders = Object.values(SORT_ORDER);
  const parsedSortOrder = allowedSortOrders.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER.ASC;
  const parsedSortBy = allowedSortBy.includes(sortBy) ? sortBy : '_id';

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
