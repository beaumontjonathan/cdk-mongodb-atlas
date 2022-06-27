export type Data = {
  foo: string;
};

export type Properties = {
  arn: string;
  roles: {
    name: 'read' | 'readWrite' | string;
    databaseName: string;
    collectionName?: string;
  }[];
  credentials: {
    groupId: string;
    mongoDbDigestAuthParameterName: string;
  };
};
