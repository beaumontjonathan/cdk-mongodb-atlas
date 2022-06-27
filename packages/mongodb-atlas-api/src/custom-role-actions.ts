export type QueryAndWriteActionsCustomRoleAction =
  | 'FIND'
  | 'INSERT'
  | 'REMOVE'
  | 'UPDATE'
  | 'BYPASS_DOCUMENT_VALIDATION'
  | 'USE_UUID';

export type DatabaseManagementActionsCustomRoleAction =
  | 'CREATE_COLLECTION'
  | 'CREATE_INDEX'
  | 'DROP_COLLECTION'
  | 'ENABLE_PROFILER';

export type ChangeStreamActionsCustomRoleAction = 'CHANGE_STREAM';

export type ServerAdministrationActionsCustomRoleAction =
  | 'COLL_MOD'
  | 'COMPACT'
  | 'CONVERT_TO_CAPPED'
  | 'DROP_DATABASE'
  | 'DROP_INDEX'
  | 'RE_INDEX'
  | 'RENAME_COLLECTION_SAME_DB'
  | 'SET_USER_WRITE_BLOCK'
  | 'BYPASS_USER_WRITE_BLOCK';

export type SessionActionsCustomRoleAction =
  | 'LIST_SESSIONS'
  | 'KILL_ANY_SESSION';

export type GlobalActionsCustomRoleAction =
  | 'COLL_STATS'
  | 'CONN_POOL_STATS'
  | 'DB_HASH'
  | 'DB_STATS'
  | 'GET_CMD_LINE_OPTS'
  | 'GET_LOG'
  | 'GET_PARAMETER'
  | 'GET_SHARD_MAP'
  | 'HOST_INFO'
  | 'IN_PROG'
  | 'LIST_DATABASES'
  | 'LIST_COLLECTIONS'
  | 'LIST_SHARDS'
  | 'LIST_INDEXES'
  | 'NETSTAT'
  | 'REPLSET_GET_CONFIG'
  | 'REPLSET_GET_STATUS'
  | 'SERVER_STATUS'
  | 'SHARDING_STATE'
  | 'VALIDATE'
  | 'TOP';

export type DeploymentManagementActionsCustomRoleAction = 'KILL_OP';

export type ShardingActionsCustomRoleAction =
  | 'ADD_SHARD_TO_ZONE'
  | 'REMOVE_SHARD_FROM_ZONE'
  | 'UPDATE_ZONE_KEY_RANGE'
  | 'FLUSH_ROUTER_CONFIG';

export type AtlasDataFederationActionsCustomRoleAction =
  | 'SQL_GET_SCHEMA'
  | 'SQL_SET_SCHEMA'
  | 'VIEW_ALL_HISTORY'
  | 'OUT_TO_S3'
  | 'STORAGE_GET_CONFIG'
  | 'STORAGE_SET_CONFIG';

export type CustomRoleAction =
  | QueryAndWriteActionsCustomRoleAction
  | DatabaseManagementActionsCustomRoleAction
  | ChangeStreamActionsCustomRoleAction
  | ServerAdministrationActionsCustomRoleAction
  | SessionActionsCustomRoleAction
  | GlobalActionsCustomRoleAction
  | DeploymentManagementActionsCustomRoleAction
  | ShardingActionsCustomRoleAction
  | AtlasDataFederationActionsCustomRoleAction;
