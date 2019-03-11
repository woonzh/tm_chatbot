import React, { Component } from "react";

import { connect } from "../../redux";

import { Button, ButtonRounded } from "../core";
import CatForm from "../CatForm";

import { Variables } from "./components";
import BotExportation from "./BotExportation";
import BotSelection from "./BotSelection";

export class BotForm extends Component {
  ////////
  async componentDidMount() {
    const node = this.props.node;
    await this.props.botDetail(node);
    if (node) {
      const { error } = await this.props.api(this.props.apis.bot.detail, {
        path: [node.id || node.product],
        nospinner: true
      });
      if (error) {
        await this.props.popupRemoveLast();
        await this.props.notificationNotify({
          type: "error",
          message: "Service does not exist"
        });
        await this.props.botDelete(node);
        await this.props.categoryProductDelete(node);
      }
    }
  }
  async componentWillUnmount() {
    const node = this.props.node;
    if (node)
      await this.props.api(this.props.apis.bot.detail, {
        path: [node.id || node.product],
        nospinner: true
      });
  }
  ////////
  saveBot = async () => {
    const bot = this.props.Bot.detail;
    const { error } = await this.props.api(this.props.apis.bot.upsert, {
      ...bot,
      id: bot.id || bot.product,
      category: bot.cat || bot.category
    });
    if (!error) {
      this.props.popupRemoveLast();
      this.props.notificationNotify("Service is saved");
    }
  };
  removeBot = async () => {
    const { error } = await this.props.api(this.props.apis.bot.delete, {
      path: [this.props.Bot.detail.id || this.props.Bot.detail.product]
    });
    if (!error) {
      this.props.popupRemoveLast();
      this.props.notificationNotify("Service is deleted");
    }
  };
  openBotSelection = async () => {
    this.props.popupAdd(
      <BotSelection
        popup={true}
        onNodeClick={node =>
          this.props.popupAdd(
            <BotExportation
              id={node.id || node.product}
              ref={e => (this.botExportation = e)}
              noclose={true}
              actions={[
                <Button
                  text="Cancel"
                  key="cancel"
                  onClick={e => this.props.popupRemoveLast()}
                />,
                <Button
                  text="Ok"
                  key="ok"
                  onClick={e => {
                    const { variables, script } = this.botExportation.data;
                    this.props.botImportParameters(variables);
                    this.props.botUpdateExecutor({ script });
                    this.props.popupRemoveLast();
                    this.props.popupRemoveLast();
                  }}
                />
              ]}
            />
          )
        }
      />
    );
  };
  ////////
  onChangeBotProp(p, v) {
    this.props.botUpdate(p, v);
  }
  onChangeBotExecutor(v) {
    this.props.botUpdateExecutor(v);
  }
  async openAddCatForm() {
    this.props.popupAdd(<CatForm noclose={true} />);
  }
  render() {
    const categories = this.props.Category.items;
    const { icons, executorTypes } = this.props.Application;
    const bot = this.props.Bot.detail;
    const { id, product, name, description, image } = bot;
    const { executor, cat, parameters } = bot;
    const { script, type } = executor || {};
    return (
      <div className="form form-add-bot">
        <h3 className="horizontal center middle fullW firstline">
          {((id || product) && name) || "New Bot"}
          <div className="space" />
          <div className="actions">
            <select
              value={image}
              onChange={e => this.onChangeBotProp("image", `${e.target.value}`)}
            >
              <option value="" className="placeholder">
                Icon
              </option>
              {icons.map((o, i) => (
                <option key={i} value={`/assets/node/${o}`}>
                  {o}
                </option>
              ))}
            </select>
            <Button
              transparent
              image={image || "/assets/node/default-icon.svg"}
            />
            {id || product ? (
              <Button
                circle
                icon="fas fa-trash"
                onClick={e => this.removeBot()}
              />
            ) : null}
            <ButtonRounded
              icon="fas fa-file-import"
              title="import from a template"
              onClick={e => this.openBotSelection()}
            />
            <ButtonRounded
              icon="fas fa-save"
              title="Save Bot"
              onClick={e => this.saveBot()}
            />
          </div>
        </h3>
        <div className="secondline">
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={e => this.onChangeBotProp("name", e.target.value)}
          />
          <select
            value={type}
            onChange={e => this.onChangeBotExecutor({ type: e.target.value })}
          >
            {executorTypes.map((o, i) => (
              <option key={i} value={o.value}>
                {o.name}
              </option>
            ))}
          </select>
          <select
            value={cat}
            onChange={e => this.onChangeBotProp("cat", e.target.value)}
          >
            <option value="" className="placeholder">
              No Category
            </option>
            {categories
              .filter(o => !o.id.match(/^_/g))
              .map((o, i) => (
                <option key={i} value={o.id}>
                  {o.name}
                </option>
              ))}
          </select>
          <Button
            circle
            small
            icon="fas fa-plus"
            title="Add category"
            onClick={e => this.openAddCatForm()}
          />
        </div>
        <input
          type="text"
          placeholder="description"
          className="description"
          value={description}
          onChange={e => this.onChangeBotProp("description", e.target.value)}
        />
        <textarea
          placeholder="script"
          className="script"
          value={script}
          onChange={e => this.onChangeBotExecutor({ script: e.target.value })}
        />
        <hr />
        <div className="parameters-wrapper vertical center middle fullW thirdline">
          <h4>
            Parameters
            <Button
              icon="fas fa-plus"
              title="New Parameter"
              circle
              small
              onClick={e =>
                this.props.botAddParam({
                  type: "string",
                  name: "",
                  description: "",
                  value: ""
                })
              }
            />
          </h4>
          <Variables
            atomic={true}
            parameters={parameters}
            onParamChange={(item, field, value) =>
              this.props.botUpdateParam(item, field, value)
            }
            onParamRemove={item => this.props.botRemoveParam(item)}
          />
        </div>
      </div>
    );
  }
}
export default connect(BotForm);
