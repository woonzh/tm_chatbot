import go from "gojs";

// go.Palette.useDOM(false); // Uncomment this line for testing
const $ = go.GraphObject.make;

export const makePort = (name, align, spot, linkable) => {
  return $(go.Shape, "Circle", {
    stroke: "transparent",
    desiredSize: new go.Size(8, 8),
    margin: new go.Margin(1, 0),
    fill: "transparent",
    portId: name, // declare this object to be a "port"
    alignment: align, // align the port on the main Shape
    fromSpot: spot, // declare where links may connect at this port
    fromLinkable: linkable, // declare whether the user may draw links from here
    toSpot: spot, // declare where links may connect at this port
    toLinkable: linkable, // declare whether the user may draw links to here
    cursor: "pointer" // show a different cursor to indicate potential link point
  });
};

export const showPorts = (node, show) => {
  var diagram = node.diagram;
  if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
  node.ports.each(function(port) {
    port.stroke = show ? "white" : null;
  });
};

export const nodeStyle = () => {
  return [
    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
      go.Point.stringify
    ),
    {
      locationSpot: go.Spot.Center,
      mouseEnter: function(e, obj) {
        showPorts(obj.part, true);
      },
      mouseLeave: function(e, obj) {
        showPorts(obj.part, false);
      }
    }
  ];
};

export const textStyle = () => {
  return {
    font: "10pt Inconsolata, monospace",
    stroke: "#fff"
  };
};

export const highlightGroup = (e, grp, show) => {
  if (!grp) return;
  e.handled = true;
  if (show) {
    // cannot depend on the grp.diagram.selection in the case of external drag-and-drops;
    // instead depend on the DraggingTool.draggedParts or .copiedParts
    var tool = grp.diagram.toolManager.draggingTool;
    var map = tool.draggedParts || tool.copiedParts; // this is a Map
    // now we can check to see if the Group will accept membership of the dragged Parts
    if (grp.canAddMembers(map.toKeySet())) {
      grp.isHighlighted = true;
      return;
    }
  }
  grp.isHighlighted = false;
};

export const finishDrop = (e, grp) => {
  var ok =
    grp !== null
      ? grp.addMembers(grp.diagram.selection, true)
      : e.diagram.commandHandler.addTopLevelParts(e.diagram.selection, true);
  if (!ok) e.diagram.currentTool.doCancel();
};
