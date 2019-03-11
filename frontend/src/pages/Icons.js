import React from "react";
import * as icons from "@material-ui/icons";

import { Page } from "../components";

import { connect } from "../redux";

class Icons extends Page {
  state = { q: "" };
  get data() {
    const data = Object.keys(icons);
    const { q } = this.state;
    if (!q) return data;
    return data.filter(o => o.toLowerCase().includes(q.toLowerCase()));
  }
  renderComponent() {
    return (
      <div className="page page-icons">
        <div className="page-content" style={{ height: "100%" }}>
          <input
            type="text"
            style={{ width: "100%", marginBottom: 24 }}
            onChange={e => this.setState({ q: e.target.value })}
            placeholder="Search Icons"
          />
          <div style={{ overflow: "auto", height: "calc(100% - 64px)" }}>
            {this.data.map((n, i) => (
              <div
                key={i}
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: 100,
                  height: 100,
                  marginBottom: 12,
                  padding: 4
                }}
              >
                <div style={{ fontSize: 10 }}>
                  {React.createElement(icons[n])}
                </div>
                <div style={{ wordBreak: "break-word", textAlign: "center" }}>
                  {n}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(Icons);
