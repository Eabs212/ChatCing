import {Profile} from '../profile/profile.interface';
export interface State {
    date?: string;
    url: string;
    storageUrl?: string;
    profile: Profile;
    id: string;
}
