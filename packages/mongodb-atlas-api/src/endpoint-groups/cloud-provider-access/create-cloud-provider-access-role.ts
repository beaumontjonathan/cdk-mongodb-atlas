import { makeEndpoint } from '../../types';
import { AwsIamRole } from './types';

export type CreateCloudProviderAccessRoleOptions = {
  /**
   * The cloud provider for which to create a new role. Currently only `AWS` is supported.
   */
  providerName: 'AWS';
};

export type CreateCloudProviderAccessRoleResponse = AwsIamRole;

export const createCloudProviderAccessRole = makeEndpoint<
  CreateCloudProviderAccessRoleOptions,
  CreateCloudProviderAccessRoleResponse
>({
  name: 'createCloudProviderAccessRole',
  fn: async ({ groupId, options, makeRequest }) => {
    const response = await makeRequest({
      method: 'POST',
      path: `/groups/${groupId}/cloudProviderAccess`,
      body: options,
    });

    return response.data;
  },
});
