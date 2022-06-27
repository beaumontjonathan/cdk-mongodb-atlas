export type AwsIamRole = {
  /**
   * ARN associated with the Atlas AWS account used to assume IAM roles in your AWS account.
   */
  atlasAWSAccountArn: string;
  /**
   * Unique external ID Atlas uses when assuming the IAM role in your AWS account.
   */
  atlasAssumedRoleExternalId: string;
  /**
   * Date on which this role was authorized.
   */
  authorizedDate: string | null;
  /**
   * Date on which this role was created.
   */
  createdDate: string;
  /**
   * Atlas features this AWS IAM role is linked to.
   */
  featureUsages: string[]; // TODO: array;
  /**
   * ARN of the IAM Role that Atlas assumes when accessing resources in your AWS account.
   */
  iamAssumedRoleArn: string | null;
  /**
   * Name of the cloud provider. Currently limited to AWS.
   */
  providerName: string;
  /**
   * Unique ID of this role.
   */
  roleId: string;
};

export type AuthorizedAwsIamRole = NonNullable<AwsIamRole>;
