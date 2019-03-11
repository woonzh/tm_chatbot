export default function(name, defaultState, { reducer, actions, apis }) {
  Object.assign(defaultState, { loading: false, show: false });
  return {
    ...defaultState,
    reducer: (state = defaultState, action) => {
      if (action.type === `${name}.Set`) {
        return { ...state, ...action.payload };
      }
      if (action.type === `${name}.Loading`) {
        return { ...state, loading: true };
      }
      if (action.type === `${name}.Loaded`) {
        return { ...state, loading: false };
      }
      if (action.type === `${name}.Show`) {
        return { ...state, show: true };
      }
      if (action.type === `${name}.Hide`) {
        return { ...state, show: false };
      }
      if (action.type === `${name}.Toggle`) {
        return { ...state, show: !state.show };
      }
      return reducer(state, action);
    },
    actions: [].merge(
      actions,
      "Set",
      "Loading",
      "Loaded",
      "Show",
      "Hide",
      "Toggle"
    ),
    apis
  };
}
