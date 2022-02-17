import React, { useReducer, useEffect, Component } from 'react';

import { initialNearState, nearReducer } from './reducer';
import { CLEAR_STATE, LOADING_ERROR, LOADING_START, LOADING_SUCCESS, SET_USER } from './types';

import { ReactChildrenTypeRequired } from '../../types/ReactChildrenTypes';
import { NearConfigTypeShape, NearTypeShape, UserTypeShape, WalletTypeShape } from '../../types/NearTypes';

import { APP } from '../../constants';
import { ICurrentUser } from '../../types/ICurrentUser';
import { Near, WalletConnection } from 'near-api-js';
import { IConfig } from '../../config';

export const NearContext = React.createContext({
    ...initialNearState,
    nearContent: void 0,
    signIn: () => { },
    signOut: () => { },
    startLoading: () => { },
    setUser: (user: ICurrentUser) => { }
});

interface INearContext {

}

interface INearContextProvider {
    currentUser: ICurrentUser | null;
    nearConfig: IConfig;
    wallet: WalletConnection;
    near: Near;
    children: any;
}

interface INearContextState {
    user: ICurrentUser | null;
    isLoading: boolean;
    error: Error | null;
}

export class NearContextProvider extends Component<INearContextProvider, INearContextState> {
    public state: INearContextState = {
        user: null,
        isLoading: true,
        error: null
    };

    public setUser = (user: ICurrentUser) => {
        this.setState({
            ...this.state,
            user
        });
    }

    public loadingStart() {
        this.setState({
            ...this.state,
            isLoading: true,
            error: null
        });
    }

    public loadingSuccess() {
        this.setState({
            ...this.state,
            isLoading: false,
            error: null
        });
    }

    public clearState() {
        this.setState({ ...initialNearState });
    }

    constructor(props: INearContextProvider) {
        super(props);
    }

    private get nearConfig() {
        return this.props.nearConfig;
    }

    private get wallet() {
        return this.props.wallet;
    }

    public signIn = () => {
        this.wallet.requestSignIn(this.nearConfig.contractName, `NEAR ${APP.NAME}`, `${window.location.origin}/#/mint`);
    };

    public signOut = () => {
        this.wallet.signOut();

        this.clearState();

        window.location.reload();
    };

    public render() {
        return (
            <NearContext.Provider
                value={{
                    //@ts-ignore
                    user: this.state.user,
                    setUser: this.setUser,
                    isLoading: this.state.isLoading,
                    //@ts-ignore
                    nearContent: this.props.near,
                    signIn: this.signIn,
                    signOut: this.signOut
                }}
            >
                {this.props.children}
            </NearContext.Provider>
        );
    }
}

/*
export const NearContextProvider = ({ currentUser, nearConfig, wallet, near, children }: { currentUser: ICurrentUser, nearConfig: IConfig, wallet: WalletConnection, near: Near, children: any }) => {
  const [nearState, dispatchNear] = useReducer(nearReducer, initialNearState);

  const setUser = (user) => {
    dispatchNear({ type: SET_USER, payload: { user } });
  };

  const loadingStart = () => {
    dispatchNear({ type: LOADING_START });
  };

  const loadingSuccess = () => {
    dispatchNear({ type: LOADING_SUCCESS });
  };

    const loadingError = (error: Error | string) => {
    dispatchNear({ type: LOADING_ERROR, payload: { error } });
  };

  const clearState = () => {
    dispatchNear({ type: CLEAR_STATE });
  };

  const signIn = () => {
    wallet.requestSignIn(nearConfig.contractName, `NEAR ${APP.NAME}`, `${window.location.origin}/#/mint`);
  };
  const signOut = () => {
    wallet.signOut();

    clearState();

    window.location.reload();
  };

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length) {
      setUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!nearState.user && !nearState.isLoading && !nearState.error) {
      loadingStart();
    }
  }, [nearState]);

  useEffect(() => {
    if (nearState.user && nearState.isLoading) {
      loadingSuccess();
    }
  }, [nearState]);

  useEffect(() => {
    if (!nearState.user && !localStorage.getItem('undefined_wallet_auth_key') && !nearState.error) {
      localStorage.clear();
      loadingError('wallet not found');
    }
  }, [nearState]);

  return (
    <NearContext.Provider
      value={{
        user: nearState.user,
        isLoading: nearState.isLoading,
        nearContent: near,
        signIn,
        signOut,
      }}
    >
      {children}
    </NearContext.Provider>
  );
};

NearContextProvider.propTypes = {
  nearConfig: NearConfigTypeShape.isRequired,
  near: NearTypeShape.isRequired,
  wallet: WalletTypeShape.isRequired,
  currentUser: UserTypeShape,
  children: ReactChildrenTypeRequired,
};
*/