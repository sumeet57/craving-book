import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import inimg from "../assets/indianarea.jpg";
import aimg from "../assets/americanarea.jpg";
import cimg from "../assets/chinesearea.jpg";
import itimg from "../assets/italianarea.jpg";
import rimg from "../assets/russianarea.jpg";
import fimg from "../assets/frencharea.jpg";
import simg from "../assets/spanisharea.jpg";
import timg from "../assets/thaiarea.jpg";
import "../index.css";

const Pagetwo = () => {
  const navigate = useNavigate();
  const elementsRef = useRef([]);

  const arealist = [
    { img: inimg, name: "indian" },
    { img: simg, name: "spanish" },
    { img: aimg, name: "american" },
    { img: itimg, name: "italian" },
    { img: cimg, name: "chinese" },
    { img: fimg, name: "french" },
    { img: timg, name: "thai" },
    { img: rimg, name: "russian" },
  ];

  useEffect(() => {
    const handleNavigation = (event) => {
      const clickedId = event.currentTarget.id;
      navigate(`/recipes?search=${encodeURIComponent(clickedId)}`);
    };

    elementsRef.current.forEach((element) => {
      if (element) {
        element.addEventListener("click", handleNavigation);
      }
    });

    return () => {
      elementsRef.current.forEach((element) => {
        if (element) {
          element.removeEventListener("click", handleNavigation);
        }
      });
    };
  }, [navigate]);

  return (
    <>
      <div className="page2 w-full h-full scale-[0.899] bg-zinc-800">
        <div className="cont w-full p-10 flex flex-wrap whitespace-normal gap-[50px] text-center justify-center">
          {arealist.map((e, index) => (
            <div
              id={e.name}
              key={e.name}
              className="box w-[200px] h-[300px] bg-gray-300 rounded-2xl overflow-hidden"
              ref={(el) => (elementsRef.current[index] = el)}
            >
              <div className="imgcont w-full h-[80%]">
                <img
                  className="w-full h-full object-cover"
                  src={e.img}
                  alt={`${e.name}_image`}
                />
              </div>
              <div className="textcont h-[20%] w-full flex justify-center items-center">
                <p className="uppercase text-xl text-center text-black font-semibold">
                  {e.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Pagetwo;
