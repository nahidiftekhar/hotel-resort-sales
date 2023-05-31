import React from 'react';
import { Row, Col } from 'react-bootstrap';
import parse from 'html-react-parser';
import Image from 'next/image';
import { BDTFormat } from '@/components/_functions/number-format';
import { beConfig } from '@/configs/backend';
import { isUrl } from '@/components/_functions/string-format';

function ViewService({ productDetail }) {
  const imageUrl = productDetail.image_url || '_default.jpg';

  return (
    <Row>
      <Col md={3} className="text-muted my-2">
        Item Name
      </Col>
      <Col md={9} className="my-2">
        {productDetail.name}
      </Col>

      <Col md={3} className="text-muted my-2">
        Item Price
      </Col>
      <Col md={9} className="my-2">
        <p className="mb-1">{BDTFormat.format(productDetail.price)}</p>
      </Col>

      <Col md={3} className="text-muted my-2">
        Item Description
      </Col>
      <Col md={9} className="my-2">
        <div>{parse(productDetail.description)}</div>
        <div className="smaller-label text-center">
          {imageUrl && (
            <Image
              src={
                isUrl(imageUrl)
                  ? imageUrl
                  : `${beConfig.host}/static/images/products/service/${imageUrl}`
              }
              width={500}
              height={350}
              alt={`image for ${productDetail.name}`}
              className="mt-2 rounded"
            />
          )}
        </div>
      </Col>
    </Row>
  );
}

export default ViewService;
