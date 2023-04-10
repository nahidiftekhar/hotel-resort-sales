/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import axios from "axios";

import { generateRandomString } from "../functions/helpers";
import { beConfig } from "@/configs/backend";

function FileUpload({ cardId, setImage, imageFile }) {
  const [profileImage, setProfileImage] = useState(
    imageFile
      ? `${beConfig.host}static/images/profiles/${imageFile}`
      : `${beConfig.host}static/images/profiles/_default.png`
  );
  const [errorMessage, setErroMessage] = useState('');

  const uploadFile = async (e) => {
    const fileExtension =
      e.target.files[0].name.split(".")[
        e.target.files[0].name.split(".").length - 1
      ];
      if (e.target.files[0].size/1024 > 5120 || ['jpg', 'jpeg', 'png'].indexOf(fileExtension)===-1) {
        setErroMessage('Please upload image (jpg/png) below 5MB');
        setProfileImage(`${beConfig.host}static/images/profiles/_default.png`)
        return false
      }
    const fileName = imageFile
      ? imageFile
      : `${cardId}-${await generateRandomString(6)}.${fileExtension}`;
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    formData.append("fileName", fileName);
    try {
      const res = await axios.post(`${beConfig.host}upload`, formData);
      setProfileImage(
        `${
          beConfig.host
        }static/images/profiles/${fileName}?${await generateRandomString(3)}`
      );
      setErroMessage('')
      setImage(fileName);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <div className="App d-flex flex-column justify-content-center align-items-center">
        <div className="image-preview mb-3">
          <img
            src={profileImage}
            rounded
            fluid
            style={{ height: "150px", maxWidth: "100%" }}
          />
        </div>
        <input
          type="file"
          name="file"
          id="file"
          accept="image/*"
          onChange={uploadFile}
          className="inputfile"
        />
        <label for="file">Choose a file</label>
        <p sm={12} className="text-center error-message">{errorMessage}</p>
      </div>
    </div>
  );
}

export default FileUpload;
