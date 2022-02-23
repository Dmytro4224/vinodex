
export interface IUploadFileResponse {
    data: {
        IpfsHash: string;
    }
}

class PinataAPI {
    public HREF_ENDPOINT = 'https://gateway.pinata.cloud/ipfs';
    public UPLOAD_ENDPOINT = 'https://api.pinata.cloud';
    public API_KEY = '5dcb14db05598d190af4';
    public API_SECRET = '5d87c217d4ca0ff1c802c2a796494f00ca61c859ab4ceb26c3613826ead26551';
    public JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2NzdmYjE1MC01NDgzLTQ0NWMtODRjNi0xMjhkNDk5YTIyMDEiLCJlbWFpbCI6Im9uZHJhc2hkZXZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjVkY2IxNGRiMDU1OThkMTkwYWY0Iiwic2NvcGVkS2V5U2VjcmV0IjoiNWQ4N2MyMTdkNGNhMGZmMWM4MDJjMmE3OTY0OTRmMDBjYTYxYzg1OWFiNGNlYjI2YzM2MTM4MjZlYWQyNjU1MSIsImlhdCI6MTY0NTYwOTgwMX0.pSurVga-_iIrQGX7Wm4hbYbIdgaeQlsDdPlw-zpLzj4';

    public async uploadFile(file: File) {
        const url = `${this.UPLOAD_ENDPOINT}/pinning/pinFileToIPFS`;

        const formData: FormData = new FormData();
        formData.append('file', file);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                //@ts-ignore
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                pinata_api_key: this.API_KEY,
                pinata_secret_api_key: this.API_SECRET,
            }
        });

        const data = await response.json();

        console.log('uploadFile response data', data);

        return data;
    }

    public async getFileData(hash: string) {
        let response: Response;

        try {
            response = await fetch(`${this.HREF_ENDPOINT}/${hash}`);
        }
        catch (e) {
            console.error(e);
            return null;
        }

        try {
            const blob = await response.blob();

            if (blob.type === 'application/json') {
                const text = await this.readBlobAsText(blob);
                return JSON.parse(text)?.file || null;
            }

            return await this.readBlobAsDataUrl(blob);
        }
        catch (e) {
            console.error(e);
        }

        return null;
    }

    public readBlobAsText(blob: Blob) {
        return new Promise((resolve: (json: string) => void, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsText(blob);
        });
    }

    public readBlobAsDataUrl(blob: Blob) {
        return new Promise((resolve: (json: string) => void, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
}

export const pinataAPI = new PinataAPI();
