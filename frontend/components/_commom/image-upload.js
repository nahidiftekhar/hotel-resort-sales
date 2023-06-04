import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { generateRandomString } from '@/components/_functions/common-functions';
import { beConfig } from '@/configs/backend';
import Image from 'next/image';
import { isUrl } from '../_functions/string-format';

function ImageUpload({ setImage, imageFile, saveLocation }) {
  const [visibleImage, setVisibleImage] = useState(
    imageFile
      ? `${beConfig.host}/static/images/${saveLocation}/${imageFile}`
      : `${beConfig.host}/static/images/${saveLocation}/_default.jpg`
  );
  const [errorMessage, setErroMessage] = useState('');

  useEffect(() => {
    if (isUrl(imageFile)) setVisibleImage(imageFile);
  }, [imageFile]);

  const uploadFile = async (e) => {
    const fileExtension =
      e.target.files[0].name.split('.')[
        e.target.files[0].name.split('.').length - 1
      ];
    if (
      e.target.files[0].size / 1024 > 2048 ||
      ['jpg', 'jpeg', 'png', 'JPG', 'PNG', 'JPEG'].indexOf(fileExtension) === -1
    ) {
      setErroMessage('Please upload image (jpg/png) below 2MB');
      setVisibleImage(
        `${beConfig.host}/static/images/${saveLocation}/_default.jpg`
      );
      return false;
    }
    const fileName =
      imageFile && !isUrl(imageFile)
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
      if (fileName) setImage(fileName);
    } catch (ex) {
      console.log(ex);
    }
  };

  return (
    <div>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="image-preview my-4 smaller-label text-center text-muted">
          <img
            // src={isUrl(imageFile) ? imageFile : visibleImage}
            src={visibleImage}
            // fluid
            style={{ width: '100%' }}
            alt="current image"
          />
        </div>
        <input
          type="file"
          name={saveLocation}
          id={saveLocation}
          accept="image/*"
          onChange={uploadFile}
          className="inputfile bg-gradient"
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
