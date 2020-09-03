import React, { Component } from "react";
import "./App.css";
import { Device } from "twilio-client";
import axios from "axios";
require("./index.css");

class App extends Component {
  state = {
    countryCode: "92",
    currentNumber: "",
    muted: false,
    onPhone: false,
    log: "Connecting...",
    countries: [
      { name: "United States", cc: "1", code: "us" },
      { name: "Great Britain", cc: "44", code: "gb" },
      { name: "Colombia", cc: "57", code: "co" },
      { name: "Ecuador", cc: "593", code: "ec" },
      { name: "Estonia", cc: "372", code: "ee" },
      { name: "Germany", cc: "49", code: "de" },
      { name: "Hong Kong", cc: "852", code: "hk" },
      { name: "Ireland", cc: "353", code: "ie" },
      { name: "Singapore", cc: "65", code: "sg" },
      { name: "Spain", cc: "34", code: "es" },
      { name: "Brazil", cc: "55", code: "br" },
      { name: "Pakistan", cc: "92", code: "pk" },
    ],
    connection: null,
    validPhone: true,
  };

  async componentDidMount() {
    const self = this;
    const {
      data: {
        data: { token },
      },
    } = await axios.get("http://localhost:8080/twilio/token");

    Device.setup(token);
    Device.disconnect(function () {
      self.setState({
        onPhone: false,
        connection: null,
        log: "Call ended.",
      });
    });
    Device.ready(function () {
      self.setState({
        log: "Connected",
      });
    });
  }

  selectCountry() {
    // get country from state
    const countryCode = "+92";
    this.setState({
      countryCode,
    });
  }

  // Handle muting
  toggleMute() {
    this.muted = !this.muted;

    this.setState({
      muted: !this.state.muted,
    });

    Device.activeConnection().mute(this.state.muted);
  }

  // Make an outbound call with the current number,
  // or hang up the current call
  toggleCall() {
    const { onPhone } = this.state;

    if (!onPhone) {
      var n =
        "+" +
        this.state.countryCode +
        this.state.currentNumber.replace(/\D/g, "");

      this.setState({
        muted: false,
        onPhone: true,
        log: `Calling ${n}`,
        connection: Device.connect({ number: n }),
      });
    } else {
      // hang up call in progress
      Device.disconnectAll();
    }
  }

  // Handle numeric buttons
  sendDigit(digit) {
    this.state.connection.sendDigits(digit);
  }

  render() {
    const {
      countryCode,
      currentNumber,
      onPhone,
      validPhone,
      muted,
      log,
      connection,
    } = this.state;

    return (
      <div id="dialer">
        {/* <pre>{JSON.stringify(this.state, null, 4)}</pre> */}
        <div className="input-group input-group-sm">
          <div className="input-group-btn">
            <button
              type="button"
              className="btn btn-default dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              +<span className="country-code">{countryCode}</span>
              <i className="fa fa-caret-down"></i>
            </button>
            <ul className="dropdown-menu">
              {this.state.countries.map((country) => {
                return (
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        this.selectCountry(country);
                      }}
                    >
                      <div className={"flag flag-" + country.code}></div>
                      <span>
                        {country.name} (+{country.cc})
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <input
            type="tel"
            className="form-control"
            onChange={(e) => {
              this.setState({
                currentNumber: e.target.value,
              });
            }}
            value={currentNumber}
            placeholder="555-666-7777"
          />
        </div>

        <div className="controls">
          <button
            className="btn btn-circle"
            onClick={() => {
              this.toggleCall();
            }}
            className={onPhone ? "btn-danger" : "btn-success"}
            disabled={!validPhone}
          >
            <i
              className={
                onPhone
                  ? "fa fa-fw fa-phone fa-close"
                  : "fa fa-fw fa-phone fa-phone"
              }
            ></i>
          </button>

          {onPhone && (
            <button
              className="btn btn-circle btn-default"
              onClick={() => {
                this.toggleMute();
              }}
            >
              <i
                className={
                  muted
                    ? " fa fa-fw fa-microphone-slash"
                    : " fa fa-fw fa-microphone"
                }
              ></i>
            </button>
          )}
        </div>

        {connection && (
          <div className="keys">
            <div className="key-row">
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("1");
                }}
              >
                1
              </button>
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("2");
                }}
              >
                2<span>A B C</span>
              </button>
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("3");
                }}
              >
                3<span>D E F</span>
              </button>
            </div>
            <div className="key-row">
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("4");
                }}
              >
                4<span>G H I</span>
              </button>
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("5");
                }}
              >
                5<span>J K L</span>
              </button>
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("6");
                }}
              >
                6<span>M N O</span>
              </button>
            </div>
            <div className="key-row">
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("7");
                }}
              >
                7<span>P Q R S</span>
              </button>
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("8");
                }}
              >
                8<span>T U V</span>
              </button>
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("9");
                }}
              >
                9<span>W X Y Z</span>
              </button>
            </div>
            <div className="key-row">
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("*");
                }}
              >
                *
              </button>
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("0");
                }}
              >
                0
              </button>
              <button
                className="btn btn-circle btn-default"
                onClick={() => {
                  this.sendDigit("#");
                }}
              >
                #
              </button>
            </div>
          </div>
        )}

        <div className="log">{log}</div>
      </div>
    );
  }
}

export default App;
