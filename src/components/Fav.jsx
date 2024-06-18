import React, { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
// import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import gsap from "gsap";
import "../index.css";
import { NavLink } from "react-router-dom";
function Fav() {
  const [favorites, setFavorites] = useState([]);
  const [meals, setMeals] = useState([]);
  const [mealdet, setMealdet] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mealToRemove, setMealToRemove] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const existingFavs = JSON.parse(localStorage.getItem("fav")) || [];
      setFavorites(existingFavs);

      const fetchedMeals = await Promise.all(
        existingFavs.map(async (id) => {
          const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
          );
          const data = await response.json();
          return data.meals[0];
        })
      );
      setMeals(fetchedMeals);
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = (id) => {
    setMealToRemove(id);
    setShowConfirmation(true);
  };

  const confirmRemove = () => {
    const updatedFavs = favorites.filter((favId) => favId !== mealToRemove);
    setFavorites(updatedFavs);
    setMeals(meals.filter((meal) => meal.idMeal !== mealToRemove));
    localStorage.setItem("fav", JSON.stringify(updatedFavs));
    setShowConfirmation(false);
    setMealToRemove(null);
  };

  const detail = async (id) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      setMealdet(data.meals[0]);

      gsap.to(".infobox", {
        opacity: 1,
        display: "block",
      });
      gsap.to(".card", {
        filter: "blur(5px)",
      });
    } catch (error) {
      console.error("Error fetching meal details:", error);
    }
  };

  return (
    <>
      <div className="pt-[70px] flex flex-wrap whitespace-pre-wrap justify-center">
        {meals.map((meal) => (
          <div
            key={meal.idMeal}
            className={`card ${
              window.innerWidth <= 600
                ? "w-[250px] h-[110px]"
                : "w-[300px] h-[130px]"
            } bg-black text-white border-2 border-white flex ${
              window.innerWidth <= 600 ? "m-2" : "m-5"
            } overflow-hidden`}
          >
            <div className="imgcont w-[40%] h-full">
              <img
                className="w-full h-full object-cover"
                src={meal.strMealThumb}
                alt={meal.strMeal}
              />
            </div>
            <div className="textcont w-[60%] p-2 flex flex-col justify-between ">
              <h3
                className={` ${
                  window.innerWidth <= 600 ? "p-1" : "p-2"
                } text-base font-medium`}
              >
                {meal.strMeal.length <= 20
                  ? meal.strMeal
                  : `${meal.strMeal.substring(0, 20)}...`}
              </h3>
              <button
                id={meal.idMeal}
                onClick={() => detail(meal.idMeal)}
                className="favmealbt p-1 font-semibold capitalize text-sm bg-black border-2 border-white rounded-3xl"
              >
                details
              </button>
            </div>
            <div className="bt w-[15%] p-2">
              <IoIosCloseCircle
                className="text-2xl cursor-pointer"
                onClick={() => handleRemoveFavorite(meal.idMeal)}
              />
            </div>
          </div>
        ))}
      </div>

      {showConfirmation && (
        <div className="popcont w-[250px] h-[200px] text-center border-white border-2 bg-black opacity-100 rounded-3xl text-white fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] transition-all ease-linear duration-1000">
          <div>
            <h2 className="popt capitalize font-bold text-lg rounded-lg m-8">
              Are you sure?
            </h2>
          </div>
          <div>
            <button
              className="pl-5 m-5 pr-5 p-2 text-lg rounded-full uppercase font-bold bg-white text-black"
              onClick={confirmRemove}
            >
              Yes
            </button>
            <button
              className="pl-5 m-5 pr-5 p-2 text-lg rounded-full uppercase font-bold bg-white text-black"
              onClick={() => setShowConfirmation(false)}
            >
              No
            </button>
          </div>
        </div>
      )}

      {mealdet && (
        <div
          className={`infobox w-[450px] h-[600px] top-[55%] left-[50%] -translate-x-[50%] -translate-y-[50%] bg-black text-white fixed overflow-y-auto p-1 rounded-2xl opacity-1`}
        >
          <div className="flex justify-between p-2">
            <div className="title flex ">
              <h2 className="text-2xl capitalize font-bold">
                {mealdet.strMeal}
              </h2>
            </div>
            <div className="bt">
              <p
                onClick={() => {
                  gsap.to(".infobox", {
                    opacity: 0,
                    display: "none",
                  });

                  gsap.to(".card", {
                    filter: "blur(0px)",
                  });
                }}
              >
                <IoIosCloseCircle className="text-4xl cursor-pointer" />
              </p>
            </div>
          </div>
          <div className="flex justify-between p-2 font-light text-lg">
            <h3>Category: {mealdet.strCategory}</h3>
            <h3>{mealdet.strArea}</h3>
          </div>
          <hr />
          <h3 className="text-xl capitalize p-2 font-bold">Ingredients:</h3>
          <ul>
            {Object.keys(mealdet).map((key, index) => {
              if (key.startsWith("strIngredient") && mealdet[key]) {
                const measureKey = `strMeasure${key.replace(
                  "strIngredient",
                  ""
                )}`;
                return (
                  <li className="p-2" key={index}>
                    {mealdet[measureKey]} {mealdet[key]}
                  </li>
                );
              }
              return null;
            })}
          </ul>
          <hr />
          <h3 className="text-xl capitalize p-2 font-bold">Instructions:</h3>
          <p className="text-lg font-light p-2">{mealdet.strInstructions}</p>
          <hr />
          <div className="bts pl-2 p-10 flex justify-between items-center">
            <button
              className="capitalize text-lg font-bold p-4 bg-red-700 text-white rounded-3xl"
              rel="noopener noreferrer"
              onClick={() => window.open(mealdet.strYoutube)}
            >
              YouTube
            </button>
          </div>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="w-full h-screen bg-black text-white flex justify-center items-center flex-col gap-10">
          <h1 className="text-3xl uppercase text-center font-semibold">
            favorite list is empty
          </h1>
          <button className="bg-white p-3 text-xl rounded-xl text-black capitalize font-medium">
            <NavLink to={"/"}>add recipes</NavLink>
          </button>
        </div>
      ) : (
        " "
      )}
    </>
  );
}

export default Fav;
