import { CdkCustomResourceHandler } from 'aws-lambda';
import { api } from '@beaumontjonathan/mongodb-atlas-api';
import { Properties } from '../types';
import { getDigestFromSsm } from '../../../helpers/ssm';

export const handler: CdkCustomResourceHandler = async (event) => {
  console.log('Event 👉', event);

  const properties = event.ResourceProperties as unknown as Properties;
  const digestAuth = await getDigestFromSsm(
    properties.credentials.mongoDbDigestAuthParameterName,
  );

  const client = api({
    digestAuth,
    groupId: properties.credentials.groupId,
  });

  switch (event.RequestType) {
    case 'Create': {
      const existingUser = await client.databaseUsers.getOneDatabaseUser({
        databaseName: '$external',
        username: properties.arn,
      });

      if (existingUser) {
        throw new Error('Only one mongodb user can be assigned to an ARN');
      }

      const newUser = await client.databaseUsers.createDatabaseUser({
        databaseName: '$external',
        roles: properties.roles.map((role) => ({
          roleName: role.name,
          databaseName: role.databaseName,
          collectionName: role.collectionName,
        })),
        username: properties.arn,
        awsIAMType: 'ROLE',
      });

      console.log(newUser);

      const createAtlasAccessRoleResult = await client.cloudProviderAccess
        .createCloudProviderAccessRole({
          providerName: 'AWS',
        });

      await client.cloudProviderAccess.authorizeCloudProviderAccessRole({
        providerName: 'AWS',
        roleId: createAtlasAccessRoleResult.roleId,
        iamAssumedRoleArn: properties.arn,
      });

      console.log({
        mongoDbUser: newUser,
        atlasRoleId: createAtlasAccessRoleResult.roleId,
        atlasAwsAccountArn: createAtlasAccessRoleResult.atlasAWSAccountArn,
      });

      return {
        Data: {
          mongoDbUser: newUser,
          atlasRoleId: createAtlasAccessRoleResult.roleId,
          atlasAwsAccountArn: createAtlasAccessRoleResult.atlasAWSAccountArn,
        },
      };
    }
    case 'Update': {
      console.log(
        'Update!',
        event.OldResourceProperties,
        event.ResourceProperties,
      );

      const existingUser = await client.databaseUsers.getOneDatabaseUser({
        databaseName: '$external',
        username: properties.arn,
      });

      if (!existingUser) {
        throw new Error('No mongodb user can be assigned to an ARN');
      }

      const newUser = await client.databaseUsers.updateDatabaseUser({
        databaseName: '$external',
        username: properties.arn,
        roles: properties.roles.map((role) => ({
          roleName: role.name,
          databaseName: role.databaseName,
          collectionName: role.collectionName,
        })),
      });

      console.log(existingUser, newUser);

      return {
        Data: {
          mongoDbUser: newUser,
        },
      };
    }
    case 'Delete':
      await client.databaseUsers.deleteDatabaseUser({
        databaseName: '$external',
        username: properties.arn,
      });
      return { Data: {} };
    default:
      throw new Error('Unknown request type');
  }
};
