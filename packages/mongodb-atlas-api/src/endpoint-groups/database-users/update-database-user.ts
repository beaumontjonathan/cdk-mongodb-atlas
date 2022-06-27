import { makeEndpoint } from '../../types';
import { DatabaseUser } from './types';

export type UpdateDatabaseUserOptions = Pick<
  DatabaseUser,
  | 'deleteAfterDate'
  | 'labels'
  | 'roles'
  | 'scopes'
  | 'databaseName'
  | 'username'
>;

export type UpdateDatabaseUserResponse = DatabaseUser;

export const updateDatabaseUser = makeEndpoint<
  UpdateDatabaseUserOptions,
  UpdateDatabaseUserResponse
>({
  name: 'updateDatabaseUser',
  fn: async ({
    groupId,
    options: { deleteAfterDate, labels, roles, scopes, databaseName, username },
    makeRequest,
  }) => {
    const response = await makeRequest({
      method: 'PATCH',
      path: `/groups/${groupId}/databaseUsers/${databaseName}/${encodeURIComponent(
        username,
      )}`,
      body: { deleteAfterDate, labels, roles, scopes },
    });

    return response.data;
  },
});
