export interface Group {
  id: string;
  groupname: string;
  description: string;
  username: string;
  category: string;
  creator: string;
  groupmembersid: Array<string>;
  grouprequestsid: Array<string>;
}
