import React from "react";

import { Page, TextField, ButtonRounded, Icon } from "../components";

import { light } from "../theme";
import { connect } from "../redux";

class Telstra extends Page {
  state = { query: "", results: [] };
  async onSubmit() {
    const res = await this.props.api(
      {
        url: global.constants.qnaApiUrl,
        method: "get",
        failure: "notification.Notify"
      },
      { query: this.state.query }
    );
    if (!res.error) this.setState({ results: res });
  }
  onToggle(e) {
    const { jQuery } = global;
    const info = e.target;
    const result = info.closest(".result");
    const jResult = jQuery(result);
    const jResults = jQuery(info.closest(".results"));
    if (result.open)
      jResult.find(".content").slideToggle(function() {
        result.open = false;
        jQuery(result).toggleClass("open");
      });
    else
      jResult
        .toggleClass("open")
        .find(".content")
        .slideToggle(function(e) {
          result.open = true;
          const marginT = parseFloat(jQuery(result).css("marginTop"));
          jResults.scrollTop(result.offsetTop - 2 * marginT);
        });
  }

  renderResult(o, i) {
    const score = o.confidence;
    const name = o["intended source"];
    const content = o.ans;
    return (
      <div key={i} className="result">
        <div className="info" onClick={e => this.onToggle(e)}>
          <div
            className={`score ${
              score >= 0.75 ? "high" : score >= 0.5 ? "medium" : "low"
            }`}
          >
            <div className="circle">{Math.round(score * 100)}%</div>
          </div>
          <div className="name">{name}</div>
        </div>
        <div className="content">{content}</div>
      </div>
    );
  }
  renderResults() {
    let { query, results } = this.state;
    results = [].merge(results);
    results.sort((o1, o2) =>
      o1.confidence > o2.confidence ? -1 : o1.confidence < o2.confidence ? 1 : 0
    );
    if (query && (!results || !results.length))
      return <div className="results no-result">No anwser</div>;
    return (
      <div className="results">
        {results.map((o, i) => this.renderResult(o, i))}
      </div>
    );
  }
  renderComponent() {
    const { query } = this.state;
    return (
      <div className="page white-theme page-qna page-telstra">
        <div className="page-content ">
          <div className="searchbar">
            <label>Ask Question</label>
            <Icon icon="QuestionAnswer" />
            <TextField
              className="bigger fit nomargin"
              placeholder="Please ask a question"
              value={query}
              onChange={e => this.setState({ query: e.target.value })}
              onEnter={e => this.onSubmit()}
            />
            <ButtonRounded
              icon="Search"
              label="Submit"
              theme={light}
              onClick={e => this.onSubmit()}
            />
          </div>
          {this.renderResults()}
        </div>
      </div>
    );
  }
}

export default connect(Telstra);
