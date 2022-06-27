import { makeEndpoint } from '../../types';
import { ProjectIpAccessListEntryKey } from './types';
import { getEncodedAccessListEntryKey } from './helpers';

export type DeleteOneAccessListEntryOptions = ProjectIpAccessListEntryKey;

export type DeleteOneAccessListEntryResponse = void;

export const deleteOneAccessListEntry = makeEndpoint<
DeleteOneAccessListEntryOptions,
DeleteOneAccessListEntryResponse
>({
  name: 'deleteOneAccessListEntry',
  fn: async ({ groupId, options, makeRequest }) => {
    const results = await makeRequest({
      method: 'DELETE',
      path: `/groups/${groupId}/accessList/${getEncodedAccessListEntryKey(options)}`,
    });

    if (results.status !== 204) {
      throw new Error('Unable to delete access list entry');
    }
  },
});
