import { makeEndpoint } from '../../types';
import { Project } from './types';

export type CreateOneProjectOptions = Pick<Project, 'name' | 'orgId'>;

export type CreateOneProjectResponse = Project;

export const createOneProject = makeEndpoint<
CreateOneProjectOptions,
CreateOneProjectResponse
>({
  name: 'createOneProject',
  fn: async ({ options, makeRequest }) => {
    const response = await makeRequest({
      method: 'POST',
      path: '/groups',
      body: options,
    });

    return response.data;
  },
});
