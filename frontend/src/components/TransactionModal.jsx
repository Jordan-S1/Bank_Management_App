import { useState, useEffect } from "react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { useAccountsContext } from "../hooks/useAccountsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const TransactionModal = ({ isOpen, onClose }) => {
  const { dispatch } = useAccountsContext();
  const { user } = useAuthContext();

  const [transaction, setTransaction] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [beneficiary, setBeneficiary] = useState("");
  const [acc_number, setAccountNumber] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [reference, setReference] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [amount, setAmount] = useState("");
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

  //Used to reset all fields when modal is closed
  /* 
  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);
  */

  const resetState = () => {
    setTransaction("");
    setBeneficiary("");
    setAccountNumber("");
    setSelectedAccount("");
    setReference("");
    setTransferTo("");
    setAmount("");
    setError(null);
    setEmptyFields([]);
  };

  const handleTransaction = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const amountValue = parseFloat(amount);
    let newEmptyFields = [];
    let updatedAccount;
    let shouldUpdateAccount = true;
    const selectedAccountObj = accounts.find(
      (account) => account._id === selectedAccount
    );

    const transactionDetails = {
      acc_name: selectedAccountObj?.acc_name || "",
      t_type: transaction,
      amount: amountValue,
      status: "Success",
      reason_code: transaction + " Transaction Successful",
    };

    const paymentDetails = {
      beneficiary: beneficiary,
      b_acc_number: acc_number,
      amount: amountValue,
      status: "Success",
      reference: reference,
      reason_code: "Payment Successful",
    };

    switch (transaction) {
      case "Payment":
        if (!beneficiary) newEmptyFields.push("beneficiary");
        if (!reference) newEmptyFields.push("reference");
        if (!acc_number) newEmptyFields.push("acc_number");
        if (!selectedAccount) newEmptyFields.push("selectedAccount");
        if (!amount) newEmptyFields.push("amount");
        if (newEmptyFields.length > 0) {
          setError("Please fill in all required fields");
          setEmptyFields(newEmptyFields);
          return;
        }

        if (acc_number.length < 8) {
          setError("Account number must be at least 8 digits");
          newEmptyFields.push("acc_number");
          setEmptyFields(newEmptyFields);
          return;
        }

        if (selectedAccountObj.balance < amountValue) {
          newEmptyFields.push("amount");
          setError("Insufficient funds");
          setEmptyFields(newEmptyFields);
          transactionDetails.status = "Failed";
          transactionDetails.reason_code = "Insufficient Funds";
          paymentDetails.status = "Failed";
          paymentDetails.reason_code = "Insufficient Funds";
          shouldUpdateAccount = false;
        }

        updatedAccount = {
          _id: selectedAccount,
          update: {
            balance: selectedAccountObj.balance - amountValue,
          },
        };
        break;
      case "Deposit":
        if (!selectedAccount) newEmptyFields.push("selectedAccount");
        if (!amount) newEmptyFields.push("amount");
        if (newEmptyFields.length > 0) {
          setError("Please fill in all required fields");
          setEmptyFields(newEmptyFields);
          return;
        }
        updatedAccount = {
          _id: selectedAccount,
          update: {
            balance: selectedAccountObj.balance + amountValue,
          },
        };
        break;
      case "Withdraw":
        if (!selectedAccount) newEmptyFields.push("selectedAccount");
        if (!amount) newEmptyFields.push("amount");
        if (newEmptyFields.length > 0) {
          setError("Please fill in all required fields");
          setEmptyFields(newEmptyFields);
          return;
        }

        if (selectedAccountObj.balance < amountValue) {
          newEmptyFields.push("amount");
          setError("Insufficient funds");
          setEmptyFields(newEmptyFields);
          transactionDetails.status = "Failed";
          transactionDetails.reason_code = "Insufficient Funds";
        }

        updatedAccount = {
          _id: selectedAccount,
          update: {
            balance: selectedAccountObj.balance - amountValue,
          },
        };
        break;
      case "Transfer":
        if (!selectedAccount) newEmptyFields.push("selectedAccount");
        if (!amount) newEmptyFields.push("amount");
        if (!transferTo) newEmptyFields.push("transferTo");
        if (newEmptyFields.length > 0) {
          setError("Please fill in all required fields");
          setEmptyFields(newEmptyFields);
          return;
        }

        if (selectedAccountObj.balance < amountValue) {
          newEmptyFields.push("amount");
          setError("Insufficient funds");
          setEmptyFields(newEmptyFields);
          transactionDetails.status = "Failed";
          transactionDetails.reason_code = "Insufficient Funds";
        }

        updatedAccount = [
          {
            _id: selectedAccount,
            update: {
              balance: selectedAccountObj.balance - amountValue,
            },
          },
          {
            _id: transferTo,
            update: {
              balance:
                accounts.find((account) => account._id === transferTo).balance +
                amountValue,
            },
          },
        ];
        break;
      default:
        setError("Please choose a transaction type");
        newEmptyFields.push("transaction");
        setEmptyFields(newEmptyFields);
        return;
    }
    try {
      const transactionResponse = await fetch("/api/transactions", {
        method: "POST",
        body: JSON.stringify(transactionDetails),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const jsont = await transactionResponse.json();

      if (!transactionResponse.ok) {
        setError(jsont.error);
        return;
      }

      if (transactionDetails.status === "Failed") {
        // Only return for non-Payment transactions if failed
        if (transaction !== "Payment") return;
      }

      if (shouldUpdateAccount) {
        if (transaction === "Transfer") {
          //logic for updating selectedAccount and transferTo
          const response1 = await fetch("/api/accounts/" + selectedAccount, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(updatedAccount[0].update),
          });
          const response2 = await fetch("/api/accounts/" + transferTo, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(updatedAccount[1].update),
          });
          const json1 = await response1.json();
          const json2 = await response2.json();

          if (!response1.ok || !response2.ok) {
            setError(json1.error || json2.error);
            return;
          } else {
            resetState();
            onClose();
            console.log("Transaction successful", json1, json2);
            dispatch({ type: "UPDATE_ACCOUNT", payload: json1 });
            dispatch({ type: "UPDATE_ACCOUNT", payload: json2 });
          }
        } else {
          const response = await fetch("/api/accounts/" + selectedAccount, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify(updatedAccount.update),
          });

          const json = await response.json();

          if (!response.ok) {
            setError(json.error);
          } else {
            resetState();
            onClose();
            console.log("Transaction successful", json);
            dispatch({ type: "UPDATE_ACCOUNT", payload: json });
          }
        }
      }
      if (transaction === "Payment") {
        const paymentResponse = await fetch("/api/payments", {
          method: "POST",
          body: JSON.stringify(paymentDetails),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        const jsonp = await paymentResponse.json();

        if (!paymentResponse.ok) {
          setError(jsonp.error);
          return;
        }

        if (paymentDetails.status === "Failed") {
          return;
        }
      }
    } catch (error) {
      setError("Failed to process the transaction");
      return;
    }
    onClose();
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    if (value.length <= 12 && /^\d*$/.test(value)) {
      setAccountNumber(value);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      setAmount(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="rounded-md shadow-lg w-96 max-h-screen flex flex-col">
        <div className="px-10 py-4 rounded-t-md shadow-lg bg-yellow-400 flex items-center text-xl font-medium justify-center text-black">
          <FaMoneyBillTransfer className="mr-2 size-5" />
          Transact
        </div>
        <div className="bg-white px-10 py-6 rounded-b-md shadow-lg dark:bg-neutral-800 flex-1 overflow-auto">
          <select
            value={transaction}
            onChange={(e) => setTransaction(e.target.value)}
            className={
              "border p-2 mb-4 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:cursor-pointer font-semibold " +
              (emptyFields.includes("transaction")
                ? "border-rose-600 dark:border-rose-600"
                : "")
            }
          >
            <option className="dark:bg-neutral-900" value="" disabled>
              --Select Transaction Type--
            </option>
            <option value="Payment">Payment</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdraw">Withdraw</option>
            <option value="Transfer">Transfer</option>
          </select>
          {transaction === "Payment" && (
            <>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">
                  Beneficiary:
                </label>
                <input
                  type="text"
                  value={beneficiary}
                  onChange={(e) => setBeneficiary(e.target.value)}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 " +
                    (emptyFields.includes("beneficiary")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                  placeholder="Enter Beneficiary Name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">
                  Account Number:
                </label>
                <input
                  type="text"
                  value={acc_number}
                  onChange={handleAccountNumberChange}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 " +
                    (emptyFields.includes("acc_number")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                  maxLength="12"
                  placeholder="Enter Account Number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">
                  Select Account:
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:cursor-pointer " +
                    (emptyFields.includes("selectedAccount")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                >
                  <option value="" disabled>
                    --Select Account--
                  </option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.acc_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">
                  Reference:
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 " +
                    (emptyFields.includes("reference")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                  placeholder="Enter Reference"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 " +
                    (emptyFields.includes("amount")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                  placeholder="Enter Amount"
                />
              </div>
            </>
          )}
          {transaction === "Deposit" && (
            <>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">
                  Deposit Into:
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:cursor-pointer " +
                    (emptyFields.includes("selectedAccount")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                >
                  <option value="" disabled>
                    --Select Account--
                  </option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.acc_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 " +
                    (emptyFields.includes("amount")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                  placeholder="Enter Amount"
                />
              </div>
            </>
          )}
          {transaction === "Withdraw" && (
            <>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">
                  Select Account:
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:cursor-pointer " +
                    (emptyFields.includes("selectedAccount")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                >
                  <option value="" disabled>
                    --Select Account--
                  </option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.acc_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 " +
                    (emptyFields.includes("amount")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                  placeholder="Enter Amount"
                />
              </div>
            </>
          )}
          {transaction === "Transfer" && (
            <>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">
                  Transfer From:
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:cursor-pointer " +
                    (emptyFields.includes("selectedAccount")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                >
                  <option value="" disabled>
                    --Select Account--
                  </option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.acc_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">
                  Transfer To:
                </label>
                <select
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 hover:cursor-pointer " +
                    (emptyFields.includes("transferTo")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                >
                  <option value="" disabled>
                    --Select Account--
                  </option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.acc_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm dark:text-white">Amount:</label>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className={
                    "border p-2 w-full rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700 " +
                    (emptyFields.includes("amount")
                      ? "border-rose-600 dark:border-rose-600"
                      : "")
                  }
                  placeholder="Enter Amount"
                />
              </div>
            </>
          )}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-100 px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleTransaction}
              className="px-4 py-2 rounded bg-yellow-400 hover:bg-yellow-200 text-black"
            >
              Pay
            </button>
          </div>
          {error && (
            <div className="mt-4 px-2 py-1 bg-red-100 text-red-600 border border-red-600 rounded">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
