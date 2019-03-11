import React, { Component } from "react";

import { connect } from "../redux";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextArea from "../components/TextareaHighlight";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    width: "90%"
  },
  textField: {
    height: "100%"
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  paper: {
    margin: "5px 0",
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  paperSelected: {
    margin: "5px 0",
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    borderLeft: "2px #fff solid"
  },
  selectedFile: {
    fontWeight: "bold !important"
  },
  unselectedFile: {
    cursor: "pointer"
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  input: {
    display: "none"
  },
  chip: {
    margin: "0 5px 5px 0"
  }
});

class TextAnnotator extends Component {
  state = {
    articles: [],
    selectedArticle: -1,
    selectedQuestion: ""
  };

  processFile = f => { // input
    const data = new FormData();
    data.append("file", f);
    return fetch(this.props.apis.textAnnotation.upload.url, {
      headers: {
        Accept: "application/json"
      },
      method: "POST",
      body: data
    }).then(response => response.json());
  };

  exportFile = () => { // output
    const { articles } = this.state;
    return fetch(this.props.apis.textAnnotation.export.url, {
      headers: {
        Accept: "application/json"
      },
      method: "POST",
      body: JSON.stringify({ "articles": articles })
    })
      .then(response => response.blob())
      .then(blob => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "result.json";
        a.click();
      });
  };

  handleselectedFile = event => {
    let jobs = Promise.resolve();
    let { articles, selectedArticle, selectedQuestion } = this.state;
    for (var k in event.target.files) {
      if (event.target.files.hasOwnProperty(k)) {
        const f = event.target.files[k];

        jobs = jobs.then(() => {
          return this.processFile(f).then(results => {
            // add indexing to the results
            for (var i = 0; i < results.length; ++i) {
              results[i]["index"] = i;
            }

            articles = articles.concat(results)

            if (!selectedArticle) {
              selectedArticle = Math.trunc(results[0]["index"]);
              selectedQuestion = results[0]["qas"][0]["question"];
            }
            
            console.log(articles);
            console.log(selectedArticle);
            console.log(selectedQuestion);
          });
        });
      }
    }
    jobs
      .then(() => {
        this.setState(
          {
            articles,
            selectedArticle,
            selectedQuestion
          },
          () => {
            this.setQuestionAnnotated(selectedQuestion);
          }
        );
      })
      .catch(e => {
        console.log(e);
      });
  };

  handleFileClick = index => {
    let { articles, selectedArticle, selectedQuestion } = this.state;
    console.log("handleFileClick selectedArticle before: " + selectedArticle)
    articles = articles.map(article => {
      if (article.index === index) {
        selectedArticle = index;
        selectedQuestion = articles[index]["qas"][0]["question"];
      }
    });
    this.setQuestionAnnotated(selectedQuestion);
    this.setState({
      selectedArticle: selectedArticle,
      selectedQuestion: selectedQuestion
    });
    console.log("handleFileClick selectedArticle after: " + selectedArticle)
  };

  handleTextAreaSelect = textarea => {
    let { articles, selectedArticle, selectedQuestion } = this.state;
    const textStart = textarea.selectionStart;
    const textEnd = textarea.selectionEnd;
    const content = textarea.value;
    const selectedContent = content.slice(textStart, textEnd);
    if (textStart < textEnd) {
      if (selectedQuestion) {
        articles = articles.map(article => {
          if (article.index === selectedArticle) {
            let qas = article.qas.map(qa => {
              if (qa.question === selectedQuestion) {
                let valid = true;
                qa.answers.forEach(ans => {
                  if (
                    ans.answer_start < textStart &&
                    textStart < ans.answer_end
                  )
                    valid = false;
                  if (ans.answer_start < textEnd && textEnd < ans.answer_end)
                    valid = false;
                  if (
                    textStart < ans.answer_start &&
                    ans.answer_start < textEnd
                  )
                    valid = false;
                  if (textStart < ans.answer_end && ans.answer_end < textEnd)
                    valid = false;
                });
                if (valid) {
                  qa.answers.push({
                    text: selectedContent,
                    answer_start: textStart,
                    answer_end: textEnd
                  });
                }
              }
              return qa;
            });
            article.qas = qas;
          }
          return article;
        });
        this.setState({
          articles
        });
      }
    }
  };

  setQuestionAnnotated = question => {
    let { articles, selectedArticle } = this.state;
    console.log("set q", question);
    articles = articles.map(article => {
      if (article.index === selectedArticle) {
        let qas = article.qas.map(qa => {
          if (qa.question === question) {
            qa.annotated = true;
            // Byan: include timestamp in output
            qa.timestamp = Date.now();
          }
          return qa;
        });
        article.qas = qas;
      }
      return article;
    });
    this.setState({ articles });
  };

  handleQuestionClick = question => {
    this.setQuestionAnnotated(question);
    this.setState({
      selectedQuestion: question
    });
  };

  handleQuestionDelete = (question, answer) => {
    let { articles, selectedArticle } = this.state;
    if (question) {
      articles = articles.map(article => {
        if (article.index === selectedArticle) {
          let qas = article.qas.map(qa => {
            if (qa.question === question) {
              qa.answers = qa.answers.filter(
                ans =>
                  !(
                    ans["text"] === answer["text"] &&
                    ans["answer_start"] === answer["answer_start"] &&
                    ans["answer_end"] === answer["answer_end"]
                  )
              );
            }
            return qa;
          });
          article.qas = qas;
        }
        return article;
      });
      this.setState({
        articles
      });
    }
  };

  renderFilesList = () => { // change this to render articles instead
    const { articles, selectedArticle } = this.state;
    const { classes } = this.props;
    const articlelist = articles.reduce((accu, article) => {
      let itemClass = { primary: classes.unselectedFile };
      if (article.index === selectedArticle) {
        itemClass = {
          primary: classes.selectedFile
        };
      }
      accu.push(
        <ListItem key={article.index}>
          <ListItemText
            onClick={() => this.handleFileClick(article.index)}
            primary={article.index}
            secondary={null}
            classes={itemClass}
          />
        </ListItem>
      );
      return accu;
    }, []);
    if (articlelist.length > 0) {
      return (
        <div className="filelist">
          <Paper className={classes.root} elevation={1}>
            <div className={classes.demo}>
              <List dense={true}>{articlelist}</List>
            </div>
          </Paper>
        </div>
      );
    } else {
      return null;
    }
  };

  renderArticle = () => { // article column view 
    const { classes } = this.props;
    const { articles, selectedArticle, selectedQuestion } = this.state;
    //const isFooBar = () => /(foo)|(bar)/gi;
    if (selectedArticle > -1) {
      const article = articles.filter(
        article => article.index === selectedArticle
      )[0];
      console.log("selectedArticle object: ");
      console.log(article);
      let highlight = [];
      if (selectedQuestion) {
        const selectedQ = article.qas.filter(
          qa => qa.question === selectedQuestion
        )[0];

        for (let key in selectedQ["answers"]) {
          if (
            selectedQ["answers"][key]["answer_start"] > -1 &&
            selectedQ["answers"][key]["answer_end"]
          ) {
            highlight.push([
              selectedQ["answers"][key]["answer_start"],
              selectedQ["answers"][key]["answer_end"]
            ]);
          }
        }
      }
      return (
        <TextArea
          value={article.context}
          onSelect={this.handleTextAreaSelect}
          highlight={highlight}
        />
      );
    } else {
      return null;
    }
  };

  renderQuestions = () => { // question column view 
    const { classes } = this.props;
    const { selectedArticle, articles } = this.state;
    if (selectedArticle > -1) {
      const article = articles.filter(
        article => article.index === selectedArticle
      )[0];
      let questions = article.qas.reduce((accu, qa) => {
        let paperclass = classes.paper;
        if (qa.question === this.state.selectedQuestion) {
          paperclass = classes.paperSelected;
        }
        accu.push(
          <Paper
            elevation={2}
            className={paperclass}
            onClick={() => this.handleQuestionClick(qa.question)}
          >
            <Typography variant="p" component="p">
              {qa.question}
            </Typography>
            <Typography component="p">
              {this.renderAnswer(qa.question, qa.answers)}
            </Typography>
          </Paper>
        );
        return accu;
      }, []);
      return questions;
    } else {
      return null;
    }
  };

  renderAnswer = (question, answers) => {
    const { classes } = this.props;
    const no_answer = (
      <Chip
        label="no answer"
        className={classes.chip}
        color="secondary"
        variant="outlined"
      />
    );
    if (Array.isArray(answers) && answers.length) {
      return answers.reduce((accu, answer) => {
        if (answer["answer_start"] > -1 && answer["answer_end"]) {
          if (!Array.isArray(accu)) {
            accu = [];
          }
          accu.push(
            <Tooltip title={answer["text"]}>
              <Chip
                aria-label="test only"
                label={
                  answer["text"].length > 5
                    ? answer["text"].substring(0, 5) + "..."
                    : answer["text"]
                }
                className={classes.chip}
                color="primary"
                variant="outlined"
                onDelete={() => {
                  this.handleQuestionDelete(question, answer);
                }}
              />
            </Tooltip>
          );
        }
        return accu;
      }, no_answer);
    }
    return no_answer;
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="page page-textannotator">
        <div className="sidebar">
          <div>
            <input
              accept=".json"
              className={classes.input}
              id="flat-button-file"
              multiple
              type="file"
              onChange={this.handleselectedFile}
            />
            <label htmlFor="flat-button-file">
              <Button
                variant="outlined"
                component="span"
                className={classes.button}
              >
                Load Articles
              </Button>
            </label>
          </div>
          {this.renderFilesList()}
          <div>
            <Button
              variant="outlined"
              href="#outlined-buttons"
              className={classes.button}
              onClick={this.exportFile}
            >
              Export to Json
            </Button>
          </div>
        </div>
        <div className="content">{this.renderArticle()}</div>
        <div className="questions">{this.renderQuestions()}</div>
      </div>
    );
  }
}
export default withStyles(styles)(connect(TextAnnotator));
