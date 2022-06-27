import {
  Handler,
  CloudFormationCustomResourceCreateEvent,
  CloudFormationCustomResourceUpdateEvent,
  CloudFormationCustomResourceDeleteEvent,
  CdkCustomResourceResponse,
  CdkCustomResourceIsCompleteEvent,
  CdkCustomResourceIsCompleteResponse,
} from 'aws-lambda';

export type OnEventData = {
  instanceId: string;
  isDelete?: true | undefined;
};

export type MongoDbCustomResourceProperties = {
  clusterName: string;
  region: string;
  databases: Array<{
    name: string;
    collections: Array<{
      name: string;
    }>;
  }>;
  credentials: {
    mongoDbDigestAuthParameterName: string;
    groupId: string;
  };
};

type Identity<T> = { [P in keyof T]: T[P] };
type Replace<T, K extends keyof T, TReplace> = Identity<
Pick<T, Exclude<keyof T, K>> & {
  [P in K]: TReplace;
}
>;

export type CloudFormationCustomResourceEvent =
  | Replace<
  CloudFormationCustomResourceCreateEvent,
  'ResourceProperties',
  MongoDbCustomResourceProperties
  >
  | Replace<
  Replace<
  CloudFormationCustomResourceUpdateEvent,
  'OldResourceProperties',
  MongoDbCustomResourceProperties
  >,
  'ResourceProperties',
  MongoDbCustomResourceProperties
  >
  | Replace<
  CloudFormationCustomResourceDeleteEvent,
  'ResourceProperties',
  MongoDbCustomResourceProperties
  >;

export type CdkCustomResourceHandler = Handler<
CloudFormationCustomResourceEvent,
Replace<CdkCustomResourceResponse, 'Data', OnEventData>
>;

export type CdkCustomResourceIsCompleteHandler = Handler<
Omit<CdkCustomResourceIsCompleteEvent, 'Data' | 'ResourceProperties'> & {
  Data: OnEventData;
  ResourceProperties: MongoDbCustomResourceProperties;
},
CdkCustomResourceIsCompleteResponse
>;
