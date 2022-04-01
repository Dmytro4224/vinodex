import React from 'react';
import ReactDOM from 'react-dom';

import  App  from './components/app/App';
import { initContracts } from './utils';
import { NearContextProvider, NftContractContextProvider } from './contexts';
import { BrowserRouter } from "react-router-dom";

import './index.css';

const rootElement = document.getElementById('root');

//window.nearInitPromise =
initContracts()
  .then(({ nftContract, currentUser, nearConfig, walletConnection, near }) => {
    const app = (
      <NearContextProvider user={currentUser} nearConfig={nearConfig} wallet={walletConnection} near={near}>
        <NftContractContextProvider nftContract={nftContract}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NftContractContextProvider>
      </NearContextProvider>
    );
    ReactDOM.render(app, rootElement);
  })
  .catch((error: Error) => {
    console.error(error);

    ReactDOM.render(
      <>
        <div>{error}</div>
      </>,
      rootElement
    );
  })
  .catch((error: Error) => {
    console.error(error);

    ReactDOM.render(
      <div
        style={{
          fontSize: '66px',
          textTransform: 'uppercase',
          fontFamily: "'Staatliches', sans-serif",
          color: 'rgb(255, 121, 237)',
        }}
      >
        Sorry :( <br /> There was an unexpected error
      </div>,
      rootElement
    );
  })
  .finally(() => {
    rootElement?.classList.remove('loading');
  });
