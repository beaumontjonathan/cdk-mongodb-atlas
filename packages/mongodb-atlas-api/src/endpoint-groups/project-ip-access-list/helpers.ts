import { ProjectIpAccessListEntryKey } from './types';

export const getEncodedAccessListEntryKey = (options: ProjectIpAccessListEntryKey) => {
  if ('awsSecurityGroup' in options) {
    return encodeURIComponent(options.awsSecurityGroup);
  }

  if ('cidrBlock' in options) {
    return encodeURIComponent(options.cidrBlock);
  }

  if ('ipAddress' in options) {
    return encodeURIComponent(options.ipAddress);
  }

  throw new Error('No value provided');
};
