import React, { useEffect, useState } from "react";
import { Container, Tab, Row, Col, Nav } from "react-bootstrap";
import { cardStatApi } from "@/api/card-api";

function CardAdmin({ cardId }) {
  const [statData, setStatData] = useState("");

  useEffect(() => {
    getStatData(cardId);
  }, [cardId]);

  const getStatData = async (cardId) => {
    const res = await cardStatApi(cardId);
    setStatData(res);
  };

  return (
    <Container className="card-stats my-5">
    </Container>
  );
}

export default CardAdmin;
