import React, { useEffect, useState } from "react";
import { Container, Tab, Row, Col, Nav, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.min.css";

import { Icon } from "@/components/_App/Icon";
import { cardStatApi, actionStatApi, dailyStatApi } from "@/api/card-api";
import { formatDate } from "@/components/functions/helpers";

function CardStat({ cardId }) {
  const [statData, setStatData] = useState("");
  const [actionStatData, setActionStatData] = useState("");
  const [dailyStatData, setDailyStatData] = useState("");
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  );
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    getStatData(cardId);
  }, [cardId]);

  const getStatData = async (cardId) => {
    const res = await cardStatApi(cardId);
    setStatData(res);
  };

  const handleActionReport = async () => {
    const res = await actionStatApi(
      cardId,
      formatDate(startDate),
      formatDate(endDate)
    );
    setActionStatData(res);
  };

  const handleDailyReport = async () => {
    const res = await dailyStatApi(
      cardId,
      formatDate(startDate),
      formatDate(endDate)
    );
    setDailyStatData(res);
  };

  return (
    <Container className="card-stats my-5">
      <Tab.Container id="left-tabs-example" defaultActiveKey="visitors">
        <Row className="p-0">
          <Col xs={3} className="p-0">
            <Nav variant="pills" className="flex-column custom-pill">
              <Nav.Item>
                <Nav.Link eventKey="visitors" className="nav-bg">
                  Visitors
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="actions" className="nav-bg">
                  Actions
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="daywise" className="nav-bg">
                  Daywise
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col xs={9}>
            <Tab.Content>
              <Tab.Pane eventKey="visitors">
                <Row>
                  <Col xs={6} md={4}>
                    <div className="stat-box">
                      <h6>Last visit</h6>
                      <h4>
                        {statData?.lastActionDay?.max
                          ? new Date(
                              statData?.lastActionDay?.max
                            ).toLocaleDateString()
                          : "-"}
                      </h4>
                    </div>
                  </Col>

                  <Col xs={6} md={4}>
                    <div className="stat-box">
                      <h6>Today</h6>
                      <h4>{statData?.todayCount}</h4>
                    </div>
                  </Col>

                  <Col xs={6} md={4}>
                    <div className="stat-box">
                      <h6>Yesterday</h6>
                      <h4>{statData?.yesterdayCount}</h4>
                    </div>
                  </Col>

                  <Col xs={6} md={4}>
                    <div className="stat-box">
                      <h6>This week</h6>
                      <h4>{statData?.weeklyCount}</h4>
                    </div>
                  </Col>

                  <Col xs={6} md={4}>
                    <div className="stat-box">
                      <h6>This Month</h6>
                      <h4>{statData?.monthlyCount}</h4>
                    </div>
                  </Col>

                  <Col xs={6} md={4}>
                    <div className="stat-box">
                      <h6>Total</h6>
                      <h4>{statData?.totalCount}</h4>
                    </div>
                  </Col>
                </Row>
              </Tab.Pane>

              <Tab.Pane eventKey="actions">
                <Row className="mb-3 border mx-1">
                  <Col md={5} className="d-flex align-items-end my-2">
                    <label className="w-50">Start Date:</label>
                    <DatePicker
                      showIcon
                      dateFormat="yyyy/MM/dd"
                      selected={startDate}
                      maxDate={endDate}
                      onChange={(date) => setStartDate(date)}
                      className="border rounded px-1"
                    />
                  </Col>

                  <Col md={5} className="d-flex align-items-end my-2">
                    <label className="w-50">End Date:</label>
                    <DatePicker
                      showIcon
                      dateFormat="yyyy/MM/dd"
                      selected={endDate}
                      minDate={startDate}
                      onChange={(date) => setEndDate(date)}
                      className="border rounded px-1"
                    />
                  </Col>

                  <Col
                    md={2}
                    className="d-grid my-2"
                  >
                    <Button size="sm" variant="outline-dark" onClick={handleActionReport}>
                      <Icon nameIcon="FaSearch" />
                    </Button>
                  </Col>
                </Row>

                {actionStatData ? (
                  <div>
                    <h5 className="text-center text-black-50">Action report from {formatDate(startDate)} to {formatDate(endDate)}</h5>
                    <Row className="mx-1">
                      <Col
                        xs={8}
                        className="bg-secondary bg-gradient border border-light text-white"
                      >
                        Action Name
                      </Col>
                      <Col
                        xs={4}
                        className="bg-secondary bg-gradient border border-light text-white"
                      >
                        Scans
                      </Col>
                    </Row>
                    {actionStatData.map((singleAction) => (
                      <Row key={singleAction.action} className="mx-1">
                        <Col
                          xs={8}
                          className="border-bottom border-secondary border-1"
                        >
                          {singleAction.action}
                        </Col>
                        <Col
                          xs={4}
                          className="border-bottom border-secondary border-1"
                        >
                          {singleAction.CountedValue}
                        </Col>
                      </Row>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="daywise">
                <Row className="mb-3 border mx-1">
                  <Col md={5} className="d-flex align-items-end my-2">
                    <label className="w-50">Start Date:</label>
                    <DatePicker
                      showIcon
                      dateFormat="yyyy/MM/dd"
                      selected={startDate}
                      maxDate={endDate}
                      onChange={(date) => setStartDate(date)}
                      className="border rounded px-1"
                    />
                  </Col>

                  <Col md={5} className="d-flex align-items-end my-2">
                    <label className="w-50">End Date:</label>
                    <DatePicker
                      showIcon
                      dateFormat="yyyy/MM/dd"
                      selected={endDate}
                      minDate={startDate}
                      onChange={(date) => setEndDate(date)}
                      className="border rounded px-1"
                    />
                  </Col>

                  <Col
                    md={2}
                    className="d-grid my-2"
                  >
                    <Button size="sm" variant="outline-dark" onClick={handleDailyReport}>
                      <Icon nameIcon="FaSearch" />
                    </Button>
                  </Col>
                </Row>

                {dailyStatData ? (
                  <div>
                    <h5 className="text-center text-black-50">Day-wise scan report from {formatDate(startDate)} to {formatDate(endDate)}</h5>
                    <Row className="mx-1">
                      <Col
                        xs={8}
                        className="bg-secondary bg-gradient border border-light text-white"
                      >
                        Date
                      </Col>
                      <Col
                        xs={4}
                        className="bg-secondary bg-gradient border border-light text-white"
                      >
                        Scans
                      </Col>
                    </Row>
                    {dailyStatData.map((singleAction) => (
                      <Row key={singleAction.action} className="mx-1">
                        <Col
                          xs={8}
                          className="border-bottom border-secondary border-1"
                        >
                          {singleAction.action_date}
                        </Col>
                        <Col
                          xs={4}
                          className="border-bottom border-secondary border-1"
                        >
                          {singleAction.CountedValue}
                        </Col>
                      </Row>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}

export default CardStat;
