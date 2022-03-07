export interface IUploadFileResponse {
  status: boolean;
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
  isDuplicate?: boolean;
}
