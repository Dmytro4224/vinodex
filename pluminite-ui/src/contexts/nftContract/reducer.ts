import { CLEAR_STATE } from './types';

export const initialNftContractState = {
    nftContract: null
};

export const nftContractReducer = (currentState = initialNftContractState, action) => {
  switch (action.type) {
    case CLEAR_STATE:
    default:
      return initialNftContractState;
  }
};
