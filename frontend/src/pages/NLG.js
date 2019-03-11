import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import Logo from "../components/Logo";
import { Page, Space } from "../components";
import { Toolbar, AppBar as SimpleAppBar, IconButton } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { connect } from "../redux";
const styles = theme => ({
  formContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
    width: "40%",
    float: "left"
  },
  nameInput: {
    height: "50px !important",
    backgroundColor: "#333333 !important",
    fontSize: "16px !important",
    padding: "0 15px !important"
  },
  textField: {
    marginLeft: 0,
    marginRight: 0
  },
  formControl: {
    marginBottom: 2 * theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  },
  cssLabel: {
    transform: "translate(14px, 10px) scale(1)"
  },
  button: {
    width: "40%",
    margin: "auto",
    minHeight: "30px",
    marginTop: "20px"
  },
  progress: {
    color: "#fff",
    fontSize: "10px"
  },
  result: {
    padding: "20px",
    marginBottom: "10px"
  },
  resultContainer: {
    width: "50%",
    float: "left",
    marginLeft: "20px",
    overflowY: "scroll",
    height: "800px"
  },
  selectMenu: {
    padding: "0px"
  }
});
export class NLG extends Page {
  state = {
    name: "",
    typeEatery: "",
    typeFood: "",
    price: "",
    rating: "",
    area: "",
    nearby: "",
    results: [],
    isLoading: false,
    familyFriendly: ""
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSelect = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClick = () => {
    const {
      name,
      typeEatery,
      typeFood,
      price,
      rating,
      area,
      nearby,
      results
    } = this.state;
    this.setState({
      isLoading: true
    });
    return fetch(this.props.apis.demo.loadnlg.url, {
      method: "POST",
      "Content-Type": "application/json; charset=utf-8",
      body: JSON.stringify({
        name,
        eatType: typeEatery,
        food: typeFood,
        priceRange: price,
        "customer rating": rating,
        area,
        near: nearby
      })
    })
      .then(response => response.json())
      .then(data => {
        results.push(this.highlight(data.model_d));
        this.setState({
          results,
          isLoading: false
        });
      });
  };

  highlight = result => {
    const {
      name,
      typeEatery,
      typeFood,
      price,
      rating,
      area,
      nearby
    } = this.state;
    const variables = {
      name,
      typeEatery,
      typeFood,
      price,
      rating,
      area,
      nearby
    };
    let startResult;
    let endResult;
    let startArr = [];
    let endArr = [];
    for (let prop in variables) {
      const startregex = new RegExp("<" + prop + ">", "gi");
      const endregex = new RegExp("</" + prop + ">", "gi");
      while ((startResult = startregex.exec(result))) {
        startArr.push({ prop: prop, startResult });
      }
      while ((endResult = endregex.exec(result))) {
        endArr.push({ prop: prop, endResult });
      }
    }
    startArr.sort((a, b) => a.startResult.index < b.startResult.index);
    endArr.sort((a, b) => a.endResult.index < b.endResult.index);

    let finalResult = [];
    let checkStart = 0;
    for (let i = 0; i < startArr.length; i++) {
      let start = startArr[i].startResult.index;
      let end = endArr[i].endResult.index;
      let className = startArr[i].prop + "-highlight";
      let startMarkLength = startArr[i]["startResult"][0].length;
      let endMarkLength = endArr[i]["endResult"][0].length;
      let previousStr = result.substring(checkStart, start);
      let markStr = result.substring(start + startMarkLength, end);
      checkStart = end + endMarkLength;
      finalResult.push(<span>{previousStr}</span>);
      finalResult.push(<span className={className}>{markStr}</span>);
    }
    finalResult.push(<span>{result.substring(checkStart)}</span>);

    return finalResult;
  };

  renderResult = () => {
    const { classes } = this.props;
    const { results } = this.state;
    const content = results.map(result => {
      return <Paper className={classes.result}>{result}</Paper>;
    });
    return <div className={classes.resultContainer}>{content.reverse()}</div>;
  };

  renderSubmitButton = () => {
    const { classes } = this.props;
    if (this.state.isLoading) {
      return (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleClick}
        >
          <CircularProgress size={15} className={classes.progress} />
        </Button>
      );
    } else {
      return (
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleClick}
        >
          Generate
        </Button>
      );
    }
  };
  renderComponent() {
    const { classes } = this.props;
    let bi;
    return (
      <div className="page page-nlg">
        <SimpleAppBar
          position="absolute"
          color="default"
          className={"appbar-shift"}
        >
          <Toolbar
            disableGutters={true}
            style={{ borderBottom: "1px solid #aaa" }}
          >
            <div className="appbar-content" style={{ padding: "20px" }}>
              <Logo />
              <Space />
            </div>
            <div style={{ flex: "1" }} />
            <img
              src="/assets/logo.png"
              style={{ width: "79px", marginRight: "15px" }}
            />
          </Toolbar>
        </SimpleAppBar>
        <div style={{ marginTop: "70px" }}>
          <form className={classes.formContainer} noValidate autoComplete="off">
            <TextField
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              InputProps={{
                classes: {
                  input: classes.nameInput
                }
              }}
              id="outlined-name"
              label="Restaurant Name"
              onChange={this.handleChange("name")}
              className={classes.textField}
              fullWidth={true}
              variant="outlined"
            />

            <TextField
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel
                }
              }}
              InputProps={{
                classes: {
                  input: classes.nameInput
                }
              }}
              onChange={this.handleChange("nearby")}
              id="outlined-name"
              label="Near By"
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Type of Eatery</InputLabel>
              <Select
                onChange={this.handleSelect}
                value={this.state.typeEatery}
                input={<OutlinedInput name="typeEatery" id="typeEatery" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"pub"}>pub</MenuItem>
                <MenuItem value={"coffee shop"}>coffee shop</MenuItem>
                <MenuItem value={"restaurant"}>restaurant</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Type of Food</InputLabel>
              <Select
                onChange={this.handleSelect}
                value={this.state.typeFood}
                input={
                  <OutlinedInput
                    labelWidth={this.state.labelWidth}
                    name="typeFood"
                    id="typeFood"
                  />
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"French"}>French</MenuItem>
                <MenuItem value={"Indian"}>Indian</MenuItem>
                <MenuItem value={"Chinese"}>Chinese</MenuItem>
                <MenuItem value={"Italian"}>Italian</MenuItem>
                <MenuItem value={"English"}>English</MenuItem>
                <MenuItem value={"Japanese"}>Japanese</MenuItem>
                <MenuItem value={"Fast food"}>Fast food</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Price Range</InputLabel>
              <Select
                onChange={this.handleSelect}
                value={this.state.price}
                input={
                  <OutlinedInput
                    labelWidth={this.state.labelWidth}
                    name="price"
                    id="price"
                  />
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"cheap"}>cheap</MenuItem>
                <MenuItem value={"moderate"}>moderate</MenuItem>
                <MenuItem value={"high"}>high</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Customer Rating</InputLabel>
              <Select
                onChange={this.handleSelect}
                value={this.state.rating}
                input={
                  <OutlinedInput
                    labelWidth={this.state.labelWidth}
                    name="rating"
                    id="rating"
                  />
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"1 out of 5"}>1 out of 5</MenuItem>
                <MenuItem value={"2 out of 5"}>2 out of 5</MenuItem>
                <MenuItem value={"3 out of 5"}>3 out of 5</MenuItem>
                <MenuItem value={"4 out of 5"}>4 out of 5</MenuItem>
                <MenuItem value={"5 out of 5"}>5 out of 5</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel htmlFor="age-simple">Family Friendly</InputLabel>
              <Select
                onChange={this.handleSelect}
                value={this.state.familyFriendly}
                input={
                  <OutlinedInput
                    labelWidth={this.state.labelWidth}
                    name="familyFriendly"
                    id="familyFriendly"
                  />
                }
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Yes"}>Yes</MenuItem>
                <MenuItem value={"No"}>No</MenuItem>
              </Select>
            </FormControl>
            {this.renderSubmitButton()}
          </form>
          {this.renderResult()}

          <div style={{ clear: "both" }} />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(connect(NLG));
