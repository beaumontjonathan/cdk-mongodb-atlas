export type ServerlessInstanceRegionName = 'EU_WEST_1';

export type ServerlessInstanceStateName =
  | 'IDLE'
  | 'CREATING'
  | 'UPDATING'
  | 'DELETING'
  | 'DELETED'
  | 'REPAIRING';

export type ServerlessInstance = {
  /**
   * Set of connection strings that your applications use to connect
   * to this serverless instance. This resource returns this object
   * after the serverless instance finishes deploying, not during the
   * serverless instance deployment.
   */
  connectionStrings: {
    /**
     * Public `mongodb+srv://` connection string that you can use to
     * connect to this serverless instance.
     */
    standardSrv?: string;
  };
  /**
   * Timestamp that indicates when MongoDB Cloud created the
   * serverless instance. The timestamp displays in the ISO 8601
   * date and time format in UTC.
   */
  createDate: string;
  /**
   * Unique 24-hexadecimal digit string that identifies the project
   * that contains the serverless instance.
   */
  groupId: string;
  /**
   * Unique 24-hexadecimal digit string that identifies the
   * serverless instance.
   */
  id: string;
  /**
   * Version of MongoDB that the serverless instance runs, in
   * `<major version>.<minor version>` format.
   */
  mongoDBVersion: string;
  /**
   * Human-readable label that identifies the serverless instance.
   */
  name: string;
  /**
   * Group of settings that configure the provisioned MongoDB
   * database.
   */
  providerSettings: {
    /**
     * Cloud service provider on which MongoDB Cloud provisioned the
     * serverless instance.
     */
    backingProviderName: 'AWS';
    /**
     * This value will always be the string literal `SERVERLESS`.
     */
    providerName: 'SERVERLESS';
    /**
     * Human-readable label that identifies the physical location of
     * your MongoDB serverless instance. The region you choose can
     * affect network latency for clients accessing your databases.
     */
    regionName: ServerlessInstanceRegionName;
  };
  serverlessBackupOptions: {
    /**
     * Flag that indicates whether the serverless instance uses
     * _Serverless Continuous Backup_. If this parameter is `false`,
     * the serverless instance uses _Basic Backup_.
     *
     * - _Serverless Continuous Backup_: Atlas takes incremental snapshots of the data in your
     * serverless instance every six hours and lets you restore the data from a selected point in
     * time within the last 72 hours. Atlas also takes daily snapshots and retains these daily
     * snapshots for 35 days. To learn more, see Serverless Instance Costs.
     * - _Basic Backup_: Atlas takes incremental snapshots of the data in your serverless instance
     * every six hours and retains only the two most recent snapshots. You can use this option for
     * free.
     */
    serverlessContinuousBackupEnabled: boolean;
  };
  /**
   * Stage of deployment of this serverless instance when the
   * resource made its request.
   */
  stateName: ServerlessInstanceStateName;
};
