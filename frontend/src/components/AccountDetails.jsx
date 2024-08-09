import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
const AccountDetails = ({ account }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State to track dropdown visibility

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="mb-2 flex flex-col justify-center">
      <button
        className="p-4 bg-white font-medium dark:bg-neutral-900 dark:text-white rounded-sm shadow-xl flex items-center flex justify-between focus:outline-none border border-gray-300 dark:border dark:border-neutral-800"
        onClick={toggleDropdown}
      >
        <h3 className="text-xl text-justify">{account.acc_name}</h3>
        <MdKeyboardArrowDown
          className={
            "transition duration-500 size-7 " +
            (dropdownOpen ? "-rotate-180" : "rotate-0")
          }
        />
      </button>

      <div
        className={
          "transition-max-height duration-500 ease-in-out overflow-hidden " +
          (dropdownOpen ? "max-h-96" : "max-h-0")
        }
      >
        <table className="table-auto bg-white dark:text-white dark:bg-neutral-900 shadow-xl rounded-sm border border-gray-200 dark:border dark:border-neutral-800 w-full">
          <tbody className="divide-y divide-gray-300 dark:divide-neutral-800">
            <tr>
              <td className="px-4 py-2">Account Name</td>
              <td className="px-4 py-2 font-bold text-right">
                {account.acc_name}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">Account Number</td>
              <td className="px-4 py-2 font-bold text-right">
                {account.acc_number}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">Account Type</td>
              <td className="px-4 py-2 font-bold text-right">
                {account.acc_type}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2">Account Balance</td>
              <td className="px-4 py-2 font-bold text-right">
                {account.balance}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 ">Created</td>
              <td className="px-4 py-2 font-bold text-right">
                {formatDistanceToNow(new Date(account.createdAt), {
                  addSuffix: true,
                })}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountDetails;
