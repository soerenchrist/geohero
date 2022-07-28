import { ComponentPropsWithRef } from "react";

type Props = {
  variant?: "primary" | "secondary";
};

export const Button: React.FC<ComponentPropsWithRef<"button"> & Props> = (
  props
) => {
  const classes =
    props.variant === "secondary"
      ? "w-48 h-16 text-lg font-medium rounded-full hover:scale-105 bg-brand text-white border-solid border-white border"
      : "w-48 h-16 text-lg font-medium rounded-full hover:scale-105 text-brand bg-white";
  return (
    <button
      className={classes + " " + (props.className ?? "")}
      ref={props.ref}
      {...props}
    ></button>
  );
};
