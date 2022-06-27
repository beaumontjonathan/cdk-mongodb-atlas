import { cloudProviderAccess } from './cloud-provider-access';
import { customRoles } from './custom-roles';
import { databaseUsers } from './database-users';
import { projectIpAccessList } from './project-ip-access-list';
import { project } from './projects';
import { serverlessInstances } from './serverless-instances';

export const endpointGroups = {
  cloudProviderAccess,
  customRoles,
  databaseUsers,
  projectIpAccessList,
  project,
  serverlessInstances,
};
