import { toBase64 } from '../utils/sys';

interface IUnchainApiBaseResponse {
  statusCode: number;
  statusMessage: string;
}

interface IUnchainApiTypedResponse<T> extends IUnchainApiBaseResponse {
  data: T;
}

class UnchainApi {

  public readonly endpoint = 'https://unchain.vinodex.io';
  private readonly _headers = {
    'access-token': 'F5E4C34D-0D3E-4BC7-8EBD-2D2AC4D626EA',
    'content-type': 'application/json'
  };

  constructor() {
  }

  public async subscribe(email: string) {
    const body = JSON.stringify({ emailBase64: toBase64(email) });
    try {
      const response = await fetch(`${this.endpoint}/apiv1/subscribe/add-v2`, {
        method: 'POST',
        body,
        headers: this._headers
      });
      return await response.json() as IUnchainApiBaseResponse;
    }
    catch (ex) {
      console.error('UnchainApi.subscribe ex => ', ex);
      return null;
    }
  }

  public async confirmation(emailHash: string) {
    try {
      const response = await fetch(`${this.endpoint}/apiv1/email-confirmation/${emailHash}`, {
        method: 'POST',
        headers: this._headers
      });
      return await response.json() as IUnchainApiTypedResponse<boolean>;
    }
    catch (ex) {
      console.error('UnchainApi.confirmation ex => ', ex);
      return null;
    }
  }

  public async welcome(emailHash: string) {
    const body = JSON.stringify({ emailHash });
    try {
      const response = await fetch(`${this.endpoint}/apiv1/welcome`, {
        method: 'POST',
        body,
        headers: this._headers
      });
      return await response.json() as IUnchainApiBaseResponse;
    }
    catch (ex) {
      console.error('UnchainApi.subscribe ex => ', ex);
      return null;
    }
  }

  public async purchase(tokenId: string, transactionHashes: string, accountId: string) {
    const body = JSON.stringify({
      userName: accountId,
      token: tokenId,
      transactionLink: transactionHashes
    });
    try {
      const response = await fetch(`${this.endpoint}/apiv1/purchase/add`, {
        method: 'POST',
        body,
        headers: this._headers
      });
      return await response.json() as IUnchainApiBaseResponse;
    }
    catch (ex) {
      console.error('UnchainApi.purchase ex => ', ex);
      return null;
    }
  }
}

export const unchainApi = new UnchainApi();
