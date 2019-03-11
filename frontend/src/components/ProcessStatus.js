import React from "react";
import * as go from "gojs";
import { ToolManager } from "gojs";

import { connect } from "../redux";

import { Form, Icon } from "./core";
import { nodeTemplate, groupTemplate, linkTemplate, loop } from "./editor";

import FinderPreview from "./FinderPreview";
import ProcessCmp from "./ProcessCmp";

const $ = go.GraphObject.make;

class ProcessStatus extends ProcessCmp {
  state = {
    files: [],
    previewMargin: 32,
    previewOffset: { right: 0, top: 0 },
    previewPath: null
  };
  ///////
  get processInstance() {
    return this.process;
  }
  get onProcessUpdate() {
    return this.processUpdate;
  }
  get id() {
    return this.props.process;
  }
  get executor() {
    return this.props.executor || "tagui";
  }
  get process() {
    return this.store.Process.items.find(o => o.id === this.id);
  }
  async componentDidMount() {
    super.componentDidMount();
    this.createDiagram(this.id);
  }
  ///////
  processUpdate = async msg => {
    if (!msg) return;
    const { nodeid, status, files } = msg;
    if (files) this.setState({ files });
    if (!nodeid) {
      if (status === "start")
        await this.props.processRun(this.store.Process.detail);
      if (status === "done")
        await this.props.processDone(this.store.Process.detail);
      return;
    }
    const model = this.canvas.model;
    const color = status === "start" ? "green" : "gray";
    const current = model.nodeDataArray.find(n => n.id === nodeid);
    model.startTransaction("background");
    model.nodeDataArray.map(node => {
      const ncolor = node.background ? node.background : "transparent";
      if (current === node) model.setDataProperty(node, "background", color);
      else model.setDataProperty(node, "background", ncolor);
    });
    model.commitTransaction("background");
  };
  ///////
  createDiagram = elId => {
    const el = document.getElementById(this.id);
    if (el && !el.done) {
      const canvas = (this.canvas = global.canvas = $(go.Diagram, elId, {
        // // initialAutoScale: go.Diagram.UniformToFill,
        // // "grid.visible": true,
        // // layout: $(go.TreeLayout, { comparer: go.LayoutVertex.smartComparer })
        initialContentAlignment: go.Spot.Center,
        scale: 0.5,
        allowDrop: true,
        scrollsPageOnFocus: false,
        "grid.gridCellSize": new go.Size(30, 30),
        "draggingTool.isGridSnapEnabled": true,
        "resizingTool.isGridSnapEnabled": true,
        "rotatingTool.snapAngleMultiple": 90,
        "rotatingTool.snapAngleEpsilon": 45,
        "commandHandler.archetypeGroupData": {
          isGroup: true,
          category: "OfNodes"
        },
        "undoManager.isEnabled": false,
        isReadOnly: true
      }));
      canvas.toolManager.panningTool.isEnabled = false;
      canvas.toolManager.mouseWheelBehavior = ToolManager.WheelScroll;
      this.setNodeTemplate(canvas);
      this.setGroupTemplate(canvas);
      this.setLinkTemplate(canvas);
      this.setData(canvas);
      loop(canvas, e => {});
      el.done = true;
    }
  };
  setData = o => {
    const { process } = this;
    const { nodeDataArray, linkDataArray } = process;
    o.model = new go.GraphLinksModel(
      Array.from(nodeDataArray),
      Array.from(linkDataArray)
    );
  };
  setNodeTemplate = o => {
    o.nodeTemplateMap.add("default", nodeTemplate({ onlyImage: false }));
    o.nodeTemplateMap.add("onlyImage", nodeTemplate({ onlyImage: true }));
  };
  setGroupTemplate = o => o.groupTemplateMap.add("OfNodes", groupTemplate);
  setLinkTemplate = o => (o.linkTemplate = linkTemplate);
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

  renderPreview() {
    const { files, preview, previewOffset, previewPath } = this.state;
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
    const { files } = this.state;
    if (!files || !files.length) return null;
    return (
      <div className="outputs">
        <div className="title">Outputs</div>
        {files.map((o, i) => this.renderOutput(o, i))}
      </div>
    );
  }
  render() {
    return (
      <Form className="form-process-status">
        <h3 className="horizontal center middle fullW firstline">
          Process Status
        </h3>
        <div className="horizontal">
          <div id={this.id} className="canvas" />
          {this.renderOutputs()}
          {this.renderPreview()}
        </div>
      </Form>
    );
  }
}

export default connect(ProcessStatus);
