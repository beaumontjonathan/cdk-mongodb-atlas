import { makeEndpoint } from '../../types';
import { ServerlessInstance } from './types';

export type CreateOneOptions = {
  /**
   * Human-readable label that identifies the serverless instance.
   */
  name: string;
} & Pick<ServerlessInstance, 'providerSettings' | 'serverlessBackupOptions'>;

export type CreateOneResponse = ServerlessInstance;

export const createOne = makeEndpoint<CreateOneOptions, CreateOneResponse>({
  name: 'createOne',
  fn: async ({ groupId, options, makeRequest }) => {
    const response = await makeRequest({
      method: 'POST',
      path: `/groups/${groupId}/serverless`,
      body: options,
    });

    return response.data;
  },
});
