import { ComponentPropsWithRef } from "react";

type Props = {
  variant?: "primary" | "secondary";
} & ComponentPropsWithRef<"button">;

export const Button: React.FC< & Props> = (
  props
) => {
  const classes =
    props.variant === "secondary"
      ? "w-48 h-16 text-lg font-medium rounded-full hover:scale-105 bg-brand text-white border-solid border-white border"
      : "w-48 h-16 text-lg disabled:bg-gray-300 font-medium rounded-full enabled:hover:scale-105 text-brand bg-white";

  return (
    <button
    ref={props.ref}
    {...props}
    className={`${classes} ${props.className ?? ""}`}
    ></button>
  );
};
