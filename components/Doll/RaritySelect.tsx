import { NeuralExpansion } from "@/src-tauri/bindings/enums";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import { MouseEvent, useCallback, useEffect, useState } from "react";
type Props = {
  onChange: (value: NeuralExpansion) => void;
  value: NeuralExpansion;
};
const RaritySelect = ({ onChange, value: neural }: Props) => {
  const [NEURALEXPANSION, setNEURALEXPANSION] = useState<string[]>([])
  const [starClasses, setStarClasses] = useState<string[]>([]);
  const [starDirty, setStarDirty] = useState<string[]>([]);
  useEffect(() => {
    invoke<string[]>('enum_ls', {name: 'NeuralExpansion'})
    .then(setNEURALEXPANSION)
  }, [])

  const neural_conv = useCallback((neural: NeuralExpansion): string[] => {
    let neural_ind = NEURALEXPANSION.indexOf(neural); // a
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
  }, [NEURALEXPANSION])

  useEffect(() => {
    setStarClasses(neural_conv(neural))
    setStarDirty(neural_conv(neural))
  }, [neural, neural_conv])

  function toEnum(stars: string[]) {
    let fulls = stars.filter((e) => e == "star-full").length;
    let half = stars.filter((e) => e == "star-half").length;
    let true_ind = (fulls - 1) * 2 + half;
    onChange(NEURALEXPANSION[true_ind] as NeuralExpansion);
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
