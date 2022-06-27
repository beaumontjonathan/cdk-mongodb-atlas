import type { CdkCustomResourceHandler, CdkCustomResourceEvent, Context } from 'aws-lambda';
import { api, Client } from '@beaumontjonathan/mongodb-atlas-api';
import { promisify } from 'util';
import { ServerlessInstance } from '@beaumontjonathan/mongodb-atlas-api/build/endpoint-groups/serverless-instances/types';
import { Data, Properties } from '../types';
import { getDigestFromSsm } from '../../../helpers/ssm';

const expectToBeNever = (a: never, typeName: string, field?: string): Error => new Error(
  `Unknown ${typeName}: ${
    field ? (a as Record<string, string>).field : (a as string)
  }`,
);

const waitForInstanceCreation = async (
  client: Client,
  instanceName: string,
  ctx: Context,
): Promise<ServerlessInstance> => {
  do {
    // eslint-disable-next-line no-await-in-loop
    const instance = await client.serverlessInstances.returnOne({ instanceName });
    if (instance.stateName !== 'CREATING') return instance;
    // eslint-disable-next-line no-await-in-loop
    await promisify(setTimeout)(5000);
  } while (ctx.getRemainingTimeInMillis() > 10000);

  throw new Error('Lambda timeout exceeded');
};

const handle = async (
  event: CdkCustomResourceEvent,
  ctx: Context,
): Promise<Data & { physicalResourceId: string }> => {
  const {
    groupId,
    region,
    instanceName,
    mongoDbDigestAuthParameterName,
  } = event.ResourceProperties as unknown as Properties;

  const client = api({
    digestAuth: await getDigestFromSsm(mongoDbDigestAuthParameterName),
    groupId,
  });

  switch (event.RequestType) {
    case 'Create': {
      const allInstances = await client.serverlessInstances.returnAll();
      const instanceAlreadyExists = allInstances.results.some(
        (instance) => instance.name === instanceName,
      );

      if (instanceAlreadyExists) {
        throw new Error(
          `Cannot create instance which already exists: ${instanceName}`,
        );
      }

      await client.serverlessInstances.createOne({
        name: instanceName,
        providerSettings: {
          backingProviderName: 'AWS',
          providerName: 'SERVERLESS',
          regionName: region,
        },
        serverlessBackupOptions: {
          serverlessContinuousBackupEnabled: false,
        },
      });

      const readyInstance = await waitForInstanceCreation(client, instanceName, ctx);

      return {
        instanceId: readyInstance.id,
        srvUrl: readyInstance.connectionStrings.standardSrv ?? '',
        physicalResourceId: `mongodb_instance_${readyInstance.id}`,
      };
    }
    case 'Update': {
      console.log(
        'changing from',
        event.OldResourceProperties,
        'to',
        event.ResourceProperties,
      );

      const {
        groupId: oldGroupId,
        instanceName: oldInstanceName,
      } = event.OldResourceProperties as unknown as Properties;

      if (groupId !== oldGroupId) {
        throw new Error(`You cannot change the group ID of an existing instance, attempting to change from "${oldGroupId}" to "${groupId}"`);
      }

      if (instanceName !== oldInstanceName) {
        throw new Error(`You cannot change the name of an existing instance, attempting to change from "${oldInstanceName}" to "${instanceName}"`);
      }

      const instance = await client.serverlessInstances.returnOne({ instanceName });

      return {
        instanceId: instance.id,
        srvUrl: instance.connectionStrings.standardSrv ?? '',
        physicalResourceId: event.PhysicalResourceId,
      };
    }
    case 'Delete': {
      const allInstances = await client.serverlessInstances.returnAll();
      const instance = allInstances.results.find(
        ({ name }) => name === instanceName,
      );
      const databaseStillExists = !!instance;

      if (databaseStillExists) {
        throw new Error(
          `Cannot delete instance "${instanceName}", this must be delete manually through MongoDb Atlas`,
        );
      }

      return {
        instanceId: '',
        srvUrl: '',
        physicalResourceId: event.PhysicalResourceId,
      };
    }
    default:
      throw expectToBeNever(event, 'event request type', 'RequestType');
  }
};

export const handler: CdkCustomResourceHandler = async (event, ctx) => {
  console.log('Event 👉', event);

  const { physicalResourceId, ...data } = await handle(event, ctx);

  return {
    PhysicalResourceId: physicalResourceId,
    Data: data,
  };
};
