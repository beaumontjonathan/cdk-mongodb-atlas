import { Stack } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { MongoDbAdminCredentials } from '../admin-credentials/construct';
import { MongoDbServerlessInstance } from './construct';

test('fromSsmParameterName', () => {
  const stack = new Stack();

  new MongoDbServerlessInstance(stack, 'Id', {
    adminCredentials: MongoDbAdminCredentials.fromSsmParameterName(stack, 'AdminCredentials', '/some/path'),
    continuousBackupEnabled: false,
    groupId: '12345',
    instanceName: 'foo_instance',
    region: 'EU_WEST_1',
  });
});

test('foo', () => {
  const stack = new Stack();

  const instance = new MongoDbServerlessInstance(stack, 'Id', {
    adminCredentials: MongoDbAdminCredentials.fromSsmParameterName(stack, 'AdminCredentials', '/some/path'),
    continuousBackupEnabled: false,
    groupId: '12345',
    instanceName: 'foo_instance',
    region: 'EU_WEST_1',
  });

  const lambdaFunction = new lambda.Function(stack, 'Function', {
    code: lambda.Code.fromInline('exports.handler = () => Promise.resolve({ hello: "world" });'),
    handler: 'handler',
    runtime: lambda.Runtime.NODEJS_16_X,
  });

  instance.grantLambdaAccess('foo', lambdaFunction, {
    roles: [
      {
        name: 'read',
        databaseName: 'foo',
        collectionName: 'bar',
      },
      {
        name: 'readwrite',
        databaseName: 'baz',
      },
    ],
  });
});
