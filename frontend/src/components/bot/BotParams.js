import React, { Component } from "react";
import classNames from "classnames";

import { connect } from "../../redux";

import { Button, ButtonRounded, Space } from "../core";
import * as params from "../params";

export class BotParams extends Component {
  state = {
    showall: false,
    data: this.props.data,
    root: this.props.root,
    parameters: [...this.props.data.parameters.map(o => ({ ...o }))],
    index: this.props.data.parameters.indexOf(this.props.first)
  };
  get root() {
    return this.state.root;
  }
  get index() {
    return this.state.index;
  }
  get parameters() {
    return this.state.parameters;
  }
  get param() {
    return this.parameters[this.index];
  }
  get count() {
    return this.parameters.length;
  }
  get required() {
    return this.parameters.filter(o => o.required).length;
  }
  get missing() {
    return this.parameters.filter(
      o =>
        o.required &&
        (o.value === "" || o.value === null || o.value === undefined)
    ).length;
  }

  onPrev = e =>
    this.setState({ index: this.index ? this.index - 1 : this.count - 1 });
  onNext = e =>
    this.setState({ index: this.index < this.count - 1 ? this.index + 1 : 0 });

  renderParam(param, i) {
    const { files } = this.props.Application;
    const { parameters, root } = this;
    const idx = parameters.indexOf(param);
    const props = {
      ref: e => (this.paramCmp = e),
      key: idx,
      files,
      root,
      param,
      parameters,
      code: "DIR",
      autosave: true,
      onUpload: this.props.onUpload,
      onChange: (e, param) => {
        param.value = e.target.value;
        this.setState(this.state);
      }
    };
    return React.createElement(params[`P${param.type.ucfirst()}`], props);
  }
  renderParams() {
    const { parameters } = this;
    return (
      <div className="showall">
        {parameters.map((param, i) => this.renderParam(param, i))}
      </div>
    );
  }
  render() {
    const { state, index, param, count, required, missing } = this;
    const { data, showall } = state;
    return (
      <div className={classNames("bot-params form", this.props.className)}>
        <h3>
          <div>
            <span className="form-name">Input Wizard for: </span>
            <span className="name">{data.name}</span>
            <span className="info">
              <span className="count">{count}</span>
              {required ? <span className="required">{required}</span> : null}
              {missing ? <span className="missing">{missing}</span> : null}
            </span>
            <div className="instruction">
              Please provide inputs for {data.name} service
            </div>
          </div>
          <Space />
          <ButtonRounded
            icon="Done"
            title="Save"
            onClick={e => this.props.onClose(e, false, this.parameters)}
          />
          <ButtonRounded
            title="Close"
            icon="HighlightOff"
            className="close"
            onClick={e => this.props.popupRemoveLast()}
          />
        </h3>
        <div className="content">
          {count > 1 ? (
            <div className="control">
              {showall ? null : <span className="index">{index + 1}</span>}
              <Space />
              <Button onClick={e => this.setState({ showall: !showall })}>
                {showall ? "Show one by one" : "Show all"}
              </Button>
            </div>
          ) : null}
          {count > 1 && (showall || count <= 1) ? null : (
            <div className="prev" onClick={this.onPrev} />
          )}
          {showall ? this.renderParams() : this.renderParam(param)}
          {count > 1 && (showall || count <= 1) ? null : (
            <div className="next" onClick={this.onNext} />
          )}
        </div>
      </div>
    );
  }
}

export default connect(BotParams);
