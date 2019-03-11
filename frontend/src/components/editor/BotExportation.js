import React from "react";
import JSONFormatter from "json-formatter-js";

import { copyToClipboard } from "../../utils";

import { Button } from "../core";
import Cmp from "../Cmp";

export class BotExportation extends Cmp {
  state = { steps: [], variables: {}, script: "", values: {} };
  ////////
  get variables() {
    return Object.values(this.state.variables);
  }
  get parameters() {
    return this.variables
      .filter(o => o.isOutput)
      .map(o => Object.omit(o, "id", "isOutput"));
  }
  get script() {
    const { state, variables } = this;
    let { script } = state;
    variables.map(v => {
      const { name, id, isOutput, value } = v;
      if (isOutput)
        script = script.replace(
          new RegExp(`\`var_${id}\``, "g"),
          `$\{${name}}`
        );
      else script = script.replace(new RegExp(`\`var_${id}\``, "g"), value);
    });
    return script;
  }
  get data() {
    return { variables: this.parameters, script: this.script };
  }
  ////////
  async componentDidMount() {
    const { id } = this.props;
    const data = await this.api(this.apis.product.exportScript, { path: id });
    if (!data.error)
      this.setState({ ...data }, async () => {
        const formatter = new JSONFormatter(this.parameters, true, {
          hoverPreviewEnabled: false,
          theme: "dark"
        });
        formatter.openAtDepth(3);
        this.variablesElement.appendChild(formatter.render());
      });
  }
  ////////
  render() {
    return (
      <div className="form-exported-panel form">
        <div className="horizontal">
          <div className="script">
            <h3>
              Script{" "}
              <Button
                circle
                small
                icon="fas fa-copy"
                onClick={e => copyToClipboard(this.scriptElement.value)}
              />
            </h3>
            <textarea
              ref={e => (this.scriptElement = e)}
              disabled
              value={this.script}
              onChange={e => false}
            />
          </div>
          <div className="variables">
            <h3>
              Variables
              <Button
                circle
                small
                icon="fas fa-copy"
                onClick={e => copyToClipboard(JSON.stringify(this.parameters))}
              />
            </h3>
            <div ref={e => (this.variablesElement = e)} />
          </div>
        </div>
        <div className="actions">{this.props.actions}</div>
      </div>
    );
  }
}
export default BotExportation;
