import { motion } from "framer-motion";
import { MouseEventHandler, ReactNode } from "react";

type Props = {
  children?: ReactNode;
  onClick: MouseEventHandler<HTMLDivElement>;
};
export const Backdrop = ({ children, onClick }: Props) => {
  return (
    <motion.div
      className="backdrop"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};
