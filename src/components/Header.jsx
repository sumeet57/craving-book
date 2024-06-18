import React from "react";
import { BiSolidBookBookmark } from "react-icons/bi";
import { Link } from "react-router-dom";

function Header() {
  return (
    <>
      <header className="w-full fixed z-50">
        <nav className="w-full h-[70px] bg-zinc-600 flex justify-between items-center p-5">
          <h3
            className="text-3xl tracking-wider"
            style={{ fontFamily: "Poetsen One" }}
          >
            CravinG
          </h3>
          <div>
            <Link to={"/fav"}>
              <BiSolidBookBookmark className="text-2xl" />
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
