export type ProjectIpAccessListEntry = {
  comment?: string;
  /** ISO 8601 */
  deleteAfterDate?: string;
  groupId: string;
} & ConditionalKeyValues;

type ConditionalKeyValues = (
  | { awsSecurityGroup: string }
  | { cidrBlock: string; ipAddress?: string }
);

export type NewProjectIpAccessListEntry = Omit<ProjectIpAccessListEntry, 'groupId'> & ConditionalKeyValues;

export type ProjectIpAccessListEntryKey = (
  | { awsSecurityGroup: string }
  | { cidrBlock: string }
  | { ipAddress: string }
);
