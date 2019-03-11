import go from "gojs";

import { makePort, nodeStyle } from "./helper";

import { nodeLabel, nodeTooltip } from "./nodeTemplate";

if (process.env.NODE_ENV === "test") go.Palette.useDOM(false);
const $ = go.GraphObject.make;

function nodePicture({ pictureSize }) {
  return $(
    go.Panel,
    "Vertical",
    $(
      go.Picture,
      {
        height: pictureSize,
        width: pictureSize,
        scale: 1,
        imageStretch: go.GraphObject.UniformToFill
      },
      new go.Binding(
        "source",
        "image",
        image => image || "/assets/node/default-icon.svg"
      )
    )
  );
}
export default function(opts) {
  opts = {
    size: 74,
    margin: 24,
    labelH: 18,
    letterN: 3,
    fontSize: 13,
    selectionAdorned: true,
    ...opts
  };
  const { size, margin, labelH, selectionAdorned } = opts;
  opts.width = size + 2 * margin;
  opts.height = margin + size + margin + labelH + margin;
  opts.letterH = size / 5;

  return $(
    go.Node,
    "Spot",
    nodeStyle(),
    { selectionAdorned },
    {
      selectionAdornmentTemplate: $(
        go.Adornment,
        "Position",
        $(
          go.Panel,
          "Spot",
          // this Adornment has a rectangular blue Shape around the selected node
          $(go.Shape, {
            fill: null,
            stroke: "#ff555d",
            strokeWidth: 1.5,
            width: opts.width,
            height: opts.height,
            position: new go.Point(-100, -100)
          }),
          $(go.Placeholder)
        )
      )
    },
    $(
      go.Panel,
      "Position",
      { width: opts.width, height: opts.height },
      nodePicture(opts),
      nodeLabel(opts),
      nodeTooltip(opts)
    ),
    makePort("T", go.Spot.Top, go.Spot.TopSide, true),
    makePort("L", go.Spot.Left, go.Spot.LeftSide, true),
    makePort("R", go.Spot.Right, go.Spot.RightSide, true),
    makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true)
  );
}
