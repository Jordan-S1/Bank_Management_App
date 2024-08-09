import React from "react";

const Credits = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-purple-700 dark:bg-neutral-900 dark:text-green-500">
      <h1 className="text-4xl font-bold mb-6">Credits</h1>
      <ul className="list-disc space-y-4">
        <li>
          <a
            href="https://www.flaticon.com/free-icon/dollar_9382189?term=coin&page=1&position=49&origin=tag&related_id=9382189"
            title="coin icons"
            className="text-blue-500 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Coin icon created by NajmunNahar - Flaticon
          </a>
        </li>
        <li>
          <a
            href="https://www.freepik.com/free-vector/bank-building-with-cityscape_13187569.htm#fromView=search&page=1&position=0&uuid=b789dddf-7536-4c5c-95c0-b38819d9b844"
            className="text-blue-500 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bank Building image by macrovector - Freepik
          </a>
        </li>
        <li>
          <a
            href="https://www.freepik.com/free-vector/gold-luxury-background_9177162.htm#fromView=search&page=1&position=13&uuid=fc9be963-25db-4ca7-bdf1-2ac4d94ae8e1"
            className="text-blue-500 dark:text-blue-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gold Background image by Freepik
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Credits;
