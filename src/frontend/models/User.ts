export default interface User {
  id: string;
  lineId?: string;
  lineName?: string;
  profilePictureUrl?: string;
  stripeId?: string;
  firstName?: string;
  lastName?: string;
  nickName?: string;
}

export const emptyUser: User = {
  id: ""
};
