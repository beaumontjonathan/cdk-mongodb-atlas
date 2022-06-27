import { request, RequestOptions } from 'urllib';
import { endpointGroups } from './endpoint-groups';
import { makeApi } from './types';

const BASE_URL = 'https://cloud.mongodb.com/api/atlas/v1.0';

const safeParse = (data: unknown) => {
  try {
    return JSON.parse(data as string);
  } catch {
    return null;
  }
};

export const api = makeApi({
  makeRequest:
    ({ digestAuth }) => async ({ method, path, body: jsonBody }) => {
      const requestOptions: RequestOptions = {
        method,
        digestAuth,
        headers: {},
      };

      if (jsonBody) {
        requestOptions.headers!['content-type'] = 'application/json';
        requestOptions.data = JSON.stringify(jsonBody);
      }

      console.log(requestOptions, digestAuth);

      const result = await request(`${BASE_URL}${path}`, requestOptions);
      if (result.status === 400) {
        throw new Error(
          `Error: ${(result.data as unknown as Buffer).toString()}`,
        );
      }

      if ([404, 409].includes(result.status)) {
        const body = JSON.parse(
          (result.data as unknown as Buffer).toString(),
        ) as unknown as Record<string, string | undefined>;

        throw new Error(
          `${body.reason ?? 'Unknown'} ${body.error ?? 'Unknown'}: ${
            body.detail ?? 'Unknown'
          }`,
        );
      }

      return {
        ...result,
        data: safeParse(result.data as unknown),
      };
    },
  endpointGroups,
});

export type Client = ReturnType<typeof api>;
