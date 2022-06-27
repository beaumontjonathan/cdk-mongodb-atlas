import { makeEndpoint } from '../../types';
import { AwsIamRole } from './types';

export type GetAllCloudProviderAccessRolesOptions = void;

export type GetAllCloudProviderAccessRolesResponse = {
  awsIamRoles: AwsIamRole[];
};

export const getAllCloudProviderAccessRoles = makeEndpoint<
  GetAllCloudProviderAccessRolesOptions,
  GetAllCloudProviderAccessRolesResponse
>({
  name: 'getAllCloudProviderAccessRoles',
  fn: async ({ groupId, makeRequest }) => {
    const response = await makeRequest({
      method: 'GET',
      path: `/groups/${groupId}/cloudProviderAccess`,
    });

    return response.data;
  },
});
