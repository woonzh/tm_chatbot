import React, { Component } from "react";
import mime from "mime-types";
import classNames from "classnames";
import JSONFormatter from "json-formatter-js";

import { readAsText, readAsJson, readAsRows } from "../utils";
import { ButtonRounded } from "./core";

export class FinderPreview extends Component {
  state = {
    text: null,
    json: null,
    image: null,
    video: null,
    fullscreen: this.props.fullscreen
  };
  async componentDidMount() {
    await this.openFile(this.props.path);
  }
  async componentDidUpdate(props) {
    if (this.props.path !== props.path) {
      await this.openFile(this.props.path);
      global.jQuery(this.el).css("visibility", "visible");
    }
  }

  show = () => global.jQuery(this.el).css("visibility", "visible");
  hide = () => global.jQuery(this.el).css("visibility", "hidden");

  formatJson = () => {
    if (!this.jsonElement) return;
    const formatter = new JSONFormatter(this.state.json, true, {
      hoverPreviewEnabled: false,
      theme: "dark"
    });
    formatter.openAtDepth(2);
    this.jsonElement.appendChild(formatter.render());
  };

  openFile = async path => {
    const mimeType = await mime.lookup(path);
    const state = {
      rows: null,
      text: null,
      json: null,
      image: null,
      video: null
    };
    if (/^text\/csv/g.test(mimeType))
      readAsRows(path).then(rows => this.setState({ ...state, rows }));
    else if (/^text/g.test(mimeType))
      readAsText(path).then(text => this.setState({ ...state, text }));
    else if (/^application\/json/g.test(mimeType))
      readAsJson(path).then(json =>
        this.setState({ ...state, json }, this.formatJson)
      );
    else if (/^image/g.test(mimeType)) this.setState({ ...state, image: path });
    else if (/^video/g.test(mimeType)) this.setState({ ...state, video: path });
  };

  setupEvents() {
    global.jQuery("body").click(e => {
      if (!e.target.closest(".preview"))
        global.jQuery(this.el).css("visibility", "hidden");
    });
  }

  renderActions() {
    return this.props.actions || null;
  }
  renderCSVLine(cells, i) {
    return (
      <div key={i} className="line">
        <div className="cell col-index">{i}</div>
        {cells.map((cell, j) => (
          <div key={j} className="cell">
            {cell}
          </div>
        ))}
      </div>
    );
  }
  renderCSV(rows) {
    return (
      <div className="element csv" ref={e => (this.csvElement = e)}>
        {rows.map((row, i) => this.renderCSVLine(row, i))}
      </div>
    );
  }
  renderJSON(json) {
    return <div className="element json" ref={e => (this.jsonElement = e)} />;
  }
  render() {
    const { offset, children, path } = this.props;
    const { rows, text, json, image, video } = this.state;
    if (text === null && !image && !video && !json && !rows) return null;
    const { top, right } = offset;
    const style = {
      top: `${top}px`,
      right: `${right}px`
    };
    const onPreventPropagationClick = e => {
      e.preventDefault();
      e.stopPropagation();
    };
    return (
      <div
        className={classNames(
          "preview",
          this.state.fullscreen ? "fullscreen" : ""
        )}
        style={style}
        onClick={onPreventPropagationClick}
        ref={e => {
          this.el = e;
          this.setupEvents();
        }}
      >
        <div className="actions">
          {this.renderActions()}
          <ButtonRounded
            icon="Send"
            title="Send email"
            onClick={this.props.onSendEmail}
          />
          <ButtonRounded
            icon="PlayCircleFilledWhiteOutlined"
            title="Use this file with some service"
            onClick={this.props.onPlayFileWith}
          />
          <ButtonRounded
            icon="CloudDownload"
            title="Download file"
            onClick={e => global.open(path)}
          />
          {!this.props.hasSkipButtons ? null : (
            <ButtonRounded
              icon="SkipPrevious"
              title="Previous file"
              onClick={this.props.onSkipPrevious}
            />
          )}
          {!this.props.hasSkipButtons ? null : (
            <ButtonRounded
              icon="SkipNext"
              title="Next file"
              onClick={this.props.onSkipNext}
            />
          )}
          <ButtonRounded
            icon={this.state.fullscreen ? "FullscreenExit" : "Fullscreen"}
            title={this.state.fullscreen ? "Full screen Exit" : "Full screen"}
            onClick={e => this.setState({ fullscreen: !this.state.fullscreen })}
          />
          <ButtonRounded
            icon="Close"
            title="Close"
            onClick={e => global.jQuery(this.el).css("visibility", "hidden")}
          />
        </div>
        <h3>{(this.props.file && this.props.file.name) || this.props.path}</h3>
        {rows ? (
          this.renderCSV(rows)
        ) : json ? (
          this.renderJSON(json)
        ) : text !== null ? (
          <textarea className="element" disabled={true} value={text || ""} />
        ) : image ? (
          <img className="element" src={image} alt={image} />
        ) : video ? (
          <video className="element" controls src={video} />
        ) : null}
        {children}
      </div>
    );
  }
}

export default FinderPreview;
