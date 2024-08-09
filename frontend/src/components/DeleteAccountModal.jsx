import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useAccountsContext } from "../hooks/useAccountsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const DeleteAccountModal = ({ isOpen, onClose }) => {
  const { dispatch } = useAccountsContext();
  const { user } = useAuthContext();

  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const response = await fetch("/api/accounts", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();

      if (response.ok) {
        setAccounts(json);
      } else {
        setError("Failed to fetch accounts");
      }
    };

    if (isOpen && user) {
      fetchAccounts();
    }
  }, [isOpen, user]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    if (!selectedAccountId) {
      setError("Please select an account to delete");
      setEmptyFields(["selectedAccountId"]);
      return;
    }

    const response = await fetch("/api/accounts/" + selectedAccountId, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    } else {
      setSelectedAccountId("");
      setError(null);
      setEmptyFields([]);
      onClose();
      console.log("Account deleted", json);
      dispatch({ type: "DELETE_ACCOUNT", payload: json });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
      <div className="rounded-md shadow-lg w-96">
        <div className="px-10 py-4 rounded-t-md shadow-lg bg-red-700 flex items-center text-xl font-medium justify-center text-white">
          <FaTrashAlt className="mr-4" />
          Delete an Account
        </div>
        <div className="bg-white px-10 py-6 rounded-b-md shadow-lg dark:bg-neutral-800">
          <select
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
            className={
              "border p-2 mb-4 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:cursor-pointer " +
              (emptyFields.includes("selectedAccountId")
                ? "border-rose-600 dark:border-rose-600"
                : "")
            }
          >
            <option className="dark:bg-neutral-900" value="" disabled>
              --Select Account Name--
            </option>
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.acc_name}
              </option>
            ))}
          </select>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-400 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
          {error && (
            <div className="mt-4 px-2 py-1 bg-red-100 text-rose-600 border border-rose-600 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
