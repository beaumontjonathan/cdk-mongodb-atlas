import { makeEndpointGroup } from '../../types';
import { createDatabaseUser } from './create-database-user';
import { deleteDatabaseUser } from './delete-database-user';
import { getOneDatabaseUser } from './get-one-database-user';
import { updateDatabaseUser } from './update-database-user';

export const databaseUsers = makeEndpointGroup({
  createDatabaseUser,
  deleteDatabaseUser,
  getOneDatabaseUser,
  updateDatabaseUser,
});
