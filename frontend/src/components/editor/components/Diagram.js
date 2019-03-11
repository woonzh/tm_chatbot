import React, { Component } from "react";
import * as go from "gojs";
import { ToolManager } from "gojs";

import { api, apis } from "../../../redux";

import { nodeTemplate, groupTemplate, linkTemplate, loop } from "../templates";

const $ = go.GraphObject.make;

export { nodeTemplate, groupTemplate, linkTemplate, loop };

export class Diagram extends Component {
  state = { data: null };
  defautProps = {
    // initialAutoScale: go.Diagram.UniformToFill,
    // "grid.visible": true,
    // layout: $(go.TreeLayout, { comparer: go.LayoutVertex.smartComparer }),
    initialContentAlignment: go.Spot.Center,
    initialScale: this.props.scale || 0.8,
    scale: this.props.scale || 0.8,
    minScale: this.props.minScale || 0.3,
    maxScale: this.props.maxScale || 1.8,
    allowDrop: this.props.allowDrop,
    scrollsPageOnFocus: this.props.scrollsPageOnFocus,
    "grid.gridCellSize": this.props.cellSize || new go.Size(30, 30),
    "draggingTool.isGridSnapEnabled": true,
    "resizingTool.isGridSnapEnabled": true,
    "rotatingTool.snapAngleMultiple": 90,
    "rotatingTool.snapAngleEpsilon": 45,
    "commandHandler.archetypeGroupData": {
      isGroup: true,
      category: "OfNodes"
    },
    "undoManager.isEnabled": false
  };
  get id() {
    return this.props.id || this.props.diagramId || "apa-diagram";
  }
  get data() {
    return this.props.data || {};
  }
  get isTemp() {
    return this.data.product ? false : true;
  }
  get nodes() {
    return [].merge(this.data.nodes || this.data.nodeDataArray);
  }
  get links() {
    return [].merge(this.data.links || this.data.linkDataArray);
  }
  get parameters() {
    return this.data.parameters;
  }
  get selection() {
    return [].merge(this.props.selection);
  }
  get model() {
    return this.diagram.model;
  }

  ///////
  async componentDidMount() {
    await this.createDiagram(this.id);
  }
  async componentWillUnmount() {
    await loop(false);
  }
  ///////
  setData = async o => {
    if (!o) o = this.diagram;
    if (!o) return;
    const { nodes, links, selection } = this;
    if (o.model.nodeDataArray.length !== nodes.length) {
      o.model = new go.GraphLinksModel(nodes, links);
    } else {
      o.model.commit(async m => {
        const { nodeDataArray } = m;
        nodeDataArray.map(n => {
          const { key } = n;
          const node = nodes.find(o => o.key === key);
          if (node) Object.keys(node).map(k => m.set(n, k, node[k]));
        });
        if (selection && selection.length) {
          const data = selection[0];
          const first = o.findNodeForData(data);
          if (first) o.select(first);
        }
      }, "setData");
    }
    if (this.props.onSetData) {
      const data = selection && selection[0];
      const params = data && data.parameters;
      await this.props.onSetData({ diagram: o }, data, params);
    }
  };
  ////////
  createDiagram = elId => {
    const el = document.getElementById(this.id);
    if (el && !el.done) {
      const diagram = (this.diagram = global.diagram = $(
        go.Diagram,
        elId,
        this.defautProps
      ));
      diagram.toolManager.panningTool.isEnabled = false;
      diagram.toolManager.mouseWheelBehavior = ToolManager.WheelScroll;
      this.setNodeTemplate(diagram);
      this.setGroupTemplate(diagram);
      this.setLinkTemplate(diagram);
      this.setEventsListeners(diagram);
      this.setData(diagram);
      loop(diagram);
      el.done = true;
    }
  };
  selectNodeData = async data =>
    await this.selectNode(this.diagram.findNodeForData(data));
  selectNode = async node => {
    if (node) {
      const robot = new global.Robot(this.diagram);
      const loc = node.location;
      robot.mouseDown(loc.x + 2, loc.y + 2, 0, {});
      robot.mouseUp(loc.x + 2, loc.y + 2, 100, {});
    } else console.log("Node not found");
  };
  selectNodes = async nodes =>
    await this.diagram.selectCollection(
      [].merge(nodes).map(o => this.diagram.findNodeForData(o))
    );
  fetchParams = async data => {
    if (this.isTemp) return data;
    const productid = data.product;
    const nodeid = data.id || "";
    let outputs = await api({
      ...apis.product.nodeOutputs,
      success: "",
      nospinner: true,
      path: [nodeid || productid]
    });
    if (!outputs.error) data.outputs = outputs;
    let parameters = await api({
      ...apis.propertyPanel.list,
      success: "",
      nospinner: true,
      path: [nodeid],
      query: { id: productid }
    });
    if (!parameters.error) data.parameters = parameters;
    return data;
  };
  onNodeClicked = async e => {
    const model = e.model || e.diagram.model;
    const node = e.diagram.lastInput.targetObject.part;
    const { data } = node;
    if (this.state.data && this.state.data.id === data.id) return;
    await this.setState({ data });
    const isNode = data.hasOwnProperty("name");
    if (!isNode) return;
    const { parameters, outputs } = await this.fetchParams(data);
    if (this.props.onNodeClicked) {
      await this.props.onNodeClicked(e, model, data, parameters, outputs);
    }
  };
  onNodeDClicked = async e => {
    const model = e.model || e.diagram.model;
    const node = e.diagram.lastInput.targetObject.part;
    const { data } = node;
    await this.setState({ data });
    const isNode = data.hasOwnProperty("name");
    if (!isNode) return;
    const { parameters, outputs } = await this.fetchParams(data);
    if (this.props.onNodeDClicked)
      await this.props.onNodeDClicked(e, model, data, parameters, outputs);
  };
  onClicked = async e => {
    await this.setState({ data: null });
    if (this.props.onClicked) await this.props.onClicked(e);
  };
  onModelChanged = async e => {
    const model = e.model || e.diagram.model;
    if (this.props.onModelChanged) await this.props.onModelChanged(e, model);
  };
  onSelectionDeleted = async e => {
    const nodes = e.subject.toArray().map(o => o.part.data);
    const model = e.model || e.diagram.model;
    if (this.props.onSelectionDeleted)
      await this.props.onSelectionDeleted(e, model, nodes);
    await this.onModelChanged(e);
  };
  onDropped = async e => {
    e.diagram.selection.toArray().map(o => {
      delete o.data.id;
      o.data.isLast = true;
    });
    const model = e.model || e.diagram.model;
    if (this.props.onDropped) await this.props.onDropped(e, model);
  };
  onPasted = async e => {
    e.diagram.selection.toArray().map(o => delete o.data.id);
    const model = e.model || e.diagram.model;
    if (this.props.onPasted) await this.props.onPasted(e, model);
  };
  onMoved = async e => {
    const model = e.model || e.diagram.model;
    if (this.props.onMoved) await this.props.onMoved(e, model);
  };
  onNodeAddLeft = async (e, obj) => {
    const model = e.model || e.diagram.model;
    const node = obj.part.adornedPart;
    if (this.props.onNodeAddLeft)
      await this.props.onNodeAddLeft(e, obj, model, node);
  };
  onNodeAddRight = async (e, obj) => {
    const model = e.model || e.diagram.model;
    const node = obj.part.adornedPart;
    if (this.props.onNodeAddRight)
      await this.props.onNodeAddRight(e, obj, model, node);
  };
  ///////
  setNodeTemplate = o => {
    const { onNodeAddLeft, onNodeAddRight } = this;
    const props = {
      onlyImage: false,
      hoverAdornment: true,
      onNodeAddLeft,
      onNodeAddRight
    };
    o.nodeTemplateMap.add("default", nodeTemplate(props));
    o.nodeTemplateMap.add(
      "onlyImage",
      nodeTemplate({ ...props, onlyImage: true })
    );
  };
  setGroupTemplate = o => o.groupTemplateMap.add("OfNodes", groupTemplate);
  setLinkTemplate = o => (o.linkTemplate = linkTemplate);
  setEventsListeners = o => {
    o.addDiagramListener("SelectionMoved", this.onMoved);
    o.addDiagramListener("ExternalObjectsDropped", this.onDropped);
    o.addDiagramListener("ClipboardPasted", this.onPasted);

    o.addDiagramListener("SelectionDeleted", this.onSelectionDeleted);
    o.addDiagramListener("LinkDrawn", this.onModelChanged);
    o.addDiagramListener("LinkRelinked", this.onModelChanged);
    o.addDiagramListener("LinkReshaped", this.onModelChanged);

    o.addDiagramListener("BackgroundSingleClicked", this.onClicked);
    o.addDiagramListener("ObjectSingleClicked", this.onNodeClicked);
    o.addDiagramListener("ObjectDoubleClicked", this.onNodeDClicked);
    if (this.props.setEventsListeners) this.props.setEventsListeners(o);
  };
  render() {
    return <div key="diagram " className="diagram" id={this.id} />;
  }
}

export default Diagram;
