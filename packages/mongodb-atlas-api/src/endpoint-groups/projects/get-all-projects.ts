import { makeEndpoint } from '../../types';
import { Project } from './types';

export type GetAllProjectsOptions = void;

export type GetAllProjectsResponse = {
  results: Project[]
};

export const getAllProjects = makeEndpoint<
GetAllProjectsOptions,
GetAllProjectsResponse
>({
  name: 'getAllProjects',
  fn: async ({ makeRequest }) => {
    const response = await makeRequest({
      method: 'GET',
      path: '/groups',
    });

    return response.data;
  },
});
