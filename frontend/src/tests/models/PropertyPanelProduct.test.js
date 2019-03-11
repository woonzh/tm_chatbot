import globals from "../../globals";
import { reducersCollater } from "../../redux/reducers";
import * as models from "../../models";
import { defaultState } from "../../models/PropertyPanelProduct";

describe("PropertyPanelProduct", () => {
  const reducers = reducersCollater(models);
  const pppReducer = reducers.PropertyPanelProduct;
  const ACTION_TYPE = {
    TOGGLE: "propertyPanelProduct.Toggle",
    SHOW: "propertyPanelProduct.Show",
    HIDE: "propertyPanelProduct.Hide"
  };

  test(`action: ${ACTION_TYPE.TOGGLE}`, () => {
    const state = { ...defaultState };
    const payload = "node1";
    const action = {
      type: ACTION_TYPE.TOGGLE,
      payload
    };
    const newstate = pppReducer(state, action);
    expect(newstate.show).toBe(!defaultState.show);
  });
  test(`action: ${ACTION_TYPE.SHOW}`, () => {
    const state = { ...defaultState };
    const action = {
      type: ACTION_TYPE.SHOW
    };
    const newstate = pppReducer(state, action);
    expect(newstate.show).toBe(true);
  });
  test(`action: ${ACTION_TYPE.HIDE}`, () => {
    const state = { ...defaultState };
    const action = {
      type: ACTION_TYPE.HIDE
    };
    const newstate = pppReducer(state, action);
    expect(newstate.show).toBe(false);
  });
});
