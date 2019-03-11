import React from "react";
import Dropzone from "react-dropzone";

import { connect } from "../../redux";

import { ButtonRounded, Icon, Space } from "../core";
import { Diagram } from "../editor";
import FinderPreview from "../FinderPreview";
import ProcessCmp from "../ProcessCmp";

import BotParams from "./BotParams";
import BotSelection from "./BotSelection";

export class BotEditor extends ProcessCmp {
  state = {
    root: null,
    node: null,
    selected: null,
    previewMargin: 32,
    previewOffset: { right: 0, top: 0 },
    previewPath: null
  };
  get processInstance() {
    return this.props.Bot.temp;
  }
  get onProcessUpdate() {
    return this.processUpdate;
  }
  ////////
  async componentWillMount() {
    await this.props.applicationFetchFiles([]);
  }
  async componentDidMount() {
    await super.componentDidMount();
    if (this.diagram) {
      const { diagram, selectNodeData } = this.diagram;
      const { nodeDataArray, linkDataArray } = diagram.model;
      //update temp process
      const { error } = await this.props.botUpdateExperiment({
        nodeDataArray,
        linkDataArray
      });
      if (!error) {
        //create a temp process on server
        await this.props.api(
          this.props.apis.bot.experiment,
          this.props.Bot.temp
        );
        // subscribe to process change
        await this.addListeners();
        const { id } = this.props.Bot.temp;
        const root = `/api/v1/experiment/${id}`;
        await this.setState({ root });
        if (this.props.selected) selectNodeData(this.props.selected);
      }
    }
  }
  async componentWillUnmount() {
    if (this.props.Bot.temp) {
      await this.props.api(
        this.props.apis.bot.experimentclean,
        this.props.Bot.temp
      );
      await this.props.botCleanExperiment();
    }
  }
  ////////
  processUpdate = async msg => {
    if (!msg || !msg.files) return;
    const { files } = msg;
    await this.props.applicationFetchFiles(files);
  };
  onUpload = async file => {
    const { nodeDataArray } = this.diagram.model;
    [].merge(...nodeDataArray.map(o => o.parameters)).map(o => delete o.file);
    await this.onUpdate();
    await this.props.api(
      this.props.apis.bot.experiment,
      this.props.Bot.temp,
      file
    );
  };
  onUpdate = async () => {
    const { nodeDataArray, linkDataArray } = this.diagram.model;
    await this.props.botUpdateExperiment({ nodeDataArray, linkDataArray });
    await this.props.api(this.props.apis.bot.experiment, this.props.Bot.temp);
  };
  onTest = async () => {
    //TODO validate parameters before testing
    await this.props.api(
      this.props.apis.bot.experimenttest,
      this.props.Bot.temp
    );
  };
  onSaveAs = async () => {
    const { id } = this.props.Bot.temp;
    await this.props.api(this.props.apis.process.saveas, {
      path: [id]
    });
  };
  onOpenFile = async (e, o) => {
    if (this.state.selected === o) return this.preview.show();
    const target = e.target.closest(".file");
    const { previewMargin } = this.state;
    const previewOffset = {
      right: previewMargin,
      top: target.offsetTop + previewMargin
    };
    const previewPath = `${o.path}`;
    this.setState({ selected: o, previewOffset, previewPath });
  };
  onClicked = async e => {
    this.setState({ node: null }, async e => {});
  };
  firstInvalidParam = async params => {
    const required = params.filter(o => o.required && !o.value);
    const first = required.length ? required[0] : null;
    if (first) return first;
    return null;
  };
  onNodeClicked = async (e, model, data, parameters, outputs) => {
    if (data) {
      this.setState({ node: data }, async e => {
        if (!data.parameters || !data.parameters.length) return;
        const first = await this.firstInvalidParam(data.parameters);
        if (first) return await this.openBotParamsPopup(data, first);
      });
    }
  };
  onNodeDClicked = async (e, model, data, parameters, outputs) => {
    if (!parameters || !parameters.length) return;
    const first = parameters[0];
    return await this.openBotParamsPopup(data, first);
  };
  async addNode(node, target, isRight = true) {
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
    this.props.popupRemove(this.botSelectionPopup);
    await this.diagram.selectNodeData(cloned);
  }

  openBotSelection = async (node, dir = true) => {
    this.botSelectionPopup = (
      <BotSelection onSelected={o => this.addNode(o, node, dir)} />
    );
    this.props.popupAdd(this.botSelectionPopup);
  };
  onModelChanged = async (e, model, save = true) => await this.onUpdate();
  onDropped = async (e, model) => await this.onModelChanged(e, model);
  onPasted = async (e, model) => await this.onModelChanged(e, model);
  onMoved = async (e, model) => await this.onModelChanged(e, model);
  onNodeAddLeft = async (e, obj, model, node) =>
    await this.openBotSelection(node, false);
  onNodeAddRight = async (e, obj, model, node) =>
    await this.openBotSelection(node, true);
  onSetData = async (e, data, params) => {
    //nothing
  };
  onSelectionDeleted = async (e, model, nodes) => {
    //nothing
  };

  openBotParamsPopup = (data, first) => {
    const { root } = this.state;
    this.props.popupAdd(
      <BotParams
        noclose={true}
        root={root}
        data={data}
        first={first}
        onUpload={this.onUpload}
        onClose={async (e, removingLastPopup, parameters, asd) => {
          if (parameters instanceof Array) data.parameters = parameters;
          await this.props.popupRemoveLast();
          await this.onUpdate();
        }}
      />
    );
  };

  renderBotParameter(o, i) {
    const { type, name, required, value } = o;
    return (
      <div
        key={i}
        className={`node-parameter ${required ? "required" : ""} ${
          required && !value ? "error" : ""
        }`}
      >
        <label>{`${name} - ${type.ucfirst()}`}</label>
        <div>{type !== "password" ? value : "****"}</div>
      </div>
    );
  }
  renderBotParameters() {
    const { node } = this.state;
    if (!node) return null;
    const { parameters } = node;
    if (!node.parameters || !node.parameters.length) return null;
    return (
      <div className="node-parameters">
        <h4 className="heading">
          Node parameters: <br /> * Double click on node to edit parameters
          <br />
          - (*): required
          <br />- <span className="error">Red</span>: field is invalid
        </h4>
        {parameters.map((o, i) => this.renderBotParameter(o, i))}
      </div>
    );
  }
  renderPreview() {
    const { files } = this.props.Application;
    const { preview, previewOffset, previewPath } = this.state;
    const count = files.length;
    const move = (e, next = true) => {
      const { selected } = this.state;
      const idx = files.indexOf(selected);
      const file =
        files[
          next
            ? idx === count - 1
              ? 0
              : idx + 1
            : idx === 0
            ? count - 1
            : idx - 1
        ];
      this.onOpenFile({ target: this[file.name] }, file);
    };
    return (
      <FinderPreview
        ref={e => (this.preview = e)}
        offset={previewOffset}
        data={preview}
        path={previewPath}
        hasSkipButtons={count > 1}
        onSkipPrevious={e => move(e, false)}
        onSkipNext={e => move(e, true)}
      />
    );
  }
  renderOutput(o, i) {
    const { name } = o;
    return (
      <div
        key={i}
        ref={e => (this[name] = e)}
        className="file output"
        onClick={e => this.onOpenFile(e, o)}
      >
        <Icon icon="fas fa-file" />
        {name.substr(name.lastIndexOf("/") + 1)}
      </div>
    );
  }
  renderOutputs() {
    const { files } = this.props.Application;
    if (!files || !files.length) return null;
    return (
      <div className="outputs">
        <div className="title">Outputs</div>
        {files.map((o, i) => this.renderOutput(o, i))}
      </div>
    );
  }
  render() {
    const { onNodeClicked, onNodeDClicked, onModelChanged } = this;
    const { onDropped, onPasted, onMoved, onSetData, onClicked } = this;
    const { onNodeAddLeft, onNodeAddRight, onSelectionDeleted } = this;
    let dProps = { id: "from-page-bots" };
    dProps = { ...dProps, onNodeClicked, onNodeDClicked, onModelChanged };
    dProps = { ...dProps, onDropped, onPasted, onMoved, onSetData, onClicked };
    dProps = { ...dProps, onNodeAddLeft, onNodeAddRight, onSelectionDeleted };
    return (
      <div
        className="editor form"
        onClick={e => this.setState({ preview: {} })}
      >
        <h3>
          Flow Editor
          <Space />
          <ButtonRounded
            icon="PlayCircleFilled"
            title="Test"
            onClick={this.onTest}
          />
          <ButtonRounded
            icon="Add"
            title="Add service"
            onClick={this.openBotSelection}
          />
          <Dropzone
            className="dropzone"
            multiple={false}
            onDrop={files => this.onUpload(files[0])}
          >
            <ButtonRounded icon="CloudUpload" title="Upload file" />
          </Dropzone>
          <ButtonRounded
            icon="Save"
            title="Save as product"
            onClick={this.onSaveAs}
          />
          <ButtonRounded
            title="Close"
            icon="HighlightOff"
            className="close"
            onClick={e => this.props.applicationOnRemoveLastPopup(true)}
          />
        </h3>
        <div className="content">
          {this.renderBotParameters()}
          <Diagram
            ref={e => (this.diagram = e)}
            data={this.props.Bot.temp}
            {...dProps}
          />
          {this.renderOutputs()}
          {this.renderPreview()}
        </div>
      </div>
    );
  }
}

export default connect(BotEditor);
