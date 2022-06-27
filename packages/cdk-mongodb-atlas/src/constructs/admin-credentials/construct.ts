import {
  aws_ssm as ssm,
  aws_iam as iam,
  custom_resources as cr,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class MongoDbAdminCredentials extends Construct {
  #authDigestSsm: ssm.IStringParameter | null = null;

  static fromSsmParameterName(
    scope: Construct,
    id: string,
    authDigestParameterName: string,
  ) {
    const credentials = new MongoDbAdminCredentials(scope, id);
    credentials.#authDigestSsm = ssm.StringParameter.fromSecureStringParameterAttributes(
      scope,
      'AuthDigestParameter',
      {
        parameterName: authDigestParameterName,
      },
    );
    return credentials;
  }

  static fromSsm(
    scope: Construct,
    id: string,
    authDigestSsm: ssm.IStringParameter,
  ): MongoDbAdminCredentials {
    const credentials = new MongoDbAdminCredentials(scope, id);
    credentials.#authDigestSsm = authDigestSsm;
    return credentials;
  }

  #getAuthDigestSsm(): ssm.IStringParameter {
    if (!this.#authDigestSsm) {
      throw new Error('SSM not set on auth digest');
    }

    return this.#authDigestSsm;
  }

  parameterName(): string {
    return this.#getAuthDigestSsm().parameterName;
  }

  grantRead(grantee: iam.IGrantable): void {
    this.#getAuthDigestSsm().grantRead(grantee);
  }

  grantProviderRead(provider: cr.Provider): void {
    this.grantRead(provider.onEventHandler);
    if (provider.isCompleteHandler) {
      this.grantRead(provider.isCompleteHandler);
    }
  }
}
