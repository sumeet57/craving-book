import React from "react";
import gsap from "gsap";

function Popbox() {
  return (
    <>
      <div className="popbox w-[250px] h-[200px] bg-black flex opacity-0 hidden flex-col rounded-3xl justify-evenly items-center text-white fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        <div>
          <h2 className="capitalize font-bold text-lg rounded-lg">
            added to favourite
          </h2>
        </div>
        <div>
          <button
            className="pl-5 pr-5 p-2 text-lg rounded-full uppercase font-bold bg-white text-black"
            onClick={() => {
              gsap(".popbox", {
                display: "none",
                opacity: 0,
              });
            }}
          >
            ok
          </button>
        </div>
      </div>
    </>
  );
}

export default Popbox;
