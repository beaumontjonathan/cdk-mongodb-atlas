import { makeEndpoint } from '../../types';
import { ProjectIpAccessListEntry, ProjectIpAccessListEntryKey } from './types';
import { getEncodedAccessListEntryKey } from './helpers';

export type GetOneAccessListEntryOptions = ProjectIpAccessListEntryKey;

export type GetOneAccessListEntryResponse = ProjectIpAccessListEntry;

export const getOneAccessListEntry = makeEndpoint<
GetOneAccessListEntryOptions,
GetOneAccessListEntryResponse
>({
  name: 'getOneAccessListEntry',
  fn: async ({ groupId, options, makeRequest }) => {
    const results = await makeRequest({
      method: 'GET',
      path: `/groups/${groupId}/accessList/${getEncodedAccessListEntryKey(options)}`,
    });

    return results.data;
  },
});
