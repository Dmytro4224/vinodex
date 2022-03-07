export interface IUploadFileResponse {
  status: boolean;
  url: string;
  IpfsHash: string;
  PinSize: number;
  Timestamp?: string;
  isDuplicate?: boolean;
}
