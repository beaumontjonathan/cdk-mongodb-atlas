import {
  Duration,
  CustomResource,
  aws_lambda as lambda,
  aws_lambda_nodejs as nodejs,
  custom_resources as cr,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import { MongoDbAdminCredentials } from '../admin-credentials/construct';
import { Properties } from './types';

export type MongoDbProjectProps = {
  orgId: string;
  projectName: string;
  adminCredentials: MongoDbAdminCredentials;
};

export class MongoDbProject extends Construct {
  readonly #props: MongoDbProjectProps;

  readonly #resource: CustomResource;

  constructor(
    scope: Construct,
    id: string,
    props: MongoDbProjectProps,
  ) {
    super(scope, id);

    this.#props = props;

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: new nodejs.NodejsFunction(this, 'onEventHandler', {
        memorySize: 256,
        timeout: Duration.seconds(90),
        runtime: lambda.Runtime.NODEJS_14_X,
        entry: path.join(__dirname, './lambdas/on-event.js'),
      }),
    });

    this.#resource = new CustomResource(this, 'CustomResource', {
      serviceToken: provider.serviceToken,
      properties: this.getResourceProperties(),
      resourceType: 'Custom::MongoDbProject',
    });

    props.adminCredentials.grantProviderRead(provider);
  }

  getResourceProperties(): Properties {
    return {
      orgId: this.#props.orgId,
      projectName: this.#props.projectName,
      mongoDbDigestAuthParameterName: this.#props.adminCredentials.parameterName(),
    };
  }

  get groupId(): string {
    return this.#resource.getAttString('groupId');
  }
}
