import globals from "../../globals";
import { reducersCollater } from "../../redux/reducers";
import * as models from "../../models";
import { defaultState } from "../../models/Category";

describe("models testing", () => {
  const reducers = reducersCollater(models);
  const categoryReducer = reducers.Category;
  const ACTION_TYPE = {
    PRODUCT_UPDATE: "category.ProductUpdate",
    PRODUCT_DELETE: "category.ProductDelete",
    PRODUCT_LOAD: "category.ProductLoad",
    ADD_PRODUCTS: "category.AddProducts",
    ADD: "category.Add",
    LIST: "category.List",
    SEARCH: "category.Search",
    RECENT: "category.Recent",
    FILTER: "category.Filter"
  };
  const product1 = {
    id: "0001",
    name: "0001",
    product: "product-id",
    parameters: ["param1", "param2", "param3"],
    description: "product-0001",
    public: true,
    owner: "owner1",
    category: "FunctionsCat" // id of newCategory1
  };
  const newCategory1 = {
    description: "Functions of bots",
    category: "Functions",
    id: "FunctionsCat",
    name: "Functions",
    products: [product1]
  };
  const newCategory2 = {
    description: "Nothing out of the norm",
    category: "Default category",
    id: "NoCategory",
    name: "No Category",
    products: [
      {
        ...product1,
        id: "0002",
        name: "0002",
        description: "product-0002",
        public: false,
        owner: "owner2"
      }
    ]
  };
  const unrealCategory = {
    description: "fake",
    category: "__fake",
    id: "__",
    name: "__fake",
    products: []
  };
  const recentId0 = "0";
  const recentId1 = "1";
  const recentId2 = "2";
  const recentId3 = "3";

  beforeAll(() => {
    const state = { ...defaultState };
    const type = ACTION_TYPE.ADD;
    // Add the first category
    const action1 = { type, payload: newCategory1 };
    const newstate1 = categoryReducer(state, action1);
    // Add the second category
    const action2 = { type, payload: newCategory2 };
    categoryReducer(newstate1, action2);
    //Add third cat
    const action3 = { type: ACTION_TYPE.ADD, payload: unrealCategory };
    categoryReducer(state, action3);
  });
  test("getRealCategories", () => {
    const state = { ...defaultState };
    expect(state.getRealCategories().length).toBe(2);
  });
  test("getCategories", () => {
    const state = { ...defaultState };
    expect(state.getCategories().length).toBe(3);
  });
  test("getProducts", () => {
    const state = { ...defaultState };
    expect(state.getProducts().length).toBe(2);
  });
  test("action: category.ProductUpdate, no products in state.products initially", () => {
    const state = { ...defaultState };
    const type = ACTION_TYPE.PRODUCT_UPDATE;
    const payload = product1;
    const action = { type, payload };
    const newstate = categoryReducer(state, action);
    expect(newstate.products.length).toBe(1);
  });
  test("action: category.ProductUpdate, 1 products in state.products", () => {
    const state = { ...defaultState };
    const newstate1 = categoryReducer(state, {
      type: ACTION_TYPE.PRODUCT_UPDATE,
      payload: product1
    });
    const updatedProduct = { ...product1, id: "updated" };
    const newstate2 = categoryReducer(newstate1, {
      type: ACTION_TYPE.PRODUCT_UPDATE,
      payload: updatedProduct
    });
    expect(newstate2.products.length).toBe(1);
    expect(newstate2.products[0].id).toBe("updated");
  });
  test("action: category.ProductDelete, 1 products in state.products", () => {
    const state = { ...defaultState };
    const newstate1 = categoryReducer(state, {
      type: ACTION_TYPE.PRODUCT_DELETE,
      payload: product1
    });
    expect(newstate1.products.length).toBe(0);
    expect(newstate1.items[1].products.length).toBe(1);
  });
  test("action: category.ProductLoad", () => {
    const state = { ...defaultState };
    const newstate = categoryReducer(state, {
      type: ACTION_TYPE.PRODUCT_LOAD,
      payload: { product: { ...product1 } }
    });
    expect(newstate).toEqual(state);
  });
  test("models: Category, action: category.Add", () => {
    const state = { ...defaultState };
    expect(state.items.length).toBe(3);
  });
  test("models: Category, action: category.List", () => {
    const state = { ...defaultState };
    const type = ACTION_TYPE.LIST;
    const payload = [newCategory1, newCategory2];
    const action = { type, payload };
    const newstate = categoryReducer(state, action);
    expect(newstate.items[1].name).toBe(newCategory2.name);
    expect(newstate.hasOwnProperty("search")).toBe(true);
  });
  test("models: Category, action: category.Search", () => {
    const state = { ...defaultState };
    const type = ACTION_TYPE.SEARCH;
    const payload = newCategory2.name;
    const action = { type, payload };
    const newstate = categoryReducer(state, action);
    expect(newstate.items[2].products[0].hide).toBe(true);
    expect(newstate.search).toBe(newCategory2.name);
  });
  test("models: Category, action: category.Recent", () => {
    const state = { ...defaultState };
    const type = ACTION_TYPE.RECENT;
    let recentIdStr;
    let payload;
    let action;

    // 1. Cleared localStorage and assert nothing stored
    localStorage.removeItem("recent");
    recentIdStr = localStorage.getItem("recent");
    expect(recentIdStr).toBe(null);

    // 2. Store first id and Assert 1 in localStorage
    payload = { id: recentId0 };
    action = { type, payload };
    categoryReducer(state, action);
    expect(localStorage.getItem("recent")).toBe(recentId0);

    // 3. Store first id again Assert 1 in localStorage (no repetition)
    payload = { id: recentId0 };
    action = { type, payload };
    categoryReducer(state, action);
    expect(localStorage.getItem("recent")).toBe(recentId0);

    // 4. Store second id and Assert 2 in local storage
    payload = { id: recentId1 };
    action = { type, payload };
    categoryReducer(state, action);
    expect(localStorage.getItem("recent")).toBe(`${recentId1},${recentId0}`);

    // 5. Store third id and Assert 3 in local storage
    payload = { id: recentId2 };
    action = { type, payload };
    categoryReducer(state, action);
    expect(localStorage.getItem("recent")).toBe(
      `${recentId2},${recentId1},${recentId0}`
    );

    // 6. Store 4th id and Assert only 3 in local storage
    payload = { id: recentId3 };
    action = { type, payload };
    categoryReducer(state, action);
    expect(localStorage.getItem("recent")).toBe(
      `${recentId3},${recentId2},${recentId1}`
    );
  });
  test("action: category.Filter - filter by category1 only", async () => {
    const state = { ...defaultState };
    const payload = { category: newCategory1.id };
    const action = { type: ACTION_TYPE.FILTER, payload };
    const newstate = categoryReducer(state, action);
    await Promise.all(
      newstate.items[1].products.map(p => expect(p.hidden).toBe(false))
    );
    await Promise.all(
      newstate.items[2].products.map(p => expect(p.hidden).toBe(true))
    );
  });
  test("action: category.Filter, - cat1 products query search", async () => {
    const state = { ...defaultState };
    const payload = { q: product1.name };
    const action = { type: ACTION_TYPE.FILTER, payload };
    const newstate = categoryReducer(state, action);
    await Promise.all(
      newstate.items[1].products.map(p => expect(p.hidden).toBe(false))
    );
    await Promise.all(
      newstate.items[2].products.map(p => expect(p.hidden).toBe(true))
    );
  });
  test("action: category.Filter, - cat1 products query search and cat1 filter", async () => {
    const state = { ...defaultState };
    const payload = { q: product1.name, category: newCategory1.id };
    const action = { type: ACTION_TYPE.FILTER, payload };
    const newstate = categoryReducer(state, action);
    await Promise.all(
      newstate.items[1].products.map(p => expect(p.hidden).toBe(false))
    );
    await Promise.all(
      newstate.items[2].products.map(p => expect(p.hidden).toBe(true))
    );
  });
  test("action: category.Filter, - cat1 products query search and cat2 filter", async () => {
    const state = { ...defaultState };
    const payload = { q: product1.name, category: newCategory2.id };
    const action = { type: ACTION_TYPE.FILTER, payload };
    const newstate = categoryReducer(state, action);
    await Promise.all(
      newstate.items[1].products.map(p => expect(p.hidden).toBe(true))
    );
    await Promise.all(
      newstate.items[2].products.map(p => expect(p.hidden).toBe(true))
    );
  });
  test("action: category.Filter, - cat1 products q, cat1 filter, showPublic true", async () => {
    const state = { ...defaultState };
    const payload = {
      q: product1.name,
      category: newCategory1.id,
      showPublic: true
    };
    const action = { type: ACTION_TYPE.FILTER, payload };
    const newstate = categoryReducer(state, action);
    await Promise.all(
      newstate.items[1].products.map(p => expect(p.hidden).toBe(false))
    );
    await Promise.all(
      newstate.items[2].products.map(p => expect(p.hidden).toBe(true))
    );
  });
  test("action: category.Filter, - cat1 products q, cat2 filter, showPublic true", async () => {
    const state = { ...defaultState };
    const payload = {
      q: product1.name,
      category: newCategory2.id,
      showPublic: true
    };
    const action = { type: ACTION_TYPE.FILTER, payload };
    const newstate = categoryReducer(state, action);
    await Promise.all(
      newstate.items[1].products.map(p => expect(p.hidden).toBe(true))
    );
    await Promise.all(
      newstate.items[2].products.map(p => expect(p.hidden).toBe(true))
    );
  });
  test("action: category.Filter, - cat2 products q, cat2 filter, showPublic false", async () => {
    const state = { ...defaultState };
    const payload = {
      q: newCategory2.products[0].name,
      category: newCategory2.id,
      showPublic: false
    };
    const action = { type: ACTION_TYPE.FILTER, payload };
    const newstate = categoryReducer(state, action);
    await Promise.all(
      newstate.items[1].products.map(p => expect(p.hidden).toBe(true))
    );
    await Promise.all(
      newstate.items[2].products.map(p => expect(p.hidden).toBe(false))
    );
  });
  test("action: category.Filter - owner1", async () => {
    const state = { ...defaultState };
    const payload = {
      showMyOwn: true,
      owner: "owner1"
    };
    const action = { type: ACTION_TYPE.FILTER, payload };
    const newstate = categoryReducer(state, action);
    await Promise.all(
      newstate.items[1].products.map(p => expect(p.hidden).toBe(false))
    );
    await Promise.all(
      newstate.items[2].products.map(p => expect(p.hidden).toBe(true))
    );
  });
  test("action: category.Filter - no query", async () => {
    const state = { ...defaultState };
    const payload = {};
    const action = { type: ACTION_TYPE.FILTER, payload };
    const newstate = categoryReducer(state, action);
    await Promise.all(
      newstate.items[1].products.map(p => expect(p.hidden).toBe(false))
    );
    await Promise.all(
      newstate.items[2].products.map(p => expect(p.hidden).toBe(false))
    );
  });
  test("action: category.AddProducts", () => {
    const state = { ...defaultState };
    const type = ACTION_TYPE.ADD_PRODUCTS;
    const payload = [{ ...product1, id: "new product" }];
    const action = { type, payload };
    const newstate = categoryReducer(state, action);
    expect(newstate.items[1].products[0].id).toBe(payload[0].id);
  });
});
