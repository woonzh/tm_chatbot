import globals from "../../globals";
import { reducersCollater } from "../../redux/reducers";
import * as models from "../../models";
import { defaultState } from "../../models/User";

describe("User model testing", () => {
  const reducers = reducersCollater(models);
  const userReducer = reducers.User;
  const ACTION_TYPE = {
    CRITERIA: "user.Criteria",
    ADD: "user.Add",
    PROFILE: "user.Profile",
    LIST: "user.List",
    REMOVE: "user.Remove",
    DETAIL: "user.Detail",
    GROUPS: "user.Groups",
    GROUP: "user.Group",
    ACTIONS: "user.Actions",
    ACTION: "user.Action"
  };
  const user1 = {
    username: "username1"
  };
  const profile1 = {
    user: "profile Value",
    actionnames: ["action1", "action2"]
  };

  beforeAll(() => {
    const state = { ...defaultState };
    const type = ACTION_TYPE.ADD;
    // Add the first user
    const action1 = { type, payload: user1 };
    userReducer(state, action1);
  });
  test("action: user.Add should return one user", () => {
    const state = { ...defaultState };
    expect(state.items.length).toBe(1);
  });
  test("action: user.Criteria", () => {
    const state = { ...defaultState };
    const payload = {
      search: "search criteria",
      order: "desc1",
      orderBy: "desc2"
    };
    const action = {
      type: ACTION_TYPE.CRITERIA,
      payload
    };
    const newstate = userReducer(state, action);
    expect(newstate.criteria.search).toBe(payload.search);
    expect(newstate.criteria.order).toBe(payload.order);
    expect(newstate.criteria.orderBy).toBe(payload.orderBy);
  });
  test("action: user.Profile", () => {
    const state = { ...defaultState };
    const payload = {
      preference: "user preference",
      settings: "user settings"
    };
    const action = {
      type: ACTION_TYPE.PROFILE,
      payload
    };
    const newstate = userReducer(state, action);
    expect(newstate.profile.preference).toBe(payload.preference);
    expect(newstate.profile.settings).toBe(payload.settings);
  });
  test("action: user.List", () => {
    const state = { ...defaultState };
    const action = { type: ACTION_TYPE.LIST, payload: ["1", "2"] };
    const newstate = userReducer(state, action);
    expect(newstate.items.length).toBe(2);
  });
  test("action: user.Remove", () => {
    const state = { ...defaultState };
    const action = { type: ACTION_TYPE.REMOVE, payload: user1 };
    const newstate = userReducer(state, action);
    expect(newstate.items.length).toBe(0);
  });
  test("action: user.Detail", () => {
    const state = { ...defaultState };
    const payload = { key1: "value1" };
    const action = { type: ACTION_TYPE.DETAIL, payload };
    const newstate = userReducer(state, action);
    expect(newstate.detail).toEqual(payload);
  });
  test("action: user.Groups", () => {
    const state = { ...defaultState };
    const payload = { key1: "value1" };
    const action = { type: ACTION_TYPE.GROUPS, payload };
    const newstate = userReducer(state, action);
    expect(newstate.groups).toEqual(payload);
  });
  test("action: user.Group", () => {
    const state = { ...defaultState };
    const payload = { key1: "value1" };
    const action = { type: ACTION_TYPE.GROUP, payload };
    const newstate = userReducer(state, action);
    expect(newstate.group).toEqual(payload);
  });
  test("action: user.Actions", () => {
    const state = { ...defaultState };
    const payload = { key1: "value1" };
    const action = { type: ACTION_TYPE.ACTIONS, payload };
    const newstate = userReducer(state, action);
    expect(newstate.actions).toEqual(payload);
  });
  test("action: user.Action", () => {
    const state = { ...defaultState };
    const payload = { key1: "value1" };
    const action = { type: ACTION_TYPE.ACTION, payload };
    const newstate = userReducer(state, action);
    expect(newstate.action).toEqual(payload);
  });
});
