/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
import { CdkCustomResourceHandler } from 'aws-lambda';
import { api } from '@beaumontjonathan/mongodb-atlas-api';
import { promisify } from 'util';
import { Data, Properties } from '../types';
import { getDigestFromSsm } from '../../../helpers/ssm';

export const handler: CdkCustomResourceHandler = async (event, ctx) => {
  console.log('Event 👉', event);

  const {
    orgId,
    projectName,
    mongoDbDigestAuthParameterName,
  } = event.ResourceProperties as unknown as Properties;

  const digestAuth = await getDigestFromSsm(mongoDbDigestAuthParameterName);

  switch (event.RequestType) {
    case 'Create': {
      const baseClient = api({
        digestAuth,
        groupId: '', // This isn't used in the `project.createOneProject` call
      });

      const project = await baseClient.project.createOneProject({
        name: projectName,
        orgId,
      });

      const groupId = project.id;

      const data: Data = {
        orgId,
        groupId,
      };

      const client = api({ digestAuth, groupId });

      const cidrBlock = '0.0.0.0/0';

      await client.projectIpAccessList.addEntriesToAccessList([{
        cidrBlock,
        comment: `Created at ${new Date().toISOString()}`,
      }]);

      const accessListEntryPending = async (): Promise<boolean> => {
        const { status } = await client.projectIpAccessList.getOneAccessListEntryStatus({
          cidrBlock,
        });

        if (status === 'FAILED') {
          throw new Error(`Add access list entry ${cidrBlock} failed.`);
        }

        return status === 'PENDING';
      };

      do {
        if (ctx.getRemainingTimeInMillis() < 5000) {
          throw new Error(`Project created and ${cidrBlock} added to access list, but status not confirmed before timeout.`);
        }

        await promisify(setTimeout)(1000);
        console.log(`Checking access list entry status for ${cidrBlock}`);
      } while (await accessListEntryPending());

      return { Data: data };
    }
    case 'Update': {
      const {
        orgId: oldOrgId,
        projectName: oldProjectName,
        mongoDbDigestAuthParameterName: oldMongoDbDigestAuthParameterName,
      } = event.OldResourceProperties as unknown as Properties;

      if (orgId !== oldOrgId) {
        throw new Error(`Cannot change orgId from [${oldOrgId}] to [${orgId}]`);
      }

      if (projectName !== oldProjectName) {
        throw new Error(`Cannot change projectName from [${oldProjectName}] to [${projectName}]`);
      }

      if (mongoDbDigestAuthParameterName !== oldMongoDbDigestAuthParameterName) {
        throw new Error(`Cannot change mongoDbDigestAuthParameterName from [${oldMongoDbDigestAuthParameterName}] to [${mongoDbDigestAuthParameterName}]`);
      }

      return {
      };
    }
    case 'Delete':
      console.log('Trying to delete', event.ResourceProperties);
      return {};
    default:
      throw new Error('Unknown event type');
  }
};
