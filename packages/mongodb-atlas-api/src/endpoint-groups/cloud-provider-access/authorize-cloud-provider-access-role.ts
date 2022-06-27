import { makeEndpoint } from '../../types';
import { AuthorizedAwsIamRole } from './types';

export type AuthorizeCloudProviderAccessRoleOptions = {
  /**
   * Unique ID of the role to authorize.
   */
  roleId: string;
  /**
   * The cloud provider for which to create a new role. Currently only `AWS` is supported.
   */
  providerName: 'AWS';
  /**
   * Role ARN that Atlas assumes to access your AWS account.
   */
  iamAssumedRoleArn: string;
};

export type AuthorizeCloudProviderAccessRoleResponse = AuthorizedAwsIamRole;

export const authorizeCloudProviderAccessRole = makeEndpoint<
  AuthorizeCloudProviderAccessRoleOptions,
  AuthorizeCloudProviderAccessRoleResponse
>({
  name: 'authorizeCloudProviderAccessRole',
  fn: async ({
    groupId,
    options: { roleId, providerName, iamAssumedRoleArn },
    makeRequest,
  }) => {
    const response = await makeRequest({
      method: 'POST',
      path: `/groups/${groupId}/cloudProviderAccess/${roleId}`,
      body: { providerName, iamAssumedRoleArn },
    });

    return response.data;
  },
});
