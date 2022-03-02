
export interface ICurrentUser {
	walletAddress: string | null;
	accountId: string;
  balance: string;
  name?: string;
  image?: string;
}
