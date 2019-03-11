import React from "react";

import { Page, Spinner } from "../components";

import { connect } from "../redux";

class TelekomMalaysiaChatbotPage extends Page {
  state = {
    loading: false,
    mergeQuestions: false,
    name: "",
    session_id: "",
    messages: [
      { text: "Hi there!" },
      { text: "Please enter your name to start conversation" }
    ],
    registerUrl: global.constants.telekomMalaysiaChatbotApi
      ? `${global.constants.telekomMalaysiaChatbotApi}/register`
      : "/data/telekom-malaysia-chatbot.json",
    queryUrl: global.constants.telekomMalaysiaChatbotApi
      ? `${global.constants.telekomMalaysiaChatbotApi}/query`
      : "/data/telekom-malaysia-chatbot.json",
    followUpUrl: global.constants.telekomMalaysiaChatbotApi
      ? `${global.constants.telekomMalaysiaChatbotApi}/follow-up`
      : "/data/telekom-malaysia-chatbot.json"
  };
  get registerUrl() {
    // return "/data/telekom-malaysia-chatbot.json";
    return this.state.registerUrl;
  }
  get queryUrl() {
    // return "/data/telekom-malaysia-chatbot.json"
    return this.state.queryUrl;
  }
  get followUpUrl() {
    // return  "/data/telekom-malaysia-chatbot.json";
    return this.state.followUpUrl;
  }

  onAsk = async e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const text = e.target.value;
      if (text.replace(/\s/g, "")) {
        e.target.value = "";
        const { name, session_id, messages } = this.state;
        messages.push(text);
        this.setState({ messages, loading: true }, async () => {
          global.jQuery(this.container).scrollTop(this.container.scrollHeight);
          const res = !session_id
            ? await this.props.api(
                { url: this.registerUrl, nospinner: true },
                { name: text }
              )
            : await this.props.api(
                { url: this.queryUrl, nospinner: true },
                { question: text, session_id }
              );
          this.setState(
            {
              loading: false,
              session_id: !session_id ? res.session_id : session_id,
              name: !name ? text : name
            },
            () => {
              if (!res.error) {
                if (!name) messages.push({ text: "How can I help you?" });
                messages.push(res);
                this.setState({ messages }, () =>
                  global
                    .jQuery(this.container)
                    .scrollTop(this.container.scrollHeight)
                );
              }
            }
          );
        });
      }
    }
  };

  renderMessage(className, i, children, __html) {
    if (__html)
      return (
        <div key={i} className={className}>
          <span dangerouslySetInnerHTML={{ __html }} />
        </div>
      );
    return (
      <div key={i} className={className}>
        {children}
      </div>
    );
  }
  renderIntents(msg, i) {
    const { intents } = msg;
    if (!intents || !intents.length) return null;
    return this.renderMessage(
      "message answer intents",
      i,
      <div>
        <div className="follow-ups">
          <div className="instruction">Please pick one of the followings</div>
          <div className="options">
            {intents.map((o, j) => (
              <button
                key={j}
                onClick={async e => {
                  const res = await this.props.api(
                    { url: this.followUpUrl, nospinner: true },
                    { session_id: msg.session_id, intent_id: o.id }
                  );
                  if (!res.error) {
                    const { messages } = this.state;
                    messages.push(res);
                    this.setState({ messages });
                  }
                }}
              >
                {o.value}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  renderAnswer(msg, i) {
    const { answer } = msg;
    if (!answer) return null;
    return this.renderMessage(
      "message answer",
      i,
      <div>
        <div className="faq-answer">{answer}</div>
      </div>
    );
  }
  renderQuestion(questions, i) {
    const __html = questions.join("<br/>");
    while (questions.length) {
      questions.shift();
    }
    return this.renderMessage("message question", i, null, __html);
  }
  renderMessages(arr1, arr2, messages) {
    if (!arr1.length) return messages;
    const msg = arr1.shift();
    if (typeof msg !== "string") {
      if (msg.text)
        messages.push(
          this.renderMessage(
            "message answer",
            messages.length,
            <span>{msg.text}</span>
          )
        );
      if (msg.intents && msg.intents.length)
        messages.push(this.renderIntents(msg, messages.length));
      if (msg.answer) messages.push(this.renderAnswer(msg, messages.length));
    } else {
      arr2.push(msg);
      if (
        !this.state.mergeQuestions ||
        !arr1.length ||
        typeof arr1[0] !== "string"
      )
        messages.push(this.renderQuestion(arr2, messages.length));
    }
    return this.renderMessages(arr1, arr2, messages);
  }
  renderComponent() {
    const { loading } = this.state;
    return (
      <div className="page page-telekomalaysiachatbot">
        <div className="page-content">
          <div className="chatbot">
            <div className="chatbot-heading">
              <img src="/assets/images/tm_logo.png" alt="Telekom Malaysia" />
            </div>
            <div className="messenger chatbot-messenger">
              <div className="messages" ref={e => (this.container = e)}>
                {this.renderMessages([...this.state.messages], [], [])}
              </div>
              <div className="input">
                <input
                  ref={e => (this.input = e)}
                  type="text"
                  placeholder="Enter your question here, ENTER to send..."
                  onKeyPress={this.onAsk}
                />
                {!loading ? null : <Spinner size={16} noOverlay={true} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(TelekomMalaysiaChatbotPage);
