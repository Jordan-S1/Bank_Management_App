import { useEffect, useState } from "react";
import { useAccountsContext } from "../hooks/useAccountsContext";
import { useAuthContext } from "../hooks/useAuthContext";

//components
import AccountDetails from "../components/AccountDetails";
import CreateAccountModal from "../components/CreateAccountModal";
import UpdateAccountModal from "../components/UpdateAccountModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import TransactionModal from "../components/TransactionModal";
import { FaCreditCard, FaWallet } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

const Dashboard = () => {
  const { accounts, totalBalance, accountCount, dispatch } =
    useAccountsContext();
  const { user } = useAuthContext();
  const [isCreateAccountOpen, setCreateAccountOpen] = useState(false);
  const [isUpdateAccountOpen, setUpdateAccountOpen] = useState(false);
  const [isDeleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [isTransactionOpen, setTransactionOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      const response = await fetch("/api/accounts", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ACCOUNTS", payload: json });
      }
    };

    if (user) {
      fetchAccounts();
    }
  }, [dispatch, user]);

  return (
    <div className="p-10">
      <h2 className="dark:text-white text-2xl font-medium mb-4">Dashboard</h2>
      <nav className="mb-7 flex justify-center space-x-16">
        <div className=" p-7 w-fit bg-white rounded shadow-md dark:bg-neutral-900 dark:text-white">
          <h3 className="text-xl flex items-center">
            Total Balance:
            <div className="font-bold ml-1">
              €
              {totalBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </h3>
        </div>
        <div className=" p-7 w-fit bg-white rounded shadow-md dark:bg-neutral-900 dark:text-white ">
          <h3 className="text-xl flex items-center">
            Accounts Created:
            <div className="font-bold ml-1">{accountCount}</div>
          </h3>
        </div>
      </nav>
      <div className="mb-4 flex justify-between relative">
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button
            className="transition ease-in duration-150 hover:scale-110 bg-green-600 hover:bg-green-400 text-white px-4 py-2 rounded shadow-lg flex items-center"
            onClick={() => setCreateAccountOpen(true)}
          >
            <FaCreditCard className="mr-3" />
            Create Account
          </button>
          <div
            className={
              "absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 space-y-1.5 transition-all duration-300 " +
              (isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10")
            }
          >
            <button
              className="transition ease-in duration-150 hover:scale-110 bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded shadow-lg flex items-center text-nowrap w-full"
              onClick={() => setDeleteAccountOpen(true)}
            >
              <FaTrashAlt className="mr-3" />
              Delete Account
            </button>
            <button
              className="transition ease-in duration-150 hover:scale-110 bg-blue-600 hover:bg-blue-400 text-white px-6 py-2 rounded shadow-lg flex items-center text-nowrap w-full"
              onClick={() => setUpdateAccountOpen(true)}
            >
              <FaEdit className="mr-3 size-5" />
              Edit Account
            </button>
          </div>
        </div>
        <button
          className="transition ease-in duration-150 hover:scale-110 px-4 py-2 rounded shadow-lg flex items-center focus:outline-none bg-yellow-400 hover:bg-yellow-200 text-black"
          onClick={() => setTransactionOpen(true)}
        >
          <FaWallet className="mr-3" />
          Start Transaction
        </button>
      </div>

      <div>
        {accounts &&
          accounts.map((account) => (
            <AccountDetails key={account._id} account={account} />
          ))}
      </div>
      <CreateAccountModal
        isOpen={isCreateAccountOpen}
        onClose={() => setCreateAccountOpen(false)}
      />
      <UpdateAccountModal
        isOpen={isUpdateAccountOpen}
        onClose={() => setUpdateAccountOpen(false)}
      />
      <DeleteAccountModal
        isOpen={isDeleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
      />
      <TransactionModal
        isOpen={isTransactionOpen}
        onClose={() => setTransactionOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
