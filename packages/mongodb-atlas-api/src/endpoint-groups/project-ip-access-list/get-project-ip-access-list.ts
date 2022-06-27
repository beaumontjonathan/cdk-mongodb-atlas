import { makeEndpoint } from '../../types';
import { ProjectIpAccessListEntry } from './types';

export type GetProjectIpAccessListOptions = void;

export type GetProjectIpAccessListResponse = {
  totalCount: number;
  results: ProjectIpAccessListEntry[];
};

export const getProjectIpAccessList = makeEndpoint<
GetProjectIpAccessListOptions,
GetProjectIpAccessListResponse
>({
  name: 'getProjectIpAccessList',
  fn: async ({ groupId, makeRequest }) => {
    const results = await makeRequest({
      method: 'GET',
      path: `/groups/${groupId}/accessList`,
    });

    return results.data;
  },
});
