import { User } from './app.model';

export interface UserGroup {
    groupName: string;

    groupDescription: string;

    users: Array<User>;
}