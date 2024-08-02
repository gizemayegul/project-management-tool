import { useContext, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/20/solid";

export default function Profile() {
  const {
    logOutUser,
    handleSubmitFile,
    setIsLineLoading,
    handleFileChange,
    isLineLoading,
    user,
    handleUpdate,
    userUpdate,
    setUserUpdate,
    selectedFile,
    handleUserDelete,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center relative space-y-6">
      <img
        className="inline-block h-40 w-40 rounded-full ring-2 ring-white border-8"
        src={user?.image ?? ""}
        alt=""
      />
      <form
        className="flex flex-col lg:w-3/12 space-y-4"
        onSubmit={(e) => {
          handleSubmitFile(e);
          setIsLineLoading(true);
        }}
      >
        <input
          type="file"
          id="file"
          name="file"
          className=" w-full max-w-xs mb-2"
          onChange={(e) => {
            handleFileChange(e);
          }}
        />

        <button
          type="submit"
          className="btn"
          disabled={selectedFile ? false : true}
        >
          {isLineLoading ? (
            <span className="loading loading-dots loading-lg"></span>
          ) : (
            <span className="dark:text-white">Submit</span>
          )}
        </button>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e);
        }}
        className="flex flex-col lg:w-3/12 space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="input input-bordered w-full "
          value={userUpdate?.name}
          onChange={(e) => {
            setUserUpdate({
              ...userUpdate,
              name: e.target.value,
            });
            console.log(e.target.value);
          }}
        />
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="input input-bordered w-full"
          value={userUpdate?.email}
          onChange={(e) =>
            setUserUpdate({
              ...userUpdate,
              email: e.target.value,
            })
          }
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input input-bordered w-full"
          value={userUpdate?.password}
          onChange={(e) => {
            setUserUpdate({
              ...userUpdate,
              password: e.target.value,
            });
          }}
        />

        <button className="btn bg-indigo-600 text-white" type="submit">
          {" "}
          Update your profile
        </button>
      </form>
      <div
        onClick={() => {
          logOutUser();
          navigate("/login");
        }}
      >
        {" "}
        <button className="btn px-7 ">
          Logout
          <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
        </button>
      </div>
      <button
        onClick={(e) => handleUserDelete(e)}
        className="btn btn-error text-white"
      >
        {" "}
        Delete Account
      </button>
    </div>
  );
}
