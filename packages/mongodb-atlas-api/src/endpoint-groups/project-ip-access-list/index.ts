import { addEntriesToAccessList } from './add-entries-to-access-list';
import { deleteOneAccessListEntry } from './delete-one-access-list-entry';
import { getOneAccessListEntry } from './get-one-access-list-entry';
import { getOneAccessListEntryStatus } from './get-one-access-list-entry-status';
import { getProjectIpAccessList } from './get-project-ip-access-list';

export const projectIpAccessList = {
  addEntriesToAccessList,
  deleteOneAccessListEntry,
  getOneAccessListEntry,
  getOneAccessListEntryStatus,
  getProjectIpAccessList,
};
