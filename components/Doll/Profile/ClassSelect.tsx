import { Class } from "@/src-tauri/bindings/enums";
import { class_src } from "@/utils/helper";
import { useEnumLabel } from "@/utils/hooks/useEnumLabel";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

type Props = {
  value: Class;
  onChangeHandler: (e: Class) => void;
};

/// split the list of classes to a tuple of the selected class and a list
// excluding said class
function split_class(
  current: Class,
  classes: Class[]
): { current: Class; rest: Class[] } {
  let rest = classes.filter((e) => e != current);
  return { current, rest };
}

export const ClassSelect = ({
  value,
  onChangeHandler: handleClassChange,
}: Props) => {
  const classesQuery = useQuery({
    queryKey: ["enum_ls", "Class"],
    queryFn: () => invoke<Class[]>("enum_ls", { name: "Class" }),
  });
  const [hovered, setHovered] = useState(false);

  if (!classesQuery.isSuccess) return null;
  // const { data: classes } = classesQuery;
  const { current, rest } = split_class(value, classesQuery.data);

  return (
    <motion.div
      className="flex"
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Image
        src={class_src(current)}
        alt={class_src(current)}
        width={32}
        height={32}
        className="cursor-pointer"
        onClick={() => setHovered(!hovered)}
      />
      <AnimatePresence>
        {hovered &&
          rest.map((unit_class, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0}}
              animate={{ opacity: 1}}
              exit={{ opacity: 0}}
            >
              <Image
                src={class_src(unit_class)}
                alt={class_src(unit_class)}
                width={32}
                height={32}
                className="cursor-pointer"
                onClick={() => {
                  handleClassChange(unit_class);
                  setHovered(false);
                }}
              />
            </motion.div>
          ))}
      </AnimatePresence>
    </motion.div>
  );
};
