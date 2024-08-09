import { useAuthContext } from "./useAuthContext";
import { useAccountsContext } from "./useAccountsContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: dispatchAccounts } = useAccountsContext();

  const logout = () => {
    // remove user from storage
    localStorage.removeItem("user");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    dispatchAccounts({ type: "SET_ACCOUNTS", payload: null });
  };

  return { logout };
};
