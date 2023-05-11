import React, { useState } from 'react';
import axios from 'axios';

import { generateRandomString } from '@/components/_functions/common-functions';
import { beConfig } from '@/configs/backend';
import Image from 'next/image';

function ImageUpload({ setImage, imageFile, saveLocation }) {
  const [visibleImage, setVisibleImage] = useState(
    imageFile
      ? `${beConfig.host}/static/images/${saveLocation}/${imageFile}`
      : `${beConfig.host}/static/images/${saveLocation}/_default.png`
  );
  const [errorMessage, setErroMessage] = useState('');

  const uploadFile = async (e) => {
    const fileExtension =
      e.target.files[0].name.split('.')[
        e.target.files[0].name.split('.').length - 1
      ];
    if (
      e.target.files[0].size / 1024 > 5120 ||
      ['jpg', 'jpeg', 'png'].indexOf(fileExtension) === -1
    ) {
      setErroMessage('Please upload image (jpg/png) below 5MB');
      setVisibleImage(
        `${beConfig.host}/static/images/${saveLocation}/_default.png`
      );
      return false;
    }
    const fileName = imageFile
      ? imageFile
      : `${generateRandomString(6)}.${fileExtension}`;
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('saveLocation', `images/${saveLocation}`);
    formData.append('file', e.target.files[0]);
    try {
      const res = await axios.post(`${beConfig.host}/upload`, formData);
      setVisibleImage(
        `${
          beConfig.host
        }/static/images/${saveLocation}/${fileName}?${generateRandomString(3)}`
      );
      setErroMessage('');
      setImage(fileName);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <div className="App d-flex flex-column justify-content-center align-items-center">
        <div className="image-preview mb-1">
          <img
            src={visibleImage}
            // fluid
            style={{ width: '100%' }}
            // style={{ height: '150px', maxWidth: '100%' }}
          />
        </div>
        <input
          type="file"
          name={saveLocation}
          id={saveLocation}
          accept="image/*"
          onChange={uploadFile}
          className="inputfile"
        />
        <label for={saveLocation}>Choose a file</label>
        <p sm={12} className="text-center error-message">
          {errorMessage}
        </p>
      </div>
    </div>
  );
}

export default ImageUpload;
