import { makeEndpoint } from '../../types';
import { DatabaseUser } from './types';

export type GetOneDatabaseUserOptions = {
  databaseName: string;
  username: string;
};

export type GetOneDatabaseUserResponse = DatabaseUser | null;

export const getOneDatabaseUser = makeEndpoint<
  GetOneDatabaseUserOptions,
  GetOneDatabaseUserResponse
>({
  name: 'getOneDatabaseUser',
  fn: async ({ groupId, options: { databaseName, username }, makeRequest }) => {
    try {
      const response = await makeRequest({
        method: 'GET',
        path: `/groups/${groupId}/databaseUsers/${databaseName}/${encodeURIComponent(
          username,
        )}`,
      });

      return response.data;
    } catch (error) {
      if ((error as Error).message.includes('404')) {
        return null;
      }

      throw error;
    }
  },
});
