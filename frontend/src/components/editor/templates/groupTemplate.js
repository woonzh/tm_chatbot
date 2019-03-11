import go from "gojs";

import { makePort, highlightGroup, finishDrop } from "./helper";

if (process.env.NODE_ENV === "test") go.Palette.useDOM(false);

const $ = go.GraphObject.make;

export default $(
  go.Group,
  "Auto",
  {
    background: "transparent",
    ungroupable: true,
    // highlight when dragging into the Group
    mouseDragEnter: function(e, grp, prev) {
      highlightGroup(e, grp, true);
    },
    mouseDragLeave: function(e, grp, next) {
      highlightGroup(e, grp, false);
    },
    computesBoundsAfterDrag: true,
    // when the selection is dropped into a Group, add the selected Parts into that Group;
    // if it fails, cancel the tool, rolling back any changes
    mouseDrop: finishDrop,
    handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links
    // Groups containing Nodes lay out their members horizontal
    layout: $(go.GridLayout, {
      wrappingWidth: Infinity,
      alignment: go.GridLayout.Position,
      cellSize: new go.Size(1, 1)
    })
  },
  new go.Binding("background", "isHighlighted", function(h) {
    return h ? "rgba(255,0,0,0.2)" : "transparent";
  }).ofObject(),
  $(go.Shape, "Rectangle", {
    fill: null,
    stroke: "#000",
    strokeWidth: 2
  }),
  $(
    go.Panel,
    "Vertical", // title above Placeholder
    $(
      go.Panel,
      "Horizontal", // button next to TextBlock
      { stretch: go.GraphObject.Horizontal, background: "#000" },
      $("SubGraphExpanderButton", {
        alignment: go.Spot.Right,
        margin: 5
      }),
      $(
        go.TextBlock,
        {
          alignment: go.Spot.Left,
          editable: true,
          margin: 5,
          font: "bold 16px sans-serif",
          opacity: 0.75,
          stroke: "#fff"
        },
        new go.Binding("text", "text").makeTwoWay()
      )
    ), // end Horizontal Panel
    $(go.Placeholder, { padding: 10, alignment: go.Spot.TopLeft })
  ), // end Vertical Panel
  // four named ports, one on each side:
  makePort("T", go.Spot.Top, go.Spot.TopSide, true),
  makePort("L", go.Spot.Left, go.Spot.LeftSide, true),
  makePort("R", go.Spot.Right, go.Spot.RightSide, true),
  makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true)
);
