import builder from "./builder";

export const defaultState = {
  messages: [
    { type: "answer", text: "Hi there," },
    { type: "answer", text: "How can I help you?" }
  ]
};

export default builder("helper", defaultState, {
  reducer: (state = defaultState, action) => {
    const { type, payload } = action;
    if (type === "helper.Ask") {
      state.messages.push({ type: "question", text: payload });
      return { ...state };
    }
    if (type === "helper.Answer") {
      state.messages.push({ ...payload, type: "answer", text: payload.answer });
      return { ...state };
    }
    return state;
  },
  actions: ["Ask", "Answer"],
  apis: {
    qa: {
      method: "post",
      url: "https://faas.amaris.ai/function/qa",
      nospinner: true,
      model: "helper",
      body: {
        article: "My name is Bob. I have a dog.",
        question: "Who has a dog?"
      },
      failure: "notification.Notify",
      success: "helper.Answer"
    }
  }
});
