import { Stack } from 'aws-cdk-lib';
import { MongoDbAdminCredentials } from './construct';

test('fromSsmParameterName', () => {
  MongoDbAdminCredentials.fromSsmParameterName(new Stack(), 'Id', '/some/parameter/name');
});
