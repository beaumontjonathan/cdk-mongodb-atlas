import { makeEndpoint } from '../../types';
import { DatabaseUser } from './types';

export type CreateDatabaseUserOptions = Omit<DatabaseUser, 'groupId'>;

export type CreateDatabaseUserResponse = DatabaseUser;

export const createDatabaseUser = makeEndpoint<
CreateDatabaseUserOptions,
CreateDatabaseUserResponse
>({
  name: 'createDatabaseUser',
  fn: async ({ groupId, options, makeRequest }) => {
    const response = await makeRequest({
      method: 'POST',
      path: `/groups/${groupId}/databaseUsers`,
      body: { ...options, groupId },
    });

    return response.data;
  },
});
