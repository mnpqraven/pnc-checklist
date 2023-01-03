import Image from "next/image";
import { MouseEvent, MouseEventHandler, useEffect, useState } from "react";
const RaritySelect = () => {
  const default_stars = [
    "star-full",
    "star-full",
    "star-full",
    "star-dark",
    "star-dark",
  ];
  const [starClasses, setStarClasses] = useState(default_stars);
  const [starDirty, setStarDirty] = useState(default_stars);

  function mouseMove(
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
    index: number
  ) {
    let bcr = e.currentTarget.getBoundingClientRect();
    if (e.clientX - bcr.left < bcr.width * 0.5 && index != 0) {
      setStarDirty(
        starDirty.map((e, i) => {
          if (i == index) return "star-half";
          if (i < index) return "star-full";
          else return "star-dark";
        })
      );
    } else
      setStarDirty(
        starDirty.map((e, i) => {
          if (i <= index) return "star-full";
          else return "star-dark";
        })
      );
  }

  function updateStars() {
    setStarClasses(starDirty);
  }
  function resetStars() {
    setStarDirty(starClasses);
  }

  return (
    <>
      <div id="stars">
        {starDirty.map((className, index) => (
          <div
            id={`star${index}`}
            key={index}
            onMouseMove={(e) => mouseMove(e, index)}
            onMouseLeave={resetStars}
            onClick={updateStars}
            className={className}
          >
            {["star-full", "star-half"].map((name, index2) => (
              <Image
                key={index2}
                src={`common/${name}.png`}
                alt={`${name}-${index2}`}
                width={51}
                height={55}
              />
            ))}
          </div>
        ))}
      </div>
    </>
  );
};
export default RaritySelect;
