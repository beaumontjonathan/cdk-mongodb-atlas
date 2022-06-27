import {
  Duration,
  CustomResource,
  aws_ssm as ssm,
  aws_lambda as lambda,
  aws_lambda_nodejs as nodejs,
  custom_resources as cr,
} from 'aws-cdk-lib';
import * as path from 'path';
import { Construct } from 'constructs';
import { MongoDbAdminCredentials } from '../admin-credentials/construct';
import {
  MongoDbDatabaseUser,
  MongoDbDatabaseUserProps,
} from '../database-user/construct';
import { MongoDbProject } from '../project/construct';
import { Properties } from './types';

type MongoDbServerlessInstanceProps = {
  instanceName: string;
  continuousBackupEnabled: boolean;
  region: 'EU_WEST_1';
  adminCredentials: MongoDbAdminCredentials;
} & (
  | { groupId?: undefined; project: MongoDbProject }
  | { groupId: string; project?: MongoDbProject }
);

export class MongoDbServerlessInstance extends Construct {
  readonly #props: MongoDbServerlessInstanceProps;

  readonly #resource: CustomResource;

  constructor(
    scope: Construct,
    id: string,
    props: MongoDbServerlessInstanceProps,
  ) {
    super(scope, id);

    this.#props = props;

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: new nodejs.NodejsFunction(this, 'onEventHandler', {
        memorySize: 256,
        timeout: Duration.minutes(15),
        runtime: lambda.Runtime.NODEJS_14_X,
        entry: path.join(__dirname, './lambdas/on-event.js'),
      }),
      // isCompleteHandler: new nodejs.NodejsFunction(this, 'isCompleteHandler', {
      //   memorySize: 256,
      //   timeout: Duration.seconds(5),
      //   runtime: lambda.Runtime.NODEJS_14_X,
      //   entry: path.join(__dirname, './lambdas/is-complete.js'),
      //   environment: {
      //     MONGODB_URI_SSM_PARAM: this.#mongoDbUriSsmParameter.parameterName,
      //   },
      // }),
      // totalTimeout: Duration.minutes(10),
      // queryInterval: Duration.seconds(5),
    });

    props.adminCredentials.grantProviderRead(provider);

    this.#resource = new CustomResource(this, 'CustomResource', {
      serviceToken: provider.serviceToken,
      properties: this.getResourceProperties(),
      resourceType: 'Custom::MongoDbServerlessInstance',
    });
  }

  getResourceProperties(): Properties {
    return {
      groupId: this.#groupId,
      region: this.#props.region,
      instanceName: this.#props.instanceName,
      mongoDbDigestAuthParameterName: this.#props.adminCredentials.parameterName(),
    };
  }

  grantLambdaAccess(
    id: string,
    lambdaFunction: lambda.IFunction,
    options: {
      roles: MongoDbDatabaseUserProps['mongoDbRoles'];
    },
  ) {
    // const arn = lambdaFunction.role?.roleArn;

    if (!lambdaFunction.role) {
      throw new Error('Lambdas must have a role!');
    }

    new MongoDbDatabaseUser(this, `MongoDbUser-${id}-${lambdaFunction.node.id}`, {
      role: lambdaFunction.role,
      lambda: lambdaFunction,
      mongoDbRoles: options.roles,
      adminCredentials: this.#props.adminCredentials,
      groupId: this.#groupId,
    });

    // console.log(options, '\n\n');
    // console.log(this.#props.groupId, arn, lambdaFunction.role);
  }

  get #groupId(): string {
    return this.#props.groupId ?? this.#props.project.groupId;
  }

  // eslint-disable-next-line class-methods-use-this
  get srvUrl(): string {
    return this.#resource.getAttString('srvUrl');
    // See the above `mongoDbUriSsmParameter` usage.
    // throw new Error('Cannot get value from custom resource');
  }
}
