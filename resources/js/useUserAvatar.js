import { useState } from "react";

export const useUserAvatar = (fileInputRef, setData) => {
  const MAX_FILE_SIZE = 1024 * 1024 * 5;

  const [temporaryAvatar, setTemporaryAvatar] = useState("");
  const [userChangedAvatar, setUserChangedAvatar] = useState(false);
  const [avatarErrors, setAvatarErrors] = useState({
    size: {
      value: false,
      message: `The file size must be lower than ${MAX_FILE_SIZE}MB`,
    },
  });

  const saveAvatar = () => {
    const file = fileInputRef.current.files[0];

    if (file.size > MAX_FILE_SIZE) {
      setAvatarErrors((prev) => ({
        size: {
          ...prev.size,
          value: true,
        },
      }));
    } else {
      setAvatarErrors((prev) => ({
        size: {
          ...prev.size,
          value: false,
        },
      }));
    }

    // store image file in form
    setData("avatar", file);

    const image = URL.createObjectURL(file);
    setTemporaryAvatar(image);
  };

  return {
    saveAvatar,
    temporaryAvatar,
    avatarErrors,
    userChangedAvatar,
    setUserChangedAvatar,
  };
};