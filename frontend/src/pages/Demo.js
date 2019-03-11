import React, { Component } from "react";
import MessageList from "../components/message/List";
import ReactEcharts from "echarts-for-react";
import TagCloud from "react-tag-cloud";
//import { Page } from "../components";
import { Page, Space, Logo } from "../components";
import { Toolbar, AppBar as SimpleAppBar, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "../redux";
const styles = {
  title: {
    textAlign: "left",
    fontSize: "16px",
    color: "#FBD304",
    fontWeight: "bold"
  },
  subtitle: {
    textAlign: "left",
    fontSize: "14px",
    color: "#FBD304",
    fontWeight: "bold"
  },
  dimsubtitle: {
    textAlign: "left",
    fontSize: "14px",
    color: "#EFEFAF",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export class Demo extends Page {
  state = {
    alldata: {},
    data: { prices: [], tweeks: [], words: [] },
    sentimentScores: [],
    showWordCloud: false,
    showSentiment: true
  };
  timer = 0;
  constructor(props) {
    super(props);
    this.loadData();
  }
  loadData = () => {
    return fetch(this.props.apis.demo.load.url, {
      method: "GET"
    })
      .then(response => response.json())
      .then(responseData => {
        let { data, sentimentScores } = this.state;
        let allowPrices = responseData.prices.filter(price => {
          const d1 = new Date(price.Timestamp);
          const d2 = new Date("2019-01-03T10:05:00.000Z");
          if (d1 > d2) {
            return true;
          }
        });

        responseData.prices = allowPrices;
        let oldPrices = responseData.prices.splice(0, 50);
        data.prices = oldPrices;
        sentimentScores = oldPrices.map(price => {
          return {
            date: price.Timestamp,
            score: 0
          };
        });
        this.setState({ alldata: responseData, data, sentimentScores }, () => {
          setInterval(this.initTimer, 2000);
        });
      });
  };

  initTimer = () => {
    let { alldata, data, sentimentScores } = this.state;
    const newPrice = alldata.prices.shift();
    let score = 0;
    if (newPrice) {
      const lastPrice = data.prices[data.prices.length - 1];
      if (data.prices.length > 50) {
        data.prices.shift();
      }
      //console.log("new price", newPrice);
      data.prices.push(newPrice);
      const newTweeks = alldata.tweeks.filter(tweek => {
        const tweekD = new Date(tweek.Timestamp);
        const atweekD = new Date(
          new Date(tweekD.setDate(tweekD.getDate() - 2))
        );
        const newPriceD = new Date(newPrice.Timestamp);
        const latestPriceD = new Date(lastPrice.Timestamp);
        if (atweekD < newPriceD && atweekD > latestPriceD) {
          return true;
        }
      });

      if (newTweeks.length > 0) {
        newTweeks.forEach(newTweek => {
          score += newTweek.Compound_Score;
          data.tweeks.unshift({
            id: newTweek.id,
            user: newTweek.User,
            timestamp: newTweek.Timestamp,
            followers: newTweek.Number_of_Followers,
            text: newTweek.Idea_Text,
            sentiment: newTweek.Sentiment,
            score: newTweek.Compound_Score
          });
        });
        score = score / newTweeks.length;
      }

      sentimentScores.shift();
      sentimentScores.push({
        date: newPrice.Timestamp,
        score
      });
      let newWords = [];
      alldata.words.forEach(word => {
        var dateOffset = 48 * 60 * 60 * 1000; //48 hours
        const wordD = new Date(word.Begin_Time);
        //const atwordD = new Date(new Date(wordD.setDate(wordD.getDate() - 2)));
        const atwordD = new Date(wordD.setTime(wordD.getTime() - dateOffset));
        //console.log("word time", atwordD);
        const newPriceD = new Date(newPrice.Timestamp);
        const latestPriceD = new Date(lastPrice.Timestamp);
        //console.log("compare atword < new price d", atwordD < newPriceD);
        //console.log("compare atword > last price d", atwordD > latestPriceD);
        //console.log("atword", atwordD);
        //console.log("lastPriceD", latestPriceD);
        if (atwordD < newPriceD) {
          newWords = [word];
        }
      });

      if (newWords.length > 0) {
        data.words = [];
        newWords.forEach(wordArr => {
          for (let word in wordArr.Unigrams) {
            data.words.push({
              unigram: word,
              freq: wordArr["Unigrams"][word]
            });
          }
        });
      }
      this.setState({
        alldata,
        data,
        sentimentScores
      });
    }

    this.timer++;
  };

  renderWordcloud = (words = []) => {
    const { classes } = this.props;
    const clouds = words
      .sort((a, b) => a.freq.freq > b.freq.freq)
      .filter(word => isNaN(word.unigram))
      .filter(word => word.unigram !== "amazon")
      .slice(0, 40)
      .reduce((accu, word) => {
        console.log(word);
        let tagStyle = { opacity: 0.5 };
        if (word.freq.freq > 15) {
          tagStyle = { fontSize: 48, fontWeight: "bold" };
        } else if (word.freq.freq > 10) {
          tagStyle = {
            fontSize: 38,
            fontWeight: "bold",
            opacity: 0.9
          };
        } else if (word.freq.freq > 5) {
          tagStyle = { fontSize: 28, fontWeight: "bold", opacity: 0.8 };
        } else if (word.freq.freq > 1) {
          tagStyle = { fontSize: 22, opacity: 0.7 };
        }
        if (word.freq.AveSentiment >= -1 && word.freq.AveSentiment <= -0.33) {
          tagStyle["color"] = "#ff0204";
        } else if (
          word.freq.AveSentiment >= -0.33 &&
          word.freq.AveSentiment <= 0.33
        ) {
          tagStyle["color"] = "#ffe808";
        } else if (
          word.freq.AveSentiment >= 0.33 &&
          word.freq.AveSentiment <= 1
        ) {
          tagStyle["color"] = "#2ece6a";
        }
        accu.push(<div style={tagStyle}>{word.unigram}</div>);
        return accu;
      }, []);
    return (
      <div>
        <TagCloud
          style={{
            fontFamily: "sans-serif",
            fontSize: 8,
            padding: 2,
            width: "100%",
            height: "250px"
          }}
        >
          {clouds}
        </TagCloud>
      </div>
    );
  };

  renderPrice = (prices = []) => {
    const { classes } = this.props;
    const seriesData = prices.reduce(
      (accu, price) => {
        accu.priceData.push([
          price.Open_Price,
          price.Close_Price,
          price.Low_Price,
          price.High_Price
        ]);
        accu.dateData.push(price.Timestamp);
        return accu;
      },
      { priceData: [], dateData: [] }
    );

    const lineChartOption = {
      xAxis: {
        type: "category",
        data: seriesData.dateData,
        axisLine: { lineStyle: { color: "#8392A5" } },
        axisLabel: {
          formatter: (value, index) => {
            const d = new Date(value);
            return d.toLocaleTimeString([], {
              timeZone: "UTC",
              hour: "2-digit",
              minute: "2-digit"
            });
          }
        }
      },
      yAxis: {
        scale: true,
        axisLine: { lineStyle: { color: "#8392A5" } },
        splitLine: { show: false }
      },
      grid: {
        bottom: 80
      },
      animation: false,
      series: [
        {
          type: "candlestick",
          data: seriesData.priceData,
          itemStyle: {
            normal: {
              color: "#ec0000",
              color0: "#00da3c"
            }
          }
        }
      ]
    };
    return (
      <div>
        <div className={classes.title}>Stock Price (NASDAQ: AMZN)</div>
        <ReactEcharts
          option={lineChartOption}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    );
  };

  renderSentimentOverTime = (prices = []) => {
    const { classes } = this.props;
    const { sentimentScores } = this.state;

    const lineChartOption = {
      xAxis: {
        type: "category",
        axisLine: { lineStyle: { color: "#8392A5" } },
        axisLabel: {
          formatter: (value, index) => {
            const d = new Date(value);
            //console.log([d.getMonth() + 1, d.getDate()].join("-"));
            return d.toLocaleTimeString([], {
              timeZone: "UTC",
              hour: "2-digit",
              minute: "2-digit"
            });
          }
        },
        data: sentimentScores.map(score => score.date)
      },
      yAxis: {
        scale: true,
        axisLine: { lineStyle: { color: "#8392A5" } },
        splitLine: { show: false }
      },
      animation: false,
      grid: {
        bottom: 80
      },

      series: [
        {
          type: "line",
          data: sentimentScores.map(score => score.score),
          itemStyle: {
            normal: {
              color: "#ec0000",
              color0: "#00da3c"
            }
          },
          markPoint: {
            type: "circle",
            symbolSize: 10,
            formatter: params => {
              return Math.round(params.value * 10) / 10;
            },
            fontSize: 8,
            data: sentimentScores.reduce((accu, s) => {
              if (s.score !== 0) {
                accu.push({
                  value: s.score,
                  yAxis: s.score + 0.1,
                  xAxis: s.date
                });
              }
              return accu;
            }, [])
          }
        }
      ]
    };
    return (
      <div>
        <div className={classes.title}>Sentiment Score</div>
        <ReactEcharts
          option={lineChartOption}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    );
  };
  renderSentiment = lists => {
    const { classes } = this.props;
    let negaive_score = 0;
    let positive_score = 0;
    let neutral_score = 0;
    lists.forEach(item => {
      if (item.sentiment === "Negative") {
        negaive_score++;
      } else if (item.sentiment === "Positive") {
        positive_score++;
      } else {
        neutral_score++;
      }
    });
    let dataSeries = [];
    let colorArr = [];
    if (negaive_score > 0) {
      dataSeries.push({ value: negaive_score, name: "Negative" });
      colorArr.push("#FB0204");
    }
    if (positive_score > 0) {
      dataSeries.push({ value: positive_score, name: "Positive" });
      colorArr.push("#2ABC61");
    }
    if (neutral_score > 0) {
      dataSeries.push({ value: neutral_score, name: "Neutral" });
      colorArr.push("#F2D308");
    }
    const pieChartOption = {
      color: colorArr,
      series: [
        {
          type: "pie",
          radius: ["20%", "35%"],
          label: {
            normal: {
              formatter: "{b|{b}: }{c}\n{per|{d}%}",
              backgroundColor: "#000",
              borderColor: "#aaa",
              borderWidth: 1,
              borderRadius: 4,
              padding: 3,

              rich: {
                b: {
                  padding: [10, 20],
                  fontSize: 10,
                  lineHeight: 20,
                  color: "#fff"
                },
                b: {
                  fontSize: 14,
                  lineHeight: 20
                },
                per: {
                  color: "#eee",
                  backgroundColor: "#334455",
                  padding: [2, 4],
                  align: "center",
                  borderRadius: 2
                }
              }
            }
          },
          data: dataSeries
        }
      ]
    };
    return (
      <div>
        <ReactEcharts
          option={pieChartOption}
          notMerge={true}
          lazyUpdate={true}
        />
      </div>
    );
  };

  handleTabToggle = tablabel => {
    if (tablabel === "sentiment") {
      this.setState({
        showWordCloud: false,
        showSentiment: true
      });
    } else if (tablabel === "wordcloud") {
      this.setState({
        showWordCloud: true,
        showSentiment: false
      });
    }
  };
  tabBox = lists => {
    const { classes } = this.props;
    const { data } = this.state;
    let content = [];
    if (this.state.showWordCloud) {
      content = this.renderWordcloud(data.words);
    } else if (this.state.showSentiment) {
      content = this.renderSentiment(lists);
    }
    let sentimentClassName = this.state.showSentiment
      ? classes.subtitle
      : classes.dimsubtitle;
    let wordcloudClassName = this.state.showWordCloud
      ? classes.subtitle
      : classes.dimsubtitle;
    return (
      <div>
        <div style={{ textAlign: "left" }}>
          <span
            className={sentimentClassName}
            onClick={() => this.handleTabToggle("sentiment")}
          >
            SENTIMENT ANALYSIS
          </span>
          &nbsp;&nbsp;
          <span
            className={wordcloudClassName}
            onClick={() => this.handleTabToggle("wordcloud")}
          >
            WORD FREQUENCY
          </span>
        </div>
        <div>{content}</div>
      </div>
    );
  };
  renderComponent() {
    const { data } = this.state;
    let lists = data.tweeks;

    return (
      <div style={{ width: "100%" }}>
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
        <div className="page page-demo">
          <div className="charts">
            {this.renderPrice(data.prices)}
            {this.renderSentimentOverTime(data.prices)}
          </div>
          <div className="sidebar">
            {this.tabBox(lists)}
            <MessageList title="TWITTER FEED (NASDAQ: AMZN)" lists={lists} />
          </div>
        </div>
      </div>
    );
  }
}
export default withStyles(styles)(connect(Demo));
