// todo: get contract name from environment variable
const CONTRACT_NAME = 'vinodex_test_v20.testnet';
//const CONTRACT_NAME = 'vinodex_uat_02.testnet';

export interface IConfig {
    networkId: 'production' | 'mainnet' | 'development' | 'testnet' | 'betanet' | 'local' | 'test' | 'ci' | 'ci-betanet' | 'shared-test' | 'shared-test-staging';
    nodeUrl: string;
    contractName: string;
    walletUrl: string;
    helperUrl: string;
    explorerUrl: string;
    headers: { [key: string]: string };

    masterAccount?: string;
    keyPath?: string;
}

function getConfig(env: string): IConfig {
    switch (env) {
        //case 'production':
        //case 'mainnet':
        //    return {
        //        networkId: 'mainnet',
        //        nodeUrl: 'https://rpc.mainnet.near.org',
        //        contractName: 'pluminite.near',
        //        walletUrl: 'https://wallet.near.org',
        //        helperUrl: 'https://helper.mainnet.near.org',
        //        explorerUrl: 'https://explorer.mainnet.near.org',
        //        headers: {}
        //};
      case 'mainnet':
        case 'production':
        case 'development':
        case 'testnet':
            return {
                networkId: 'testnet',
                nodeUrl: 'https://rpc.testnet.near.org',
                contractName: CONTRACT_NAME,
                walletUrl: 'https://wallet.testnet.near.org',
                helperUrl: 'https://helper.testnet.near.org',
                explorerUrl: 'https://explorer.testnet.near.org',
                headers: {}
            };
        case 'betanet':
            return {
                networkId: 'betanet',
                nodeUrl: 'https://rpc.betanet.near.org',
                contractName: CONTRACT_NAME,
                walletUrl: 'https://wallet.betanet.near.org',
                helperUrl: 'https://helper.betanet.near.org',
                explorerUrl: 'https://explorer.betanet.near.org',
                headers: {}
            };
        /*
      case 'local':
        return {
          networkId: 'local',
          nodeUrl: 'http://localhost:3030',
          keyPath: `${process.env.HOME}/.near/validator_key.json`,
          walletUrl: 'http://localhost:4000/wallet',
            contractName: CONTRACT_NAME,
            headers: {}
        };
      case 'test':
      case 'ci':
        return {
          networkId: 'shared-test',
          nodeUrl: 'https://rpc.ci-testnet.near.org',
          contractName: CONTRACT_NAME,
            masterAccount: 'test.near',
            headers: {}
        };
      case 'ci-betanet':
        return {
          networkId: 'shared-test-staging',
          nodeUrl: 'https://rpc.ci-betanet.near.org',
          contractName: CONTRACT_NAME,
            masterAccount: 'test.near',
            headers: {}
            };
        */
        default:
            throw Error(`Unconfigured environment '${env}'. Can be configured in src/config.js.`);
    }
}

export { getConfig }
