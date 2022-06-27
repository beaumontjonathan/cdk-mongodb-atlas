import { api } from '@beaumontjonathan/mongodb-atlas-api';
import type { CdkCustomResourceIsCompleteHandler } from 'aws-lambda';
import { getDigestFromSsm, setSsmValue } from '../../../helpers/ssm';
import { Data, Properties } from '../types';

const setMongoUriParam = async (standardSrv: string) => {
  const { MONGODB_URI_SSM_PARAM } = process.env;

  if (!MONGODB_URI_SSM_PARAM) {
    throw new Error(`Unable to set mongo uri param, env var "${MONGODB_URI_SSM_PARAM}" not set.`);
  }

  await setSsmValue({
    parameterName: MONGODB_URI_SSM_PARAM,
    value: standardSrv,
    isSecureString: false,
  });
};

export const handler: CdkCustomResourceIsCompleteHandler = async (event) => {
  console.log('Event 👉', event);

  const data = event.Data as Data;
  const { instanceId } = data;

  if (event.RequestType === 'Delete') {
    return {
      IsComplete: true,
    };
  }

  const {
    groupId,
    instanceName,
    mongoDbDigestAuthParameterName,
  } = event.ResourceProperties as unknown as Properties;

  const client = api({
    digestAuth: await getDigestFromSsm(mongoDbDigestAuthParameterName),
    groupId,
  });

  const instance = await client.serverlessInstances.returnOne({
    instanceName,
  });

  if (instance.id !== instanceId) {
    throw new Error(
      `There has been a mismatch of instance IDs: "${instanceId}" and "${instance.id}"`,
    );
  }

  if (instance.stateName === 'CREATING') {
    return {
      IsComplete: false,
    };
  }

  if (event.RequestType === 'Create') {
    if (!instance.connectionStrings.standardSrv) {
      throw new Error('No connection strings available for instance');
    }

    console.log(`Setting instance connection string: ${instance.connectionStrings.standardSrv}`);

    await setMongoUriParam(instance.connectionStrings.standardSrv);
  }

  return {
    IsComplete: true,
    Data: data,
  };
};
