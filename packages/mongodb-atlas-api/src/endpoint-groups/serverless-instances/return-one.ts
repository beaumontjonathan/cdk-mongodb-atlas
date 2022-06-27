import { makeEndpoint } from '../../types';
import { ServerlessInstance } from './types';

export type ReturnOneOptions = {
  instanceName: string;
};

export type ReturnOneResponse = ServerlessInstance;

export const returnOne = makeEndpoint<ReturnOneOptions, ReturnOneResponse>({
  name: 'returnOne',
  fn: async ({ options: { instanceName }, groupId, makeRequest }) => {
    const response = await makeRequest({
      method: 'GET',
      path: `/groups/${groupId}/serverless/${instanceName}`,
    });

    return response.data;
  },
});
