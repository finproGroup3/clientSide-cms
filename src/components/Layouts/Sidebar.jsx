"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function Sidebar() {
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleClick = (index) => {
    setClickedIndex(index === clickedIndex ? null : index);
  };

  const isClicked = (index) => index === clickedIndex;

  const menuItems = ["dashboard", "product", "order", "promo"];

  return (
    <div className="h-max w-1/5 flex flex-col items-center bg-white rounded-3xl mx-5 my-8 shadow-lg">
      <div className="w-3/4 flex items-center justify-center py-8 border-b bg-whtie">
        <Image src='/images/Vector.svg' alt="" height={40} width={40}></Image>
        <h1 className="font-bold ml-2 text-2xl">ADMIN</h1>
      </div>
      <ul className="w-3/4">
        {menuItems.map((label, index) => (
          <Link href={`/${label}`} key={index}>
            <li
              className={`bg-white rounded-xl p-5 text-black font-semibold my-3  flex items-center ${
                isClicked(index) ? "shadow-lg" : ""
              }`}
              onClick={() => handleClick(index)}
            >
              <Image
                src={`/images/${label}-icon.png`}
                alt={label}
                height={30}
                width={30}
              />
              <span className="ml-3 text-xl">
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </span>
            </li>
          </Link>
        ))}
        <div>
          <h1 className="text-xl font-semibold">ACCOUNT PAGES</h1>
          <Link href={`/`} >
            <li
              className={`bg-white rounded p-5 text-black font-semibold my-3  flex items-center ${
                isClicked() ? "shadow-lg" : ""
              }`}
              onClick={() => handleClick()}
            >
              <Image
                src={`/images/sign-Out-icon.png`}
                alt='signout'
                height={30}
                width={30}
              />
              <span className="ml-3 text-xl">
                Sign Out
              </span>
            </li>
          </Link>
          <div>
            <Image src={'/images/Need Help.svg'} alt="" width={60} height={80} className="w-full h-96"></Image>
          </div>
        </div>
      </ul>
    </div>
  );
}

export default Sidebar;
