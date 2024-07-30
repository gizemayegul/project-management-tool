import React from "react";
import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../utils/config";
import { Id } from "../../utils/types";
import { toast } from "react-toastify";

export default function UploadBackground({
  boardId,
}: {
  boardId: Id | undefined;
}) {
  const notify = () => toast.success("Uploaded!");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLineLoading, setIsLineLoading] = useState<boolean>(false);

  const handleSubmitFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uploadData = new FormData();
    uploadData.append("imagebackground", selectedFile as Blob);
    console.log(uploadData);

    const response = await axios.put(
      `${apiUrl}/boards/${boardId}/upload`,
      uploadData,
      {
        headers: { Authorization: localStorage.getItem("token") },
      }
    );
    console.log(response.data);
    console.log(response.data.imageUrl);

    setIsLineLoading(false);
    setSelectedFile(null);
    notify();
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  return (
    <form
      className="flex flex-col  space-y-4"
      onSubmit={(e) => {
        handleSubmitFile(e);
        setIsLineLoading(true);
      }}
    >
      <input
        type="file"
        id="file"
        name="file"
        className="w-full max-w-xs mb-2"
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
          <span>Submit</span>
        )}
      </button>
    </form>
  );
}
