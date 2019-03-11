import go from "gojs";

import {
  DEFAULT_LINE_COLOR,
  DEFAULT_SHAPE_COLOR
} from "../../../styles/canvas";

import { makePort, nodeStyle } from "./helper";

if (process.env.NODE_ENV === "test") go.Palette.useDOM(false);
const $ = go.GraphObject.make;

export function nodeBackground(opts) {
  const { width, height } = opts;
  return $(go.Shape, new go.Binding("fill", "background"), {
    width,
    height,
    position: new go.Point(0, 0),
    figure: "Rectangle",
    fill: "transparent",
    strokeWidth: 0
  });
}
export function nodePic(opts) {
  const { width } = opts;
  return $(
    go.Picture,
    {
      width,
      height: width,
      imageStretch: go.GraphObject.UniformToFill
    },
    new go.Binding(
      "source",
      "image",
      image => image || "/assets/node/default-icon.svg"
    )
  );
}
export function nodeShape(opts) {
  const { size, margin, stroke, onlyImage } = opts;
  return onlyImage
    ? {}
    : $(
        go.Shape,
        new go.Binding("figure", "figure"),
        new go.Binding("fill", "fill"),
        {
          width: size,
          height: size,
          position: new go.Point(margin, margin),
          figure: "Circle",
          fill: "transparent",
          strokeWidth: stroke,
          stroke: DEFAULT_SHAPE_COLOR
        }
      );
}
export function nodeWrapper(opts) {
  const { width } = opts;
  return $(go.Shape, {
    geometryString: `F M0 0 L100 0 L100 100 L0 100 z M5,50 a45,45 0 1,0 90,0 a45,45 0 1,0 -90,0 z`,
    desiredSize: new go.Size(width, width),
    strokeWidth: 0,
    fill: "#333333"
  });
}
export function nodeLabel(opts) {
  const { size, margin, width, fontSize } = opts;
  return $(
    go.TextBlock,
    "",
    {
      font: `normal ${fontSize}px sans-serif`,
      stroke: "#fff",
      isMultiline: true,
      editable: false,
      width,
      textAlign: "center",
      position: new go.Point(0, margin + size + 1.5 * margin)
    },
    new go.Binding("text", "name")
  );
}
export function nodeLetters(opts) {
  const { size, margin, letterN, width, letterH, onlyImage } = opts;
  return onlyImage
    ? {}
    : $(
        go.TextBlock,
        "",
        {
          font: `bold ${letterH}px sans-serif`,
          stroke: DEFAULT_LINE_COLOR,
          width,
          textAlign: "center",
          position: new go.Point(0, margin + (size - letterH) / 2 + 1)
        },
        new go.Binding("text", "name", name => name.substr(0, letterN))
      );
}
export function nodeTooltip(opts) {
  return {
    toolTip: $(
      go.Adornment,
      "Auto",
      $(go.Shape, { fill: "#FFFFCC" }),
      $(
        go.TextBlock,
        { margin: 4 },
        new go.Binding(
          "text",
          "",
          n => `${n.name}${n.description ? ` - ${n.description}` : ""}`
        )
      )
    )
  };
}
export function nodeHoverAdornment(opts) {
  const { hoverAdornment } = opts;
  if (hoverAdornment) {
    const adornment = $(
      go.Adornment,
      "Spot",
      {
        background: "transparent",
        // hide the Adornment when the mouse leaves it
        mouseLeave: function(e, obj) {
          let ad = obj.part;
          ad.adornedPart.removeAdornment("mouseHover");
        }
      },
      $(go.Placeholder, {
        background: "transparent", // to allow this Placeholder to be "seen" by mouse events
        isActionable: true, // needed because this is in a temporary Layer
        click: function(e, obj) {
          let node = obj.part.adornedPart;
          node.diagram.select(node);
        }
      }),
      $(
        "Button",
        {
          alignment: go.Spot.Right,
          alignmentFocus: go.Spot.Left
        },
        {
          click: function(e, obj) {
            alert("+");
          }
        },
        $(go.TextBlock, "( + )")
      ),
      $(
        "Button",
        { alignment: go.Spot.Left, alignmentFocus: go.Spot.Right },
        {
          click: function(e, obj) {
            alert("+");
          }
        },
        $(go.TextBlock, "( + )")
      )
    );
    return {
      mouseHover: function(e, obj) {
        const node = obj.part;
        adornment.adornedObject = node;
        node.addAdornment("mouseHover", adornment);
      }
    };
  } else return {};
}
export function selectionAdornment(opts) {
  const { selectionAdorned, selectionStroke, width, height } = opts;
  const { onNodeAddLeft, onNodeAddRight } = opts;
  return selectionAdorned
    ? {
        selectionAdornmentTemplate: $(
          go.Adornment,
          "Spot",
          $(go.Shape, {
            fill: null,
            stroke: selectionStroke,
            strokeWidth: 1.5,
            width,
            height,
            position: new go.Point(-100, -100)
          }),
          $(go.Placeholder),
          $(
            "Button",
            {
              "ButtonBorder.fill": "black",
              "ButtonBorder.stroke": "#af3e47",
              "ButtonBorder.width": 40,
              "ButtonBorder.height": 40,
              alignment: go.Spot.Left,
              alignmentFocus: go.Spot.Right
            },
            $(go.TextBlock, "+", {
              stroke: "#af3e47",
              font: "bold 14pt serif"
            }),
            { click: onNodeAddLeft }
          ),
          $(
            "Button",
            {
              "ButtonBorder.fill": "black",
              "ButtonBorder.stroke": "#af3e47",
              "ButtonBorder.width": 40,
              "ButtonBorder.height": 40,
              alignment: go.Spot.Right,
              alignmentFocus: go.Spot.Left
            },
            $(go.TextBlock, "+", {
              stroke: "#af3e47",
              font: "bold 14pt serif"
            }),
            { click: onNodeAddRight }
          )
        )
      }
    : {};
}
export default function(opts) {
  opts = {
    size: 74,
    margin: 24,
    labelH: 18,
    letterN: 2,
    stroke: 2,
    fontSize: 16,
    selectionAdorned: true,
    selectionStroke: "#ff555d",
    onlyImage: false,
    hoverAdornment: false,
    ...opts
  };
  const { size, margin, labelH, selectionAdorned } = opts;
  opts.width = size + 2 * margin;
  opts.height = margin + size + margin + labelH + margin;
  opts.letterH = size / 3.5;

  return $(
    go.Node,
    "Spot",
    nodeStyle(),
    { selectionAdorned },
    selectionAdornment(opts),
    $(
      go.Panel,
      "Position",
      { width: opts.width, height: opts.height },
      nodeBackground(opts),
      nodePic(opts),
      // nodeShape(opts),
      // nodeWrapper(opts),
      nodeLetters(opts),
      nodeLabel(opts),
      nodeTooltip(opts)
    ),
    makePort("T", go.Spot.Top, go.Spot.TopSide, true),
    makePort("L", go.Spot.Left, go.Spot.LeftSide, true),
    makePort("R", go.Spot.Right, go.Spot.RightSide, true),
    makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true)
  );
}
