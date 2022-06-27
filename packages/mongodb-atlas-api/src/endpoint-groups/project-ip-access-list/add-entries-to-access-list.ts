import { makeEndpoint } from '../../types';
import { ProjectIpAccessListEntry, NewProjectIpAccessListEntry } from './types';

export type AddEntriesToAccessListOptions = NewProjectIpAccessListEntry[];

export type AddEntriesToAccessListResponse = {
  totalCount: number;
  results: ProjectIpAccessListEntry[];
};

export const addEntriesToAccessList = makeEndpoint<
AddEntriesToAccessListOptions,
AddEntriesToAccessListResponse
>({
  name: 'addEntriesToAccessList',
  fn: async ({ groupId, options, makeRequest }) => {
    const results = await makeRequest({
      method: 'POST',
      path: `/groups/${groupId}/accessList`,
      body: options,
    });

    return results.data;
  },
});
