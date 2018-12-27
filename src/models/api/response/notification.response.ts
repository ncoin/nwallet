import { Notification } from '../../nwallet/notification';
declare module '../../nwallet/notification' {
    interface Notification {
        /** Wallet ID */
        id: number;

        /** User ID */
        user_id: number;

        /** Device ID */
        device_id: string;

        /** Firebase Device Token */
        firebase_device_token: string;

        /** Currency ID */ // <-- currency id? ask
        is_push: number;

        /** creator name */
        created_by: string;

        /** created time */
        created_date: DateTimeStamp;

        /** last modifier name */
        last_modified_by: string;

        /** last modified time */
        last_modified_date: DateTimeStamp;
    }

}

export { Notification };
