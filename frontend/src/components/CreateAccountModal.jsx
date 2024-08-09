import { useState } from "react";
import { FaCreditCard } from "react-icons/fa6";
import { useAccountsContext } from "../hooks/useAccountsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const CreateAccountModal = ({ isOpen, onClose }) => {
  const { dispatch } = useAccountsContext();
  const { user } = useAuthContext();

  const [acc_name, setName] = useState("");
  const [acc_type, setType] = useState("");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  // Function to generate a random 8-12 digit number
  const generateAccNumber = () => {
    return Math.floor(Math.random() * 999999999999 + 10000000);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    const acc_number = generateAccNumber();
    const account = { acc_name, acc_number, acc_type, balance };

    const response = await fetch("/api/accounts", {
      method: "POST",
      body: JSON.stringify(account),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setName("");
      setType("");
      setError(null);
      setEmptyFields([]);
      onClose();
      console.log("New Account added", json);
      dispatch({ type: "CREATE_ACCOUNT", payload: json });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
      <div className="rounded-md shadow-lg w-96">
        <div className="px-10 py-4 rounded-t-md shadow-lg bg-green-700 flex items-center text-xl font-medium justify-center text-white">
          <FaCreditCard className="mr-4" />
          Create a New Account
        </div>
        <div className="bg-white px-10 py-6 rounded-b-md shadow-lg dark:bg-neutral-800">
          <input
            type="text"
            value={acc_name}
            onChange={(e) => setName(e.target.value)}
            className={
              "border p-2 mb-4 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 " +
              (emptyFields.includes("acc_name")
                ? "border-rose-600 dark:border-rose-600"
                : "")
            }
            placeholder="Account Name"
          />
          <select
            value={acc_type}
            onChange={(e) => setType(e.target.value)}
            className={
              "border p-2 mb-4 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:cursor-pointer " +
              (emptyFields.includes("acc_type")
                ? "border-rose-600 dark:border-rose-600"
                : "")
            }
          >
            <option className="dark:bg-neutral-900" value="" disabled>
              --Select Account Type--
            </option>
            <option value="Current">Current</option>
            <option value="Savings">Savings</option>
          </select>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded mr-2 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="bg-green-600 hover:bg-green-400 text-white px-4 py-2 rounded"
            >
              Create
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

export default CreateAccountModal;
