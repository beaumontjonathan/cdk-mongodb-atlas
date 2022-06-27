import { makeEndpoint } from '../../types';

export type DeleteDatabaseUserOptions = {
  databaseName: string;
  username: string;
};

export type DeleteDatabaseUserResponse = void;

export const deleteDatabaseUser = makeEndpoint<
  DeleteDatabaseUserOptions,
  DeleteDatabaseUserResponse
>({
  name: 'deleteDatabaseUser',
  fn: async ({ groupId, options: { databaseName, username }, makeRequest }) => {
    const response = await makeRequest({
      method: 'DELETE',
      path: `/groups/${groupId}/databaseUsers/${databaseName}/${encodeURIComponent(
        username,
      )}`,
    });

    const isSuccess = response.status >= 200 && response.status < 300;

    if (!isSuccess) {
      console.log(response);
      throw new Error('Unable to delete user');
    }
  },
});
