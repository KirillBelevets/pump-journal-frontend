"use client";
import { ReactNode, useRef, RefObject } from "react";

export type Focusable = HTMLInputElement;

type FocusWrapperProps = {
  children: (ref: RefObject<Focusable>) => ReactNode;
  selectOnFocus?: boolean;
};

export function FocusWrapper({
  children,
  selectOnFocus = false,
}: FocusWrapperProps) {
  const ref = useRef<Focusable>(null) as RefObject<Focusable>;

  const handleClick = () => {
    console.log("Wrapper clicked");
    console.log("ref.current =", ref.current);
    console.log("Active", document.activeElement);

    if (ref.current) {
      if (document.activeElement !== ref.current) {
        ref.current.focus();
      }
      if (selectOnFocus) {
        ref.current.select();
      }
    }
  };

  return (
    <div className="cursor-text" onClick={handleClick}>
      {children(ref)}
    </div>
  );
}
