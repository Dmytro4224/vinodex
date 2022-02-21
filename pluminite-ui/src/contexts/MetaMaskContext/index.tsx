import React from 'react';
import { ICurrentUser } from '../../types/ICurrentUser';
import detectEthereumProvider from '@metamask/detect-provider';

const initialMetaMaskContext: IMetaMaskContext = {
    user: null,
    setUser: () => { },
    isMetaMaskInstalled: async () => Promise.resolve(false)
}

export interface IMetaMaskContext {
    isMetaMaskInstalled: () => Promise<boolean>;
    user: ICurrentUser | null;
    setUser: (user: ICurrentUser) => void;
}

export const MetaMaskContext = React.createContext<IMetaMaskContext>(initialMetaMaskContext);

interface IMetaMaskProviderProps {
    children?: React.ReactNode;
}

interface IMetaMaskProviderState {
    user: ICurrentUser | null;
}

export class MetaMaskProvider extends React.Component<IMetaMaskProviderProps, IMetaMaskProviderState> {

    private get ethereum() {
        return (window as any).ethereum;
    }

    public isMetaMaskInstalled = async () => {
        const provider = await detectEthereumProvider();
        return provider === window.ethereum;
    }

    public async accounts(): Promise<string[] | null> {
        try {
            return await this.ethereum.request({ method: 'eth_accounts' });
        }
        catch (ex) {
            console.error('accounts', ex);
            return null;
        }
    }

    public async requestAccounts(): Promise<string[] | null> {
        try {
            return await this.ethereum.request({ method: 'eth_requestAccounts' });
        }
        catch (ex) {
            console.error('requestAccounts', ex);
            return null;
        }
    }

    public async chainId(): Promise<string | null> {
        try {
            return await this.ethereum.request({ method: 'eth_chainId' });
        }
        catch (ex) {
            console.error('chainId', ex);
            return null;
        }
    }

    //public connectWallet = async () => {
    //    // Check if MetaMask is installed on user's browser
    //    if (await this.isMetaMaskInstalled()) {
    //        //const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    //        //const raccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //        //const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    //        // Check if user is connected to Mainnet
    //        /if (chainId !== '0x1') {
    //            alert("Please connect to Mainnet");
    //        }
    //        else {
    //            //let wallet = accounts[0];
    //            //setWalletAddress(wallet);
    //        }
    //    }
    //    else {
    //        alert("Please install Mask");
    //    }
    //}

    public setUser = (user: ICurrentUser) => {
        this.setState({ ...this.state, user });
    }

    public render() {
        const value: IMetaMaskContext = {
            isMetaMaskInstalled: this.isMetaMaskInstalled,
            user: this.state.user,
            setUser: this.setUser
        };
        return (
            <MetaMaskContext.Provider value={value}>
                {this.props.children}
            </MetaMaskContext.Provider>
        );
    }
}
