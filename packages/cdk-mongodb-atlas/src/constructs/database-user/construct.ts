import {
  custom_resources as cr,
  CustomResource,
  Duration,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as nodejs,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import path from 'path';
import { Properties } from './types';
import { MongoDbAdminCredentials } from '../admin-credentials/construct';

export type MongoDbDatabaseUserProps = {
  // roleArn: string;
  role: iam.IRole;
  lambda: lambda.IFunction;
  adminCredentials: MongoDbAdminCredentials;
  groupId: string;
  mongoDbRoles: {
    name: 'read' | 'readWrite' | string; // TODO
    databaseName: string;
    collectionName?: string;
  }[];
};

export class MongoDbDatabaseUser extends Construct {
  readonly #props: MongoDbDatabaseUserProps;

  constructor(scope: Construct, id: string, props: MongoDbDatabaseUserProps) {
    super(scope, id);

    this.#props = props;

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: new nodejs.NodejsFunction(this, 'onEventHandler', {
        memorySize: 256,
        timeout: Duration.seconds(30),
        runtime: lambda.Runtime.NODEJS_14_X,
        entry: path.join(__dirname, './lambdas/on-event.js'),
      }),
    });

    props.adminCredentials.grantProviderRead(provider);

    new CustomResource(this, 'CustomResource', {
      serviceToken: provider.serviceToken,
      properties: this.getResourceProperties(),
      resourceType: 'Custom::MongoDbDatabaseUser',
    });

    // const atlasRoleId = resource.getAttString('atlasRoleId');
    // const atlasAwsAccountArn = resource.getAttString('atlasAwsAccountArn');
  }

  getResourceProperties(): Properties {
    return {
      arn: this.#props.role.roleArn,
      roles: this.#props.mongoDbRoles,
      credentials: {
        groupId: this.#props.groupId,
        mongoDbDigestAuthParameterName:
          this.#props.adminCredentials.parameterName(),
      },
    };
  }
}
