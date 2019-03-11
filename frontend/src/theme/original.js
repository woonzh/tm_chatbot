const tableRowHeight = 32;
const tableHeadHeight = 44;
const spacingUnit = 18;
const pageHeadingFontSize = 26;
export default {
  typography: {
    useNextVariants: true
  },
  palette: {
    type: "dark",
    primary: {
      light: "#486c72",
      main: "#00ffff",
      dark: "#00ffff",
      contrastText: "#002121"
    },
    secondary: {
      light: "#a31e22",
      main: "#ff6464",
      dark: "#ff6464",
      contrastText: "#002121"
    },
    background: {
      default: "#333333"
    }
  },
  overrides: {
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid #00ffff"
        }
      }
    },
    MuiTable: {
      root: {
        backgroundColor: "#000000"
      }
    },
    MuiTableRow: {
      head: {
        height: tableHeadHeight
      }
    },
    MuiTableHead: {
      root: {
        backgroundColor: "#000000"
      }
    },
    MuiTableCell: {
      root: {
        padding: "0 6px"
      },
      head: {
        fontWeight: "bold",
        color: "#ffffff",
        padding: "0 6px",
        backgroundColor: "#000000",
        boxShadow: "0px 1px 0px #ff555d"
      }
    }
  },
  tableRoot: {
    width: "100%"
  },
  table: {},
  tableWrapper: {
    overflowX: "auto",
    overflowY: "auto"
  },
  tableRowHeight,
  tableHeadRow: {},
  tableRow: {},
  tableCheckbox: {
    padding: 0
  },
  tableToolbar: {
    minHeight: tableRowHeight,
    paddingLeft: spacingUnit,
    paddingRight: spacingUnit,
    paddingTop: 0,
    paddingBottom: 0
  },
  tableToolbarHighlight: {
    color: "#00ffff",
    backgroundColor: "#ff6464"
  },
  tableToolbarSpacer: {
    flex: "1 1 100%"
  },
  tableToolbarActions: {
    // color: theme.palette.text.secondary
  },
  tableToolbarTitleSelected: {
    flex: "0 0 auto",
    color: "#fff",
    fontWeight: "normal",
    fontSize: 18
  },
  tableToolbarTitle: {
    flex: "0 0 auto",
    color: "#f8d800",
    fontWeight: "bold",
    fontSize: pageHeadingFontSize
  },
  tableSearchField: {
    flex: "1 1 100%",
    borderRadius: 0,
    width: "100%",
    backgroundColor: "transparent",
    fontSize: "inherit",
    fontWeight: "inherit",
    color: "inherit"
  }
};
