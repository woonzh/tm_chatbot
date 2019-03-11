import go from "gojs";

import {
  DEFAULT_LINE_COLOR,
  DEFAULT_SHAPE_COLOR
} from "../../../styles/canvas";

if (process.env.NODE_ENV === "test") go.Palette.useDOM(false);
const $ = go.GraphObject.make;

const dashSize = 3;
let job = null;

export function loop(canvas, next) {
  if (job) clearTimeout(job);
  if (canvas) {
    job = setTimeout(function() {
      if (!canvas || !canvas.links) return;
      canvas.links.each(link => {
        var shape = link.findObject("PIPE");
        if (shape) {
          const off = shape.strokeDashOffset - 2;
          shape.strokeDashOffset = off <= 0 ? 20 : off;
        }
      });
      if (next) next();
      loop(canvas);
    }, 200);
  }
}
export default $(
  go.Link,
  {
    routing: go.Link.AvoidsNodes,
    curve: go.Link.JumpGap,
    corner: 6,
    reshapable: true,
    toShortLength: 30,
    selectable: true,
    relinkableFrom: true,
    relinkableTo: true,
    mouseEnter: function(e, link) {
      link.findObject("HIGHLIGHT").stroke = DEFAULT_SHAPE_COLOR;
    },
    mouseLeave: function(e, link) {
      link.findObject("HIGHLIGHT").stroke = DEFAULT_LINE_COLOR;
    }
  },
  new go.Binding("points").makeTwoWay(),
  $(go.Shape, {
    isPanelMain: true,
    strokeWidth: 2 * dashSize,
    stroke: DEFAULT_LINE_COLOR,
    name: "HIGHLIGHT"
  }),
  $(go.Shape, {
    isPanelMain: true,
    stroke: DEFAULT_LINE_COLOR,
    strokeWidth: dashSize
  }),
  $(go.Shape, {
    isPanelMain: true,
    stroke: "#333333",
    strokeWidth: dashSize,
    name: "PIPE",
    strokeDashArray: [dashSize, dashSize]
  }),
  $(go.Shape, {
    fromArrow: "Circle",
    strokeWidth: dashSize,
    fill: DEFAULT_LINE_COLOR,
    stroke: DEFAULT_LINE_COLOR
  }),
  $(go.Shape, {
    toArrow: "Standard",
    stroke: DEFAULT_LINE_COLOR,
    fill: DEFAULT_LINE_COLOR,
    strokeWidth: dashSize
  }),
  {
    // When link is selected
    selectionAdornmentTemplate: $(
      go.Adornment,
      $(go.Shape, {
        isPanelMain: true,
        stroke: DEFAULT_SHAPE_COLOR,
        strokeWidth: 2
      }),
      $(go.Shape, {
        toArrow: "Circle",
        strokeWidth: 0,
        stroke: null,
        fill: DEFAULT_SHAPE_COLOR
      })
    )
  }
);
