import { makeEndpointGroup } from '../../types';
import { createOneProject } from './create-one-project';
import { getAllProjects } from './get-all-projects';

export const project = makeEndpointGroup({ createOneProject, getAllProjects });
