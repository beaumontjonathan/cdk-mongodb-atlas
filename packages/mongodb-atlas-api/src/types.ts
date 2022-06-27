import { HttpClientResponse } from 'urllib';

type JSONValue =
  | undefined
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  | Array<JSONValue>;

export type MakeRequestArgs = {
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH';
  path: string;
  body?: JSONValue;
};
export type MakeRequest<T> = (
  args: MakeRequestArgs,
) => Promise<HttpClientResponse<T>>;

export type Endpoint<Args, Value> = {
  name: string;
  fn: (args: {
    options: Args;
    groupId: string;
    makeRequest: MakeRequest<Value>;
  }) => Promise<Value>;
};

export type MakeEndpoint = {
  <Args, Value>(args: Endpoint<Args, Value>): Endpoint<Args, Value>;
};

export const makeEndpoint: MakeEndpoint = e => e;

export type MakeEndpointGroup = {
  <T extends Record<string, Endpoint<any, any>>>(args: T): T;
};

export const makeEndpointGroup: MakeEndpointGroup = e => e;

type ApiClient<T extends Record<string, Record<string, Endpoint<any, any>>>> = {
  [Group in keyof T]: {
    [E in keyof T[Group]]: T[Group][E] extends Endpoint<infer Args, infer Value>
      ? (options: Args) => Promise<Value>
      : never;
  };
};

type ClientArgs = {
  groupId: string;
  digestAuth: string;
};

export type MakeApi = {
  <T extends Record<string, Record<string, Endpoint<any, any>>>>(args: {
    makeRequest: (args: ClientArgs) => MakeRequest<unknown>;
    endpointGroups: T;
  }): (args: ClientArgs) => ApiClient<T>;
};

export const makeApi: MakeApi =
  ({ makeRequest, endpointGroups }) =>
  args =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Object.fromEntries(
      Object.entries(endpointGroups).map(
        ([endpointGroupName, endpointGroup]) => [
          endpointGroupName,
          // @ts-ignore
          Object.fromEntries(
            Object.entries(endpointGroup).map(([endpoint, endpointFn]) => [
              endpoint,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              options =>
                endpointFn.fn({
                  options,
                  groupId: args.groupId,
                  makeRequest: makeRequest(args),
                }),
            ]),
          ),
        ],
      ),
    );
