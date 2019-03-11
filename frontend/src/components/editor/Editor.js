import React from "react";

import { normalizeProductData } from "../../models/Product";

import { Button, Icon } from "../core";
import ProcessStatus from "../ProcessStatus";
import Cmp from "../Cmp";
import ProcessCmp from "../ProcessCmp";
import BotExportation from "./BotExportation";
import BotSelection from "./BotSelection";

import { Configuration, Diagram, Variables, History } from "./components";
import { NodeProperty, Scheduler } from "./components";

export class ImportParameters extends Cmp {
  state = { parameters: "" };
  get parameters() {
    try {
      if (!this.state.parameters) throw new Error("Parameters are empty");
      const arr = JSON.parse(this.state.parameters);
      if (!arr || !arr instanceof Array || !arr.length)
        throw new Error("Parameters must be an array, and must not be empty");
      return arr;
    } catch (e) {
      throw new Error(
        `Please check your parameters, it has to be a valid JSON format`
      );
    }
  }
  render() {
    return (
      <div
        className="form-import-parameters form"
        onClose={e => this.setState({ parameters: "" })}
      >
        <h3>Please paste or enter an valid JSON of parameters here</h3>
        <textarea
          value={this.state.parameters}
          onChange={e => this.setState({ parameters: e.target.value })}
          placeholder="Parameters (JSON): eg: [{name: 'Some name', type: 'string', description: '', value: 'Some value'}]"
        />
        <div className="actions">
          <Button
            text="Import"
            onClick={e => {
              try {
                const parameters = this.parameters;
                this.actions.productImportParameters(parameters).then(e => {
                  this.setState({ parameters: "" });
                  this.actions.popupRemoveLast();
                });
              } catch (e) {
                this.actions.notificationNotify({
                  type: "error",
                  message:
                    e.message ||
                    `Please check your parameters, it has to be a valid JSON format`
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export class Editor extends ProcessCmp {
  state = {
    tabindex: 0,
    showup: false,
    executor: "tagui"
  };
  get processInstance() {
    return this.store.Process.detail;
  }
  get onProcessUpdate() {
    return this.processUpdate;
  }
  get id() {
    return this.props.id;
  }
  //////////
  async componentDidMount() {
    await super.componentDidMount();
    await this.actions.processReset();
    await this.actions.propertyPanelPopulate(null);
    const { id } = this;
    await this.onLoadFiles();
    const { error } = await this.actions.api(this.apis.product.detail, {
      path: [id]
    });
    if (!error) await this.diagram.setData();
  }
  async componentWillUnmount() {
    super.componentWillUnmount();
    await this.actions.processReset();
    await this.actions.propertyPanelPopulate(null);
  }
  //////////
  onLoadFiles = async () => {
    const { id } = this;
    await this.actions.api(this.apis.application.fetchFiles, {
      path: [id],
      root: true
    });
  };
  onProductSave = async (nospinner = true) => {
    let product = normalizeProductData(this.store.Product.detail || {});
    const { error } = await this.actions.api(
      {
        ...this.apis.product.update,
        nospinner,
        path: [product.id]
      },
      product
    );
    if (!error) {
      await this.diagram.setData();
      await this.actions.api(this.apis.category.list, {
        product: product.id,
        nospinner
      });
    }
  };
  onProductDelete = async () =>
    await this.actions.popupAdd(
      <div
        confirm={async e => {
          let product = this.store.Product.detail;
          const { error } = await this.actions.api({
            ...this.apis.product.delete,
            path: [product.id]
          });
          if (!error) await this.props.history.goBack();
        }}
      >
        Are you sure to delete this project?
      </div>
    );
  processUpdate = async msg => {};
  //////////
  onNodeClicked = async (e, model, node, parameters, outputs) => {
    const currentNode = this.store.PropertyPanel.node;
    if (!currentNode || currentNode.id !== node.id) {
      await this.actions.propertyPanelPopulate(node);
      await this.actions.propertyPanelSetParameters(parameters);
      await this.actions.propertyPanelSetOutputs(outputs);
    }
  };
  onNodeDClicked = async (e, model, node, parameters, outputs) => {};
  onClicked = async (e, model) => {
    await this.actions.propertyPanelPopulate(null);
    await this.setState({ showup: false });
  };
  onModelChanged = async (e, model, save = true) => {
    const { nodeDataArray, linkDataArray } = model;
    await this.actions.productUpdate({ nodeDataArray, linkDataArray });
    if (save) await this.onProductSave(true);
  };
  onSelectionDeleted = async (e, model, nodes) => {
    const currentNode = this.store.PropertyPanel.node;
    if (currentNode)
      nodes.map(async o => {
        if (currentNode.id === o.id)
          await this.actions.propertyPanelPopulate(null);
      });
  };
  onDropped = async (e, model) => await this.onModelChanged(e, model);
  onPasted = async (e, model) => await this.onModelChanged(e, model);
  onMoved = async (e, model) => await this.onModelChanged(e, model);
  onNodeAddLeft = async (e, obj, model, node) =>
    await this.openBotSelection(node, false);
  onNodeAddRight = async (e, obj, model, node) =>
    await this.openBotSelection(node, true);
  onSetData = async (e, data, params) => {
    // await this.actions.propertyPanelPopulate(null);
  };
  //////////
  openBotSelection = async (node, dir = true) => {
    this.botSelectionPopup = (
      <BotSelection
        popup={true}
        id={this.id}
        loaded={true}
        onNodeClick={o => this.addNode(o, node, dir)}
      />
    );
    this.actions.popupAdd(this.botSelectionPopup);
  };
  addNode = async (node, target, isRight = true) => {
    const cloned = Object.omit(node, "key", "__gohashid");
    const { model } = this.diagram;
    // add node
    if (target) {
      const targetNode = target.data;
      const { key } = targetNode;
      const [x, y] = targetNode.loc.split(" ");
      cloned.loc = `${parseFloat(x) + 120 * (isRight ? 1 : -1)} ${parseFloat(
        y
      ) +
        30 * (isRight ? 1 : -1)}`;
      model.addNodeData(cloned);
      // add link
      if (isRight) model.addLinkData({ from: key, to: cloned.key });
      else model.addLinkData({ to: key, from: cloned.key });
    } else {
      cloned.loc = "100 100";
      model.addNodeData(cloned);
    }
    // close popup
    this.actions.popupRemove(this.botSelectionPopup);
    await this.diagram.select([cloned]);
    await this.onSetData(null, cloned, []);
  };
  addParameter = async e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ tabindex: 1, showup: true }, async e => {
      await this.actions.productAddParameter();
      this.variablesPanel.atBottom = true;
    });
  };
  addParameters = async e => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ tabindex: 1, showup: true }, e =>
      this.actions.popupAdd(<ImportParameters />)
    );
  };
  onRun = async () => {
    const product = this.store.Product.detail;
    const { executor } = this.state;
    const { parameters } = product;
    // create a process from selected product
    const { error } = await this.actions.api(this.apis.process.create, {
      id: product.id,
      parameters,
      processid: this.store.Process.detail ? this.store.Process.detail.id : ""
    });
    if (!error) {
      // subscribe to the process updates
      await this.addListeners();
      const { id } = this.store.Process.detail;
      const statusProps = { process: id, executor };
      await this.actions.popupAdd(<ProcessStatus {...statusProps} />);
      // run the process
      const res = await this.actions.api(this.apis.process.run, {
        executor,
        path: [id]
      });
      if (res.error) await this.actions.popupRemoveLast();
    }
  };
  onExportScript = async () => {
    this.actions.popupAdd(<BotExportation id={this.props.id} />);
  };
  onTabClick(idx) {
    this.setState({
      tabindex: idx,
      showup: this.state.tabindex === idx ? !this.state.showup : true
    });
  }
  ///RENDERS////
  renderTabActions() {
    const { executor } = this.state;
    const { executorEngines } = this.store.Application;
    return (
      <div className={`tab actions`}>
        <select
          value={executor}
          onChange={e => this.setState({ executor: e.target.value })}
        >
          {executorEngines.map((o, i) => (
            <option key={i} value={o.value}>
              {o.name}
            </option>
          ))}
        </select>
        <Icon
          icon="fas fa-play-circle"
          title="Run (Create a process)"
          onClick={this.onRun}
        />
        <Icon
          icon="fas fa-file-export"
          title="Export script"
          onClick={this.onExportScript}
        />
        <Icon
          icon="fas fa-save"
          title="Save changes"
          onClick={e => this.onProductSave(true)}
        />
        <Icon
          icon="fas fa-trash"
          title="Delete project (this will check project's relavants before deleting)"
          onClick={this.onProductDelete}
        />
      </div>
    );
  }
  renderTabs() {
    const { tabindex } = this.state;
    return (
      <div className="tabs">
        <div
          className={`tab ${tabindex === 0 ? "active" : ""}`}
          onClick={this.onTabClick.bind(this, 0)}
        >
          <Icon icon="fas fa-sliders-h" />
          Configure
        </div>
        <div
          className={`tab ${tabindex === 1 ? "active" : ""}`}
          onClick={this.onTabClick.bind(this, 1)}
        >
          <div className="horizontal center middle">
            <div className="vertical center middle">
              <Icon icon="fas fa-cogs" />
              Variables
            </div>
            <Button
              circle
              small
              icon="fas fa-file-import"
              onClick={this.addParameters}
            />
            <Button
              circle
              small
              icon="fas fa-plus"
              onClick={this.addParameter}
            />
          </div>
        </div>
        <div
          className={`tab ${tabindex === 2 ? "active" : ""}`}
          onClick={this.onTabClick.bind(this, 2)}
        >
          <Icon icon="fas fa-calendar-alt" />
          Schedule
        </div>
        <div
          className={`tab ${tabindex === 3 ? "active" : ""}`}
          onClick={this.onTabClick.bind(this, 3)}
        >
          <Icon icon="fas fa-history" />
          History
        </div>
        {this.renderTabActions()}
      </div>
    );
  }
  renderBottomPanel() {
    const { tabindex, showup } = this.state;
    return (
      <div
        key="bottom-panel"
        className={`bottom-panel ${showup ? "showup" : "hidedown"}`}
      >
        {this.renderTabs()}
        <div className="tab-content">
          {tabindex === 0 ? (
            <Configuration ref={e => (this.configurationPanel = e)} />
          ) : tabindex === 1 ? (
            <Variables ref={e => (this.variablesPanel = e)} />
          ) : tabindex === 2 ? (
            <Scheduler ref={e => (this.schedulerPanel = e)} />
          ) : (
            <History ref={e => (this.historyPanel = e)} />
          )}
        </div>
      </div>
    );
  }
  render() {
    const product = this.store.Product.detail;
    if (!product) return null;
    const { onNodeClicked, onNodeDClicked, onClicked, onModelChanged } = this;
    const { onDropped, onPasted, onMoved, onSetData } = this;
    const { onNodeAddLeft, onNodeAddRight, onSelectionDeleted } = this;
    let dProps = { data: product };
    dProps = { ...dProps, onNodeClicked, onNodeDClicked, onModelChanged };
    dProps = { ...dProps, onDropped, onPasted, onMoved, onSetData, onClicked };
    dProps = { ...dProps, onNodeAddLeft, onNodeAddRight, onSelectionDeleted };
    return [
      <BotSelection
        key="palette"
        id={this.props.id}
        header={<h3>{product.name}</h3>}
      />,
      <Diagram
        key="diagram"
        ref={e => (this.diagram = e)}
        id={this.props.id}
        allowDrop={true}
        scale={0.65}
        {...dProps}
      />,
      this.renderBottomPanel(),
      this.store.PropertyPanel.node ? (
        <NodeProperty key="node-property" />
      ) : null
    ];
  }
}

export default Editor;
