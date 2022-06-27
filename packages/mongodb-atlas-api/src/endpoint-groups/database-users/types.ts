export type DatabaseUser = {
  databaseName: string;
  deleteAfterDate?: string;
  groupId: string;
  labels?: { key: string; value: string }[];
  roles: Array<{
    collectionName?: string;
    databaseName?: string;
    roleName?: string;
  }>;
  scopes?: Array<{
    name: string;
    type: string;
  }>;
  username: string;
  awsIAMType?: string;
};
