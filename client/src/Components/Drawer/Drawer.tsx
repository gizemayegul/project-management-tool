import DeleteModal from "../DeleteModal/DeleteModal";
import { Id } from "../../utils/types";
import Edit from "../Edit/Edit";
import { Cog8ToothIcon, ArrowUpOnSquareIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import UploadBackground from "../UploadBackground/UploadBackground";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect } from "react";
import { set } from "mongoose";
type propTypes = {
  id: Id;
  handleDelete: (id: Id) => void;
  showDelete: boolean;
  show: boolean;
  setShow: (show: boolean) => void;
  type: string;
  isDrawerOpen: boolean | undefined;
  setIsDrawerOpen: (isDrawerOpen: boolean) => void;
};

export default function Drawer({
  id,
  handleDelete,
  showDelete,
  show,
  setShow,
  type,
  isDrawerOpen,
  setIsDrawerOpen,
}: propTypes) {
  const [uploadImage, seUploadImage] = useState<boolean>(false);

  return (
    <div>
      <div className="drawer drawer-end z-30 ">
        <input
          checked={isDrawerOpen}
          id="my-drawer-4"
          type="checkbox"
          className="drawer-toggle"
        />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer-4">
            <Cog8ToothIcon className="h-6" />
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 xs:w-1/2 p-4">
            {/* Sidebar content here */}
            <li>
              <DeleteModal
                handleDelete={handleDelete}
                id={id}
                modal={id}
                showDelete={showDelete}
              />
            </li>
            <li
              className="flex"
              onClick={() => {
                setShow(!show);
                setIsDrawerOpen(false);
              }}
            >
              <Edit show={true} />
            </li>
            <li
              onClick={() => {
                seUploadImage(true);
              }}
            >
              {uploadImage ? (
                <UploadBackground id={id} type={type} />
              ) : (
                <div>
                  <ArrowUpOnSquareIcon className="h-4" />
                  Upload Background
                </div>
              )}
            </li>
            {uploadImage && (
              <li
                className="w-full"
                onClick={() => {
                  seUploadImage(false);
                }}
              >
                <XMarkIcon className="h-8" />
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
