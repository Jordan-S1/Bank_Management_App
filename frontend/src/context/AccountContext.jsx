import { createContext, useReducer } from "react";

export const AccountsContext = createContext();

export const accountsReducer = (state, action) => {
  switch (action.type) {
    case "SET_ACCOUNTS":
      const accounts = action.payload || [];
      const totalBalance = accounts.reduce(
        (sum, account) => sum + account.balance,
        0
      );
      return {
        ...state,
        accounts,
        totalBalance,
        accountCount: accounts.length,
      };
    case "CREATE_ACCOUNT":
      const updatedAccounts = [action.payload, ...state.accounts];
      const updatedTotalBalance = updatedAccounts.reduce(
        (sum, account) => sum + account.balance,
        0
      );
      return {
        ...state,
        accounts: updatedAccounts,
        totalBalance: updatedTotalBalance,
        accountCount: updatedAccounts.length,
      };
    case "UPDATE_ACCOUNT":
      const editedAccounts = state.accounts.map((account) =>
        account._id === action.payload._id ? action.payload : account
      );
      const editedTotalBalance = editedAccounts.reduce(
        (sum, account) => sum + account.balance,
        0
      );
      return {
        ...state,
        accounts: editedAccounts,
        totalBalance: editedTotalBalance,
        accountCount: editedAccounts.length,
      };
    case "DELETE_ACCOUNT":
      const filteredAccounts = state.accounts.filter(
        (account) => account._id !== action.payload._id
      );
      const newTotalBalance = filteredAccounts.reduce(
        (sum, account) => sum + account.balance,
        0
      );
      return {
        ...state,
        accounts: filteredAccounts,
        totalBalance: newTotalBalance,
        accountCount: filteredAccounts.length,
      };
    default:
      return state;
  }
};

export const AccountsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(accountsReducer, {
    accounts: null,
    totalBalance: 0,
    accountCount: 0,
  });

  return (
    <AccountsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AccountsContext.Provider>
  );
};
