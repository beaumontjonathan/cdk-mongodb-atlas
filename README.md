> Deprecated, please see [`awscdk-resources-mongodbatlas`](https://github.com/mongodb/awscdk-resources-mongodbatlas).

# CDK MongoDB Atlas

A[n unfinished] set of CDK Custom Resources to manage constructs in MongoDB Atlas.

## Background

[CDK](https://aws.amazon.com/cdk/) helps managing cloud resources in AWS CloudFormation. The [`aws-cdk`](https://www.npmjs.com/package/aws-cdk) includes a large number of [constructs](https://www.npmjs.com/package/constructs) for resources relating to services within AWS, but also supports creating _custom resources_.

CloudFormation [Custom Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) allow AWS customers to write custom provisioning logic, allowing the management of non-AWS native resources.

## MongoDB Atlas

MongoDB Atlas is a managed database service in both dedicated servers & serverless NoSQL variants.

A neat feature is supporting authentication through AWS IAM Users & Roles.

## CDK MongoDB Atlas

The aim of this personal project was to learn about _Custom Resources_ by building a provisioning wrapper around various MongoDB Atlas resources, e.g., users/roles, databases, indexes.

### Project Status

During mid-2022 I was using MongoDB for various work & hobby projects, but wanted to keep my IaC in CDK. This was a fun way to learn about CloudFormation, CDK, and Atlas.

In 2023 I moved onto other projects & subsequently MongoDB [released their own](https://constructs.dev/packages/awscdk-resources-mongodbatlas/v/3.5.2?lang=typescript) _CDK Third-Party Extension_ in collaboration with AWS ([AWS DevOps blog](https://aws.amazon.com/blogs/devops/extending-cloudformation-and-cdk-with-third-party-extensions/)).
