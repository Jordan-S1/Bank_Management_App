import { useState, useEffect } from "react";
import { FaCreditCard } from "react-icons/fa6";
import { useAuthContext } from "../hooks/useAuthContext";

const Transactions = () => {
  const { user } = useAuthContext();
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch("/api/transactions", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok) {
        setTransactions(json);
      } else {
        setError("Failed to fetch transactions");
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user]);

  // Calculate total pages
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);

  // Get current transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-10 flex flex-col dark:text-white ">
      <h2 className="text-2xl font-medium">Transactions</h2>
      <p>Here you can view your previous transactions.</p>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-6 px-4 py-2 rounded-t-md shadow-xl bg-gray-100 items-center flex dark:bg-neutral-900">
        <FaCreditCard className="mr-3" />
        Transaction History
      </div>
      <div className="p-2 bg-white h-fit rounded-b-md dark:bg-neutral-900">
        <table className="w-full bg-gray-100 divide-y divide-gray-200 dark:divide-neutral-700 dark:bg-neutral-800 border-b dark:border-neutral-700 text-center">
          <thead>
            <tr>
              <th
                scope="col"
                className="px-6 py-3 whitespace-nowrap text-center text-xs font-bold text-black uppercase dark:text-white"
              >
                Transaction ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 whitespace-nowrap text-center text-xs font-bold text-black uppercase dark:text-white"
              >
                Account Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 whitespace-nowrap text-center text-xs font-bold text-black uppercase dark:text-white"
              >
                Transaction Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-bold text-black uppercase dark:text-white"
              >
                Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-bold text-black uppercase dark:text-white"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 whitespace-nowrap text-center text-xs font-bold text-black uppercase dark:text-white"
              >
                Reason Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-bold text-black uppercase dark:text-white"
              >
                Created at
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
            {currentTransactions.map((transaction, index) => (
              <tr
                key={transaction._id}
                className="odd:bg-white even:bg-gray-100 dark:odd:bg-neutral-900 dark:even:bg-neutral-800"
              >
                <td className="px-6 py-4 text-sm text-black dark:text-neutral-200">
                  {transactions.length - (indexOfFirstTransaction + index)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                  {transaction.acc_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                  {transaction.t_type}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                  {transaction.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                  {transaction.status}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                  {transaction.reason_code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200">
                  {new Date(transaction.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-100 text-black rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-100 text-black rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
