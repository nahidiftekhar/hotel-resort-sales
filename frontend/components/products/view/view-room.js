import React from 'react';
import { Row, Col } from 'react-bootstrap';
import parse from 'html-react-parser';
import Image from 'next/image';
import { BDTFormat } from '@/components/_functions/number-format';
import { beConfig } from '@/configs/backend';
import { isUrl } from '@/components/_functions/string-format';

function ViewRoom({ productDetail }) {
  const imageUrl = productDetail.image_url || '_default.jpg';

  return (
    <Row>
      <Col md={6} className="mb-3">
        <Row>
          <Col md={4} className="text-muted my-2">
            Item Name
          </Col>
          <Col md={8} className="my-2">
            <p>
              {productDetail.roomtype.room_type_name +
                '-' +
                productDetail.room_number}
            </p>
          </Col>

          <Col md={4} className="text-muted my-2">
            Item Price
          </Col>
          <Col md={8} className="my-2">
            <p className="mb-1">
              {BDTFormat.format(productDetail.roomtype.price)}
            </p>
          </Col>

          <Col md={4} className="text-muted my-2">
            Occupancy
          </Col>
          <Col md={8} className="my-2">
            <p className="mb-0">Adult: {productDetail.roomtype.max_adult}</p>
            <p className="mb-0">Child: {productDetail.roomtype.max_child}</p>
          </Col>

          <Col md={4} className="text-muted my-2">
            Location
          </Col>
          <Col md={8} className="my-2">
            <p className="mb-1">{productDetail.room_location}</p>
          </Col>
        </Row>
      </Col>
      <Col md={6} className="mb-3">
        <div className="smaller-label text-center">
          {imageUrl && (
            <Image
              src={
                isUrl(imageUrl)
                  ? imageUrl
                  : `${beConfig.host}/static/images/products/rooms/${imageUrl}`
              }
              width={400}
              height={200}
              alt={`image for ${productDetail.name}`}
              className="mt-2 rounded"
            />
          )}
        </div>
      </Col>

      <Col md={3} className="text-muted my-2">
        Item Description
      </Col>
      <Col md={9} className="my-2">
        <div>{parse(productDetail.description)}</div>
      </Col>
    </Row>
  );
}

export default ViewRoom;
