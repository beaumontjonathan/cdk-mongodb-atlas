import { makeEndpoint } from '../../types';
import { ProjectIpAccessListEntryKey } from './types';
import { getEncodedAccessListEntryKey } from './helpers';

export type GetOneAccessListEntryStatusOptions = ProjectIpAccessListEntryKey;

export type GetOneAccessListEntryStatusResponse = {
  /**
   * State of the access list entry when Atlas made this request:
   *
   * ACTIVE
   *     Access list entry is live on all relevant cloud providers.
   * PENDING
   *     Atlas is adding the access list entry. The access list entry is not yet active.
   * FAILED
   *     Atlas couldn't successfully add the access list entry.
   */
  status: 'ACTIVE' | 'PENDING' | 'FAILED';
};

export const getOneAccessListEntryStatus = makeEndpoint<
GetOneAccessListEntryStatusOptions,
GetOneAccessListEntryStatusResponse
>({
  name: 'getOneAccessListEntryStatus',
  fn: async ({ groupId, options, makeRequest }) => {
    const results = await makeRequest({
      method: 'GET',
      path: `/groups/${groupId}/accessList/${getEncodedAccessListEntryKey(options)}/status`,
    });

    return results.data;
  },
});
