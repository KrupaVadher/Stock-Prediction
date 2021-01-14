import React, { Component } from "react";
import {
  Col,
  Container,
  Row,
  Image,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import LeftNavBar from "./LeftNavBar";
import amdLogo from "../Images/amdLogo.png";
import "../CSS/components.css";
import CanvasJSReact from "../canvasjs.react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee, faArrowUp } from "@fortawesome/free-solid-svg-icons";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class AMD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphdata: [],
      trend: "Year",
      trendData: [],
      yString: "YYYY",
      today: null,
      yesterday: null,
    };
  }
  componentDidMount() {
    var data = [];
    var t_stock = null;
    var y_stock = null;
    axios
      .get(
        "http://ec2-3-21-41-120.us-east-2.compute.amazonaws.com:3001/amddata"
      )
      .then((response) => {
        response.data.map((d) => {
          var today = new Date(2020, 10, 24);
          var yesterday = new Date(2020, 10, 23);
          var value = d.Close;
          var date = new Date(d.Date);
          if (
            today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear()
          ) {
            console.log("here");
            t_stock = value;
          } else if (
            yesterday.getDate() === date.getDate() &&
            yesterday.getMonth() === date.getMonth() &&
            yesterday.getFullYear() === date.getFullYear()
          ) {
            y_stock = value;
          }
          var object = {
            x: date,
            y: value,
          };
          data.push(object);
          return null;
        });
        this.setState({
          graphdata: data,
          trendData: data,
          today: t_stock,
          yesterday: y_stock,
        });
      });
  }

  trendDropdown = (event) => {
    if (event.target.name !== "") {
      var trendData = [];
      var str = "";
      if (event.target.name === "Month") {
        trendData = this.state.graphdata.filter((data) => {
          var todayDate = new Date();
          todayDate.setFullYear(2020);
          todayDate.setMonth(10);
          todayDate.setDate(25);
          if (
            (todayDate.getTime() - data.x.getTime()) / (1000 * 60 * 60 * 24.0) <
            30
          ) {
            return data;
          }
        });

        str = "DD/MM";
      } else if (event.target.name === "Week") {
        trendData = this.state.graphdata.filter((data) => {
          var todayDate = new Date();
          todayDate.setFullYear(2020);
          todayDate.setMonth(10);
          todayDate.setDate(25);
          if (
            (todayDate.getTime() - data.x.getTime()) / (1000 * 60 * 60 * 24.0) <
            7
          ) {
            return data;
          }
        });
        str = "DD/MM";
      } else if (event.target.name === "Year") {
        trendData = this.state.graphdata.filter((data) => {
          var todayDate = new Date();
          todayDate.setFullYear(2020);
          todayDate.setMonth(10);
          todayDate.setDate(25);
          if (
            (todayDate.getTime() - data.x.getTime()) / (1000 * 60 * 60 * 24.0) <
            365
          ) {
            return data;
          }
        });
        str = "MMM";
      }
      this.setState({
        trend: event.target.name,
        trendData: trendData,
        yString: str,
      });
    }
  };
  render() {
    const options = {
      animationEnabled: true,
      width: 500,
      height: 250,
      theme: "dark2",
      title: {
        text: "",
      },
      axisY: {
        title: "Close price USD($)",
        logarithmic: true,
      },
      axisX: {
        title: "Date",
        valueFormatString: this.state.yString,
        interval: 1,
      },
      data: [
        {
          type: "spline",
          xValueFormatString: this.state.yString,
          dataPoints: this.state.trendData,
        },
      ],
    };
    return (
      <div>
        <Row>
          <Col className="col-sm-3">
            <LeftNavBar active={"AMD"}></LeftNavBar>
          </Col>
          <Col className="col-sm-9">
            <Container>
              <Row
                style={{
                  alignItems: "center",
                  justifyContent: "left",
                  padding: "10px",
                }}
              >
                <Image className="logoImage" src={amdLogo}></Image>
                <h1
                  style={{
                    textAlign: "center",
                    paddingTop: "10px",
                    paddingLeft: "5px",
                  }}
                >
                  AMD
                </h1>
              </Row>
              <Row>
                <Col>
                  <Row
                    style={{
                      alignItems: "center",
                      justifyItems: "right",
                      padding: "10px",
                    }}
                  >
                    <Col className="col-sm-3">
                      <h6>Stock Trend</h6>
                    </Col>
                    <Col className="col-sm-1">
                      <DropdownButton
                        id="dropdown-basic-button"
                        title={this.state.trend}
                        onClick={this.trendDropdown}
                      >
                        <Dropdown.Item name="Year">Year</Dropdown.Item>
                        <Dropdown.Item name="Month">Month</Dropdown.Item>
                        <Dropdown.Item name="Week">Week</Dropdown.Item>
                      </DropdownButton>
                    </Col>
                  </Row>
                  <CanvasJSChart
                    options={options}
                    style={{ height: "200px", width: "200px" }}
                  />
                </Col>
                <Col style={{ padding: "20px", marginLeft: "40px" }}>
                  <Row
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <h6>Stock Close Price</h6>
                  </Row>
                  <hr></hr>
                  <Row>
                    <Col>
                      <b style={{ float: "right" }}>Yesterday:</b>
                    </Col>
                    <Col>
                      {this.state.yesterday
                        ? Math.round(this.state.yesterday * 100) / 100
                        : ""}{" "}
                      $
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <b style={{ float: "right" }}>Today:</b>
                    </Col>
                    <Col>
                      {this.state.today
                        ? Math.round(this.state.today * 100) / 100
                        : ""}{" "}
                      $
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <b style={{ float: "right" }}>Tomorrow(predicted):</b>
                    </Col>
                    <Col>
                      87.54 $
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        color="green"
                        style={{ marginLeft: "4px" }}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <div style={{ padding: "10px", paddingTop: "30px" }}>
                  <h4>News Related to AMD</h4>
                </div>
              </Row>
              <Row>
                <p style={{ paddingLeft: "10px" }}>
                  <b>
                    <a
                      href="https://finance.yahoo.com/video/advanced-micro-devices-nears-entry-144554570.html"
                      target="_blank"
                    >
                      1.Advanced Micro Devices Nears Entry
                    </a>
                  </b>
                </p>
              </Row>
              <Row>
                <p style={{ paddingLeft: "10px" }}>
                  <b>
                    <a
                      href="https://finance.yahoo.com/news/amds-instinct-mi100-accelerator-boost-154503761.html"
                      target="_blank"
                    >
                      2.AMD's New Instinct MI100 Accelerator to Boost HPC
                      Workloads
                    </a>
                  </b>
                </p>
              </Row>
              <Row>
                <p style={{ paddingLeft: "10px" }}>
                  <b>
                    <a
                      href="https://finance.yahoo.com/m/776dffee-64af-3502-ad20-38a315d1693e/is-amd-stock-a-buy-right-now-.html"
                      target="_blank"
                    >
                      3.Is AMD Stock A Buy Right Now? Here's What IBD Charts
                      Show
                    </a>
                  </b>
                </p>
              </Row>
            </Container>
          </Col>
        </Row>
      </div>
    );
  }
}
