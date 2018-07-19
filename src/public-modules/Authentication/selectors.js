import { createSelector } from 'reselect';

export const rootAuthSelector = state => state.authentication;

export const loginStateSelector = createSelector(
  rootAuthSelector,
  rootAuth => rootAuth.loginState
);

export const getCurrentUserStateSelector = createSelector(
  rootAuthSelector,
  rootAuth => rootAuth.getCurrentUserState
);

export const getCurrentUserSelector = createSelector(
  rootAuthSelector,
  rootAuth => rootAuth.user
);
