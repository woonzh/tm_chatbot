import React, { Component } from "react";

import { connect } from "../redux";

import { Spinner } from "./core";

export class Helper extends Component {
  setupEvents() {
    global.jQuery("body").click(e => {
      if (!e.target.closest(".messenger")) global.jQuery(this.element).hide();
    });
  }

  renderMessage(o, i) {
    const { type, text } = o;
    return (
      <div key={i} className={`message ${type}`}>
        <span>{text}</span>
      </div>
    );
  }
  renderMessages() {
    const { loading, show, messages } = this.props.Helper;
    if (!show) return null;
    return (
      <div key="messages" className="messenger" ref={e => (this.element = e)}>
        <div className="messages" ref={e => (this.container = e)}>
          {messages.map((o, i) => this.renderMessage(o, i))}
        </div>
        <div className="input">
          <input
            type="text"
            placeholder="Please enter your question here"
            autoFocus={true}
            ref={e => this.setupEvents()}
            onKeyPress={async e => {
              if (e.key === "Enter") {
                e.preventDefault();
                const text = e.target.value;
                if (text.replace(/\s/g, "")) {
                  e.target.value = "";
                  await this.props.helperAsk(text);
                  await this.props.api({
                    ...this.props.apis.helper.qa,
                    headers: {
                      [global.constants.tokenName]: false,
                      "Content-Type":
                        "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: JSON.stringify({
                      article: this.props.Application.helper,
                      question: text
                    })
                  });
                  global
                    .jQuery(this.container)
                    .scrollTop(this.container.scrollHeight);
                }
              }
            }}
          />
          {!loading ? null : <Spinner size={16} noOverlay={true} />}
        </div>
      </div>
    );
  }
  render() {
    return [
      this.renderMessages(),
      <div
        key="icon"
        className="helper"
        onClick={e => {
          const { show } = this.props.Helper;
          if (!show) this.props.helperToggle();
          else global.jQuery(this.element).toggle();
        }}
      />
    ];
  }
}
export default connect(Helper);
