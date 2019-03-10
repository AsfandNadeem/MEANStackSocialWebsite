export interface Events {
  id: string;
  eventname: string;
  description: string;
  username: string;
  eventdate: Date;
  category: string;
  eventmembersid: Array<string>;
  creator: string;
}
