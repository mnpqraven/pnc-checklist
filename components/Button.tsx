import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";

interface Props extends HTMLMotionProps<"button"> {
  onClick?: () => void;
  className?: string;
  label?: string;
}
const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const className = `Button ${
    props.className ? props.className : `big violet`
  }`;

  return (
    <motion.button
      {...props}
      className={className}
      ref={ref}
      // onClick={props.onClick}
      onClick={props.onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <>
        {props.label}
        {props.children}
      </>
    </motion.button>
  );
});
Button.displayName = "Button";
export default Button;
