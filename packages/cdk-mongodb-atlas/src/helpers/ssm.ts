import { SSM } from 'aws-sdk';

const cache = new Map<string, string>();

const ssm = new SSM();

type SetSsmValueArgs = {
  parameterName: string;
  value: string;
  isSecureString?: boolean;
};

export const setSsmValue = async ({
  parameterName,
  value,
  isSecureString = false,
}: SetSsmValueArgs) => {
  await ssm.putParameter({
    Name: parameterName,
    Value: value,
    Type: isSecureString ? 'SecureString' : 'String',
    Overwrite: true,
  }).promise();
};

type GetSsmValueArgs = {
  parameterName: string;
  isSecureString?: boolean;
};

export const getSsmValue = async ({
  parameterName,
  isSecureString,
}: GetSsmValueArgs): Promise<string> => {
  const cacheValue = cache.get(parameterName);

  if (cacheValue) return cacheValue;

  const parameter = await ssm
    .getParameter({
      Name: parameterName,
      WithDecryption: isSecureString,
    })
    .promise();

  const value = parameter.Parameter?.Value ?? null;

  if (!value) {
    throw new Error(`SSM Parameter "${parameterName}" not found`);
  }

  cache.set(parameterName, value);

  return value;
};

export const getDigestFromSsm = (parameterName: string): Promise<string> => (
  getSsmValue({ parameterName, isSecureString: true })
);
