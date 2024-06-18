import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagetwo from "./Pagetwo";
import homeimg from "../assets/homepage.png";
import Loading from "./Loading";

function Home() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false); // State for loading screen visibility
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    navigate(`/recipes?search=${encodeURIComponent(inputValue)}`);
  };

  useEffect(() => {
    // Example of loading state control
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulating a loading process for demonstration
  }, []);

  return (
    <>
      <div
        className="w-full h-[700px] bg-black text-center"
        style={{ paddingTop: "70px" }}
      >
        <img
          className="w-full h-full object-cover relative blur-[3px] brightness-50 scale-[0.899]"
          src={homeimg}
          alt="homepage_image"
        />

        <div
          className={`w-full absolute top-[45%] left-[50%] -translate-x-[50%] -translate-y-[50%]`}
        >
          <h1
            className={`
            uppercase text-5xl w-full font-extrabold
            
            `}
            style={{
              fontFamily: "-moz-initial",
            }}
          >
            craving book
          </h1>
          <p className="p-2 mt-4 font-semibold">
            Cooking Made Easy: Find, Cook, and Enjoy!
          </p>
        </div>

        <div
          className={`textcont flex ${
            window.innerWidth >= 600 ? "w-[40%]" : "w-[80%]"
          } absolute top-[75%] left-[50%] -translate-x-[50%] -translate-y-[50%]`}
        >
          <input
            className={`w-full h-[50px] ${
              window.innerWidth <= 700 ? "p-4" : "p-4"
            } text-black rounded-s-3xl border-none outline-none`}
            placeholder="Search by Recipe / ingredient"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            className="h-[50px] pl-4 pr-4 ml-[2px] rounded-e-3xl text-black capitalize font-semibold bg-white"
            onClick={handleButtonClick}
          >
            find
          </button>
        </div>
      </div>
      {/* Loading screen */}
      {loading && (
        <div className="loading_screen pt-16 top-0 left-0 w-full h-screen fixed bg-black flex justify-center items-center">
          <div className="text-white font-bold uppercase tracking-widest text-2xl flex justify-center items-center">
            experience is optimizing...
          </div>
        </div>
      )}

      <Pagetwo />
    </>
  );
}

export default Home;
