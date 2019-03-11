import globals from "../../globals";
import { reducersCollater } from "../../redux/reducers";
import * as models from "../../models";
import { normalizeNodes } from "../../models/Product";

const reducers = reducersCollater(models);
const productReducer = reducers.Product;

let state;

describe("Redux reducers", () => {
  beforeEach(() => {
    const detail = {
      id: "product-id",
      product: "product-id",
      parameters: ["param1", "param2", "param3"],
      description: "default description",
      name: "default name"
    };
    state = {
      items: [
        detail,
        { ...detail, id: "0001", name: "0001", description: "something else" }
      ],
      detail
    };
  });

  test("reducerCollater returns an object with models' names", () => {
    Object.keys(models).forEach(o => {
      if (o !== "normalizeNodes") expect(reducers.hasOwnProperty(o)).toBe(true);
    });
  });

  test("Test Product reducer, action: product.List", () => {
    const defaultState = models.Product.defaultState;
    const state = { ...defaultState };

    const type = "product.List";
    const payload = [{ id: "dummy-product-id", name: "dummy product name" }];
    const action = { type, payload };

    const newstate = productReducer(state, action);

    expect(newstate.items).toBe(payload);
  });

  test("Test Product reducer, action: product.RemoveParameter, removes a parameter", () => {
    const type = "product.RemoveParameter";
    const payload = "param2";
    const action = { type, payload };
    expect(state.detail.parameters.includes(payload)).toEqual(true);
    const newstate = productReducer(state, action);
    expect(newstate.detail.parameters.includes(payload)).toEqual(false);
  });

  test("Test Product reducer, action: product.ChangeParameter", () => {
    const type = "product.ChangeParameter";
    const indexToChange = 0;
    const param = state.items[indexToChange];
    const fieldName = "field";
    const fieldValue = "field default value";
    const payload = {
      item: param,
      update: { [fieldName]: fieldValue }
    };
    const action = { type, payload };
    const newstate = productReducer(state, action);
    const newParam = newstate.items[indexToChange];

    expect(newParam.hasOwnProperty(fieldName)).toBe(true);
    expect(newParam[fieldName]).toBe(fieldValue);
  });

  test("Test Product reducer, action: product.AddParameter", () => {
    const type = "product.AddParameter";
    const action = { type };

    const newstate = productReducer(state, action);
    expect(newstate.detail.parameters.length).toBe(4);
  });

  test("Test Product reducer, normalizeNodes", () => {
    const inputNodes = [{ id: "1" }, { id: "2" }, { id: "3" }];
    const normalizedNodes = normalizeNodes(inputNodes);
    const defaultSettings = {
      cat: "__NoCategory",
      category: "default",
      fill: "transparent"
    };
    const result = inputNodes.map(node => {
      return { ...node, ...defaultSettings };
    });
    expect(normalizedNodes).toEqual(result);
  });
  test("Test Product reducer, action: product.Update", () => {
    const type = "product.Update";
    const payload = {
      nodeDataArray: [{ id: "1" }, { id: "2" }, { id: "3" }]
    };
    const action = { type, payload };

    const newstate = productReducer(state, action);
    const normalizedNodes = normalizeNodes(payload.nodeDataArray);
    const result = {
      ...state,
      detail: { ...state.detail, nodeDataArray: normalizedNodes }
    };
    expect(newstate).toEqual(result);
  });

  test("Test Product reducer, action: product.Search", () => {
    const type = "product.Search";
    const payload = "des";
    const action = { type, payload };

    const newstate = productReducer(state, action);

    const searchProducts = state.items.filter(
      item => item.name.indexOf(payload) || item.description.indexOf(payload)
    );
    searchProducts.forEach(product => (product.hide = false));

    const hiddenProducts = state.items.filter(
      item => !(item.name.indexOf(payload) || item.description.indexOf(payload))
    );
    hiddenProducts.forEach(product => (product.hide = true));

    const foundProducts = newstate.items.filter(
      newItem =>
        newItem.name.indexOf(payload) || newItems.description.indexOf(payload)
    );
    const unfoundProducts = newstate.items.filter(
      newItem =>
        !(
          newItem.name.indexOf(payload) || newItems.description.indexOf(payload)
        )
    );
    expect(foundProducts).toEqual(searchProducts);
    expect(unfoundProducts).toEqual(hiddenProducts);
  });

  test("Test Product reducer, action: product.Delete", () => {
    const type = "product.Delete";
    const payload = { product: "product-id" };
    const action = { type, payload };
    const newstate = productReducer(state, action);
    const result = {
      ...state,
      detail: null
    };
    expect(newstate).toEqual(result);
  });

  test("Test Product reducer, action: product.Detail, product found in state.items", () => {
    const type = "product.Detail";
    const payload = {
      id: "product-id",
      nodeDataArray: [{ id: "1" }, { id: "2" }, { id: "3" }]
    };
    const action = { type, payload };

    const newstate = productReducer(state, action);
    const normalizedNodes = normalizeNodes(payload.nodeDataArray);
    const updatedDetail = { ...state.detail, nodeDataArray: normalizedNodes };
    const updatedItems = state.items.map(item => {
      if (item.id === payload.id) return updatedDetail;
      else return item;
    });
    const result = { items: updatedItems, detail: updatedDetail };
    expect(newstate).toEqual(result);
  });
});
