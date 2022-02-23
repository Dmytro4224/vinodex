
export interface IUploadFileResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
}

class PinataAPI {
    public HREF_ENDPOINT = 'https://gateway.pinata.cloud/ipfs';
    public UPLOAD_ENDPOINT = 'https://api.pinata.cloud';
    public API_KEY = 'b391ea1f5c61778f58ef';
    public API_SECRET = 'cfd0c6e2e2cb4770aa2ac9d32cc1b6a78b8bb87622e8365293c0b55557aa36da';
    public JWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2NzdmYjE1MC01NDgzLTQ0NWMtODRjNi0xMjhkNDk5YTIyMDEiLCJlbWFpbCI6Im9uZHJhc2hkZXZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImIzOTFlYTFmNWM2MTc3OGY1OGVmIiwic2NvcGVkS2V5U2VjcmV0IjoiY2ZkMGM2ZTJlMmNiNDc3MGFhMmFjOWQzMmNjMWI2YTc4YjhiYjg3NjIyZTgzNjUyOTNjMGI1NTU1N2FhMzZkYSIsImlhdCI6MTY0NTYyMTA4NH0.DE40HejBbPA_4eqGE8xNmlzNGQz8dxog_49Qfx-3iz4';

    public async uploadFile(file: File) {
        const url = `${this.UPLOAD_ENDPOINT}/pinning/pinFileToIPFS`;

        const formData: FormData = new FormData();
        formData.append('file', file);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                pinata_api_key: this.API_KEY,
                pinata_secret_api_key: this.API_SECRET,
            }
        });

        return await response.json() as IUploadFileResponse;
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
