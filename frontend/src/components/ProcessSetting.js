import React, { Component } from "react";

import { connect } from "../redux";
import { uploadFileToProduct } from "../utils";

import { Button, Form } from "./core";
import ProcessStatus from "./ProcessStatus";
import * as params from "./params";

class ProcessSetting extends Component {
  state = {
    executor: "tagui",
    root: null,
    id: null,
    parameters: []
  };
  async componentDidMount() {
    const product = this.props.Product.detail;
    const { error, id, parameters } = await this.props.api({
      ...this.props.apis.product.detail,
      path: [product.id]
    });
    if (!error) {
      this.setState({
        id,
        root: `/api/v1/download/${id}`,
        parameters: parameters
          .filter(o => o.isOutput)
          .sort((o1, o2) => o1.name.localeCompare(o1.name))
      });
      await this.props.api(this.props.apis.application.fetchFiles, {
        path: [id],
        root: true
      });
    }
  }
  async onChangeValue(item, field, value) {
    await this.props.productChangeParameter({
      item,
      update: { [field]: value }
    });
  }
  async onRun() {
    const { props } = this;
    const { id, parameters } = this.state;
    // create a process from selected product
    const processObj = await props.api(props.apis.process.create, {
      id,
      parameters
    });
    if (!processObj.error) {
      const { executor } = this.state;
      const { id } = processObj;
      await props.popupAdd(<ProcessStatus process={id} executor={executor} />);
      // run the process
      const res = await props.api(props.apis.process.run, {
        executor,
        path: [id]
      });
      if (res.error) await props.popupRemoveLast();
    }
  }

  renderParameter(param, i) {
    const { files } = this.props.Application;
    const { parameters, root } = this.state;
    const props = {
      key: i || param.field,
      files,
      root,
      param,
      parameters,
      code: "DIR",
      onUpload: uploadFileToProduct,
      onChange: (e, param) => {
        param.value = e.target.value;
        this.setState(this.state);
      }
    };
    return React.createElement(params[`P${param.type.ucfirst()}`], props);
  }
  renderParameters() {
    const { parameters } = this.state;
    if (!parameters || !parameters.length) return null;
    return (
      <div className="parameters">
        {parameters.map((o, i) => this.renderParameter(o, i))}
      </div>
    );
  }
  render() {
    const { executorEngines } = this.props.Application;
    return (
      <Form className="form-process-setting">
        <h3 className="horizontal center middle fullW firstline">
          Process Settings
          <div className="space" />
          <div className="actions">
            <select
              value={this.state.executor}
              onChange={e => this.setState({ executor: e.target.value })}
            >
              <option disabled value="">
                Executor Engine
              </option>
              {executorEngines.map((o, i) => (
                <option key={i} value={o.value}>
                  {o.name}
                </option>
              ))}
            </select>
            <Button
              disabled
              icon="fas fa-clock"
              title="Schedule"
              name="Schedule"
              onClick={e => this.onSchedule()}
            />
            <Button
              icon="fas fa-play"
              title="Run"
              name="Run"
              onClick={e => this.onRun()}
            />
          </div>
        </h3>
        {this.renderParameters()}
      </Form>
    );
  }
}

export default connect(ProcessSetting);
