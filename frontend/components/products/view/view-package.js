import React from 'react';
import { Row, Col } from 'react-bootstrap';
import parse from 'html-react-parser';
import Image from 'next/image';
import { BDTFormat } from '@/components/_functions/number-format';
import { beConfig } from '@/configs/backend';
import { isUrl } from '@/components/_functions/string-format';

function ViewPackages({ productDetail }) {
  const imageUrl = productDetail.image_url || '_default.jpg';
  return (
    <Row>
      <Col md={6} className="mb-3">
        <Row>
          <Col md={3} className="text-muted my-2">
            Package Name
          </Col>
          <Col md={9} className="my-2">
            {productDetail.name}
          </Col>
          <Col md={3} className="text-muted my-2">
            Package Price
          </Col>
          <Col md={9} className="my-2">
            <p className="mb-1">
              {BDTFormat.format(productDetail.price_adult)} {productDetail.unit}
            </p>
            {Number(productDetail.price_kids) > 0 && (
              <p className="mt-1">
                {BDTFormat.format(productDetail.price_kids)}{' '}
                {productDetail.unit_kids}
              </p>
            )}
          </Col>
        </Row>
      </Col>

      <Col md={6} className="mb-3">
        {imageUrl && (
          <Image
            src={
              isUrl(imageUrl)
                ? imageUrl
                : `${beConfig.host}/static/images/products/packages/${imageUrl}`
            }
            width={400}
            height={200}
            alt={`image for ${productDetail.name}`}
            className="rounded"
          />
        )}
      </Col>

      <Col md={3} className="text-muted my-2">
        Package Description
      </Col>
      <Col md={9} className="my-2">
        {parse(productDetail.description)}
      </Col>
    </Row>
  );
}

export default ViewPackages;
