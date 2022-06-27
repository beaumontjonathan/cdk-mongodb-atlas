import { CustomRoleAction } from '../../custom-role-actions';
import { makeEndpoint } from '../../types';

export type CreateCustomRoleOptions = {
  /**
   * Each object in the `actions` array represents an individual [privilege action](https://www.mongodb.com/docs/manual/reference/privilege-actions/) granted by the role.
   */
  actions: Array<{
    /**
     * Name of the privilege action. For a complete list of actions available in the Atlas Administration API, see [Custom Role Actions](https://www.mongodb.com/docs/atlas/reference/api/custom-role-actions/).
     */
    action: CustomRoleAction;
    /**
     * Contains information on where the action is granted. Each object in the array either indicates a database and collection on which the action is granted, or indicates that the action is granted on the [cluster resource](https://www.mongodb.com/docs/manual/reference/resource-document/#cluster-resource).
     */
    resources: Array<
    | {
      /**
        * Collection on which the action is granted. If this value is an empty string, the action
        * is granted on all collections within the database specified in the
        * `actions.resources.db` field.
        */
      collection: string;
      /**
           * Database on which the action is granted.
           */
      db: string;
    }
    | {
      /**
           * Set to true to indicate that the action is granted on the [cluster resource](https://www.mongodb.com/docs/manual/reference/resource-document/#cluster-resource).
           */
      cluster: true;
    }
    >;
  }>;
  /**
   * Each object in the `inheritedRoles` array represents a key-value pair indicating the inherited
   * role and the database on which the role is granted.
   */
  inheritedRoles?: Array<{
    /**
     * Database on which the inherited role is granted.
     *
     * _Note:_ This value should be `admin` for all roles except [read](https://www.mongodb.com/docs/manual/reference/built-in-roles/#read) and [readWrite](https://www.mongodb.com/docs/manual/reference/built-in-roles/#readWrite).
     */
    db: string;
    /**
     * Name of the inherited role. This can either be another custom role or a [built-in role](https://www.mongodb.com/docs/manual/reference/built-in-roles/).
     */
    role: string;
  }>;
  /**
   * Name of the custom role.
   *
   * _Important:_ The specified role name can only contain letters, digits, underscores, and
   * dashes. Additionally, you cannot specify a role name which meets any of the following criteria:
   * - Is a name already used by an existing custom role in the project
   * - Is a name of any of the [built-in roles](https://www.mongodb.com/docs/manual/reference/built-in-roles/)
   * - Is `atlasAdmin`
   * - Starts with `xgen-`
   */
  roleName: string;
};

export type CreateCustomRoleResponse = void;

export const createCustomRole = makeEndpoint<
CreateCustomRoleOptions,
CreateCustomRoleResponse
>({
  name: 'createCustomRole',
  fn: async ({ groupId, options, makeRequest }) => {
    await makeRequest({
      method: 'POST',
      path: `/groups/${groupId}/customDBRoles/roles`,
      body: options,
    });
  },
});
