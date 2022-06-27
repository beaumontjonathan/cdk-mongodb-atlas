import { makeEndpoint } from '../../types';
import { ServerlessInstance } from './types';

export type ReturnAllOptions = {
  pagination?: {
    /**
     * Page number, starting with one, that Atlas returns of the total number of objects.
     *
     * @default 1
     */
    pageNum?: number;
    /**
     * Number of items that Atlas returns per page, up to a maximum of 500.
     *
     * @default 100
     */
    itemsPerPage?: number;
  };
} | void;

export type ReturnAllResponse = {
  results: ServerlessInstance[];
  /**
   * Count of the total number of items in the result set. It may be greater than the number of objects in the `results` array if the entire result set is paginated.
   */
  totalCount: number;
};

export const returnAll = makeEndpoint<ReturnAllOptions, ReturnAllResponse>({
  name: 'returnAll',
  fn: async ({
    options: { pagination: { pageNum = 1, itemsPerPage = 100 } = {} } = {},
    groupId,
    makeRequest,
  }) => {
    const {
      data: { results, totalCount },
    } = await makeRequest({
      method: 'GET',
      path: `/groups/${groupId}/serverless/?pageNum=${pageNum}&itemsPerPage=${itemsPerPage}`,
    });

    return { results, totalCount };
  },
});
