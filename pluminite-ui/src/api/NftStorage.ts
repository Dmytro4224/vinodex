////import { NFTStorage } from 'nft.storage'
////import mime from 'mime'

import fs from 'fs';
import { IUploadFileResponse } from './IUploadFileResponse';
import { NFTStorage } from 'nft.storage';

class NftStorage {

  public readonly API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDI4M2JCRDM3NmMxMjQxQzY4NDU5QWQyNkVkZDJmNGQxN0Y0NGMxOTUiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NjQwODYyNDk3MiwibmFtZSI6Im5mdC1pcGZzIn0.7Abmwn7G_CwVzwARDMA_JGJXUr4FRLExMWXpMuid6EY';
  public readonly URI_TEMPLATE = 'https://nftstorage.link/ipfs/{0}';
  public readonly API_ENDPOINT = 'https://api.nft.storage';

  constructor() {

  }

  public replaceOldUrl(oldUrl: string) {
    return oldUrl !== void 0 && oldUrl !== null ?
      oldUrl.replace('https://nftstorage.link/ipfs/', 'https://ipfs.io/ipfs/') :
      oldUrl;
  }

  public async uploadFile(file: File, name: string, description: string) {
    const storage = new NFTStorage({ token: this.API_KEY });
    let result: IUploadFileResponse;
    try {
      const metadata = await storage.store({
        name,
        description,
        image: file
      });
      console.log('metadata.json metadata', metadata);
      result = {
        status: true,
        url: this.replaceOldUrl(metadata.embed().image.href),
        IpfsHash: metadata.ipnft,
        PinSize: file.size
      };
      return result;
    }
    catch (ex) {
      console.error(ex);
      result = {
        status: false,
        url: '',
        IpfsHash: '',
        PinSize: 0
      };
    }
    return result;
  }
  /*
  public uploadFile2(file: File, onProgress?: (percent: number) => void) {
    return new Promise((resolve: (success: IUploadFileResponse) => void) => {
      const data = new FormData();
      data.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', e => {
        if (e.lengthComputable) {
          console.log('upload progress:', e.loaded / e.total);
          if (onProgress !== void 0) {
            onProgress(e.loaded / e.total);
          }
        }
      });
      xhr.addEventListener('loadend', _ => {
        const response = JSON.parse(xhr.response);
        console.log('xhr.response', response);
        resolve({
          status: xhr.readyState === 4 && xhr.status === 200 && response && response.ok,
          IpfsHash: response && response.ok ? response.value.pin.cid : null,
          PinSize: response && response.ok ? response.value.pin.size : 0,
          Timestamp: response && response.ok ? response.value.pin.created : null
        });
      });
      xhr.open('POST', `${this.API_ENDPOINT}/upload`, true);
      xhr.setRequestHeader('Authorization', `Bearer ${this.API_KEY}`);
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
      xhr.send(data);
    });
  }
  */
  public createUrl(cid: string) {
    //return `https://nftstorage.link/ipfs/${cid}`;
    return `https://ipfs.io/ipfs/${cid}`;
  }

}

export const nftStorage = new NftStorage();
