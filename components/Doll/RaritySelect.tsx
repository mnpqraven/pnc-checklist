import { NEURALEXPANSION, NeuralExpansion } from "@/interfaces/datamodel";
import { ValueOf } from "next/dist/shared/lib/constants";
import Image from "next/image";
import { MouseEvent, useEffect, useState } from "react";
type Props = {
  onChange: (value: ValueOf<typeof NEURALEXPANSION>) => void;
  value: NeuralExpansion;
};
const RaritySelect = ({ onChange, value: neural }: Props) => {
  const default_stars = [
    "star-full",
    "star-full",
    "star-full",
    "star-dark",
    "star-dark",
  ];
  const [starClasses, setStarClasses] = useState(neural_class_conversion(neural));
  const [starDirty, setStarDirty] = useState(neural_class_conversion(neural));

  function neural_class_conversion(neural: NeuralExpansion): string[] {
    let neural_ind = Object.keys(NEURALEXPANSION).indexOf(neural); // a
    let fulls = neural_ind / 2;
    let hasHalf = false;
    if (neural_ind % 2 == 1) {
      fulls = (neural_ind - 1) / 2;
      hasHalf = true;
    }
    return Array(5).fill("").map((_, index) => {
      if (index <= fulls) return "star-full";
      if (index == fulls + 1 && hasHalf) return "star-half";
      else return "star-dark";
    });
  }

  function toEnum(stars: string[]) {
    let fulls = stars.filter((e) => e == "star-full").length;
    let half = stars.filter((e) => e == "star-half").length;
    // ref
    // const entity: ValueOf<typeof NEURALEXPANSION> = "Five";
    let true_ind = (fulls - 1) * 2 + half;
    let rarity = Object.keys(NEURALEXPANSION)[true_ind];
    // console.log(rarity)
    onChange(rarity as NeuralExpansion);
  }

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
    toEnum(starDirty);
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
