import React from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
type Props = {
  children: React.ReactNode;
};

export default function Dropdown({ children }: Props) {
  return (
    <div>
      <div className="dropdown dropdown-right">
        <div tabIndex={0} role="button">
          <EllipsisHorizontalIcon className="h-6 opacity-50" />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
        >
          {React.Children.map(children, (child, index) => (
            <li key={index}>{child}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
