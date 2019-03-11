import React from "react";
import { Tabs, Tab } from "@material-ui/core";
import mime from "mime-types";

import { Page } from "../components";

import { connect } from "../redux";

class IdOcr extends Page {
  state = { tabindex: 0, files: {}, names: [] };

  async componentDidMount() {
    await super.componentDidMount();
    const files = await this.props.api({ url: "/api/v1/assets/gan" });
    this.setState({ files, names: Object.keys(files) });
  }

  openFile(name, src, mimeType) {
    const isImage = /^image/g.test(mimeType);
    const isVideo = /^video/g.test(mimeType);
    this.props.popupAdd(
      <div
        className="gan-resizable"
        style={{ width: isVideo ? 800 : 500 }}
        ref={e => {
          if (e)
            global
              .jQuery(e)
              .resizable({ handles: "e, w", minWidth: 400, maxWidth: 1000 });
        }}
      >
        {isImage ? <img src={src} alt={name} /> : <video controls src={src} />}
      </div>
    );
  }

  renderDir(files) {
    if (!files) return null;
    return Object.keys(files).map((o, i) => {
      const src = files[o];
      const mimeType = mime.lookup(o);
      const isImage = /^image/g.test(mimeType);
      const isVideo = /^video/g.test(mimeType);
      return (
        <div
          key={i}
          className={`file ${
            isImage ? "image" : isVideo ? "video" : "unknown"
          }`}
          onClick={e =>
            isImage || isVideo ? this.openFile(o, files[o], mimeType) : false
          }
        >
          {isImage ? (
            <img src={src} alt={o} />
          ) : isVideo ? (
            <video controls src={src} />
          ) : (
            o
          )}
        </div>
      );
    });
  }
  renderTabContent() {
    const { tabindex, files, names } = this.state;
    return (
      <div className="tab-content">
        {this.renderDir(files[names[tabindex]])}
      </div>
    );
  }
  renderComponent() {
    const { names } = this.state;
    return (
      <div className="page page-gan">
        <Tabs
          value={this.state.tabindex}
          onChange={(e, v) => this.setState({ tabindex: v })}
          variant="fullWidth"
          className="tabs"
        >
          {names.map((o, i) => (
            <Tab key={i} label={o} />
          ))}
        </Tabs>
        {this.renderTabContent()}
      </div>
    );
  }
}

export default connect(IdOcr);
