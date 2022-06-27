import { makeEndpointGroup } from '../../types';
import { createOne } from './create-one';
import { returnAll } from './return-all';
import { returnOne } from './return-one';

export const serverlessInstances = makeEndpointGroup({
  createOne,
  returnAll,
  returnOne,
});
