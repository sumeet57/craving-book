import React, { useEffect, useState } from "react";
import { IoBookmarkOutline } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import { IoBookmark } from "react-icons/io5";
import gsap from "gsap";
import "../index.css";

function Recipes() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");

  const [rotation, setRotation] = useState(0);
  const [arr, setArr] = useState([]);
  const [mealInfo, setMealInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInfoBoxVisible, setIsInfoBoxVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [response1, response2, response3, response4] = await Promise.all([
          fetch(
            `https://themealdb.com/api/json/v1/1/filter.php?i=${searchTerm}`
          ),
          fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchTerm}`
          ),
          fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
          ),
          // fetch(
          //   `https://www.themealdb.com/api/json/v1/1/search.php?f=${searchTerm}`
          // ),
        ]);
        const data1 = await response1.json();
        const data2 = await response2.json();
        const data3 = await response3.json();
        // const data4 = await response4.json();

        const combinedData = [
          ...(data1.meals || []),
          ...(data2.meals || []),
          ...(data3.meals || []),
          // ...(data4.meals || []),
        ];

        const uniqueMeals = Array.from(
          new Set(combinedData.map((meal) => meal.idMeal))
        ).map((idMeal) => combinedData.find((meal) => meal.idMeal === idMeal));

        setArr(uniqueMeals);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (searchTerm) {
      fetchData();
    }
  }, [searchTerm]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prevRotation) => prevRotation + 50);
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleClick = async (id) => {
    if (loading) return;

    setLoading(true);
    setIsInfoBoxVisible(false);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      setMealInfo(data.meals[0]);

      gsap.to(".boxr", {
        filter: "blur(5px)",
      });

      setIsInfoBoxVisible(true);
    } catch (error) {
      console.error("Error fetching meal info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    gsap.to(".infobox", {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setIsInfoBoxVisible(false);
        setMealInfo(null);
        gsap.to(".boxr", {
          filter: "blur(0px)",
        });
      },
    });
  };

  const handleAddToFavorites = (id) => {
    let existingFavs = JSON.parse(localStorage.getItem("fav")) || [];

    if (!existingFavs.includes(id)) {
      existingFavs.push(id);
      localStorage.setItem("fav", JSON.stringify(existingFavs));
      document.querySelector(".popt").innerHTML = "Added to favourites";
      gsap.to(".popbox", {
        opacity: 1,
        display: "block",
      });
    } else {
      document.querySelector(".popt").innerHTML = "Already in favourites";
      gsap.to(".popbox", {
        opacity: 1,
        display: "block",
      });
    }
  };

  const isFavorite = (id) => {
    const fav = JSON.parse(localStorage.getItem("fav")) || [];
    return fav.includes(id);
  };

  return (
    <>
      {loading && (
        <div className="loading_screen w-full h-screen fixed bg-black flex justify-center items-center">
          <div className="text-white text-3xl flex justify-center items-center">
            <div
              className={`w-[50px] h-[50px] bg-transparent border-r-4 border-b-4 border-white rounded-3xl transition-all ease-linear duration-500`}
              style={{ transform: `rotate(${rotation}deg)` }}
            ></div>
          </div>
        </div>
      )}
      <div className="main_recipes bg-zinc-800 pt-[70px]">
        <div className="cont pt-6 pb-3 p-1 flex justify-center flex-wrap whitespace-pre-wrap">
          {arr.map((e) => (
            <div
              key={e.idMeal}
              id={e.idMeal}
              className={`boxr w-[200px] h-[350px] ${
                window.innerWidth <= 500 ? "m-2" : "m-4"
              } bg-black text-white rounded-xl flex justify-evenly items-center flex-col cursor-pointer`}
              onClick={() => handleClick(e.idMeal)}
            >
              <h3 className="text-lg p-2 capitalize font-serif font-semibold">
                {e.strMeal
                  ? e.strMeal.length <= 20
                    ? e.strMeal
                    : `${e.strMeal.substring(0, 20)}...`
                  : ""}
              </h3>

              <img
                decoding="async"
                loading="lazy"
                src={e.strMealThumb}
                alt=""
              />
              <div className="contr w-full h-full flex justify-evenly items-center">
                <button className="bt p-2 rounded-2xl capitalize font-semibold bg-black border-2 border-white">
                  See more
                </button>
                <span
                  className=" bt p-2 rounded-xl capitalize font-semibold bg-black border-2 border-white cursor-pointer"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAddToFavorites(e.idMeal);
                  }}
                >
                  {isFavorite(e.idMeal) ? (
                    <IoBookmark
                      className={`${
                        window.innerWidth <= 700 ? "text-[4vw]" : "text-lg"
                      }`}
                    />
                  ) : (
                    <IoBookmarkOutline
                      className={`text-white ${
                        window.innerWidth <= 700 ? "text-[4vw]" : "text-lg"
                      }`}
                    />
                  )}
                </span>
              </div>
            </div>
          ))}
          {isInfoBoxVisible && mealInfo && (
            <div className="infobox w-[450px] h-[600px] bg-black text-white fixed overflow-y-auto p-1 rounded-2xl opacity-1">
              <div className="flex justify-between p-2 ">
                <div className="title flex">
                  <h2 className="text-2xl capitalize font-bold">
                    {mealInfo.strMeal}
                  </h2>
                </div>
                <div className="bt">
                  <p onClick={handleClose}>
                    <IoIosCloseCircle className="text-4xl cursor-pointer" />
                  </p>
                </div>
              </div>
              <div className="flex justify-between p-2 font-light text-lg">
                <h3>Category: {mealInfo.strCategory}</h3>
                <h3>{mealInfo.strArea}</h3>
              </div>
              <hr />
              <h3 className="text-xl capitalize p-2 font-bold">Ingredients:</h3>

              {Object.keys(mealInfo).map((key, index) => {
                if (key.startsWith("strIngredient") && mealInfo[key]) {
                  const measureKey = `strMeasure${key.replace(
                    "strIngredient",
                    ""
                  )}`;
                  return (
                    <li className="p-2" key={index}>
                      {mealInfo[measureKey]} {mealInfo[key]}
                    </li>
                  );
                }
                return null;
              })}

              <hr />
              <h3 className="text-xl capitalize p-2 font-bold">
                Instructions:
              </h3>
              <p className="text-lg font-light p-2">
                {mealInfo.strInstructions}
              </p>
              <hr />
              <div className="bts pl-2 p-10 flex justify-between items-center">
                <button
                  className="capitalize text-lg font-bold p-4 bg-red-700 text-white rounded-3xl"
                  rel="noopener noreferrer"
                  onClick={() => window.open(mealInfo.strYoutube)}
                >
                  YouTube
                </button>
                <button
                  className="p-4 rounded-3xl capitalize font-semibold bg-black border-2 border-white"
                  onClick={() => handleAddToFavorites(mealInfo.idMeal)}
                >
                  {isFavorite(mealInfo.idMeal) ? (
                    <IoBookmark className="text-white text-lg" />
                  ) : (
                    <IoBookmarkOutline className="text-white text-lg" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="popbox w-[250px] h-[200px] text-center border-white border-2 bg-black opacity-0 hidden rounded-3xl text-white fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
        <div>
          <h2 className="popt capitalize font-bold text-lg rounded-lg m-8">
            Added to favourite
          </h2>
        </div>
        <div>
          <button
            className="pl-5 m-5 pr-5 p-2 text-lg rounded-full uppercase font-bold bg-white text-black"
            onClick={() => {
              gsap.to(".popbox", {
                display: "none",
                opacity: 0,
              });
            }}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}

export default Recipes;
