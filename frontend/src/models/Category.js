import builder from "./builder";
import { normalizeNode, normalizeNodes } from "./Product";

export const defaultState = {
  items: [],
  products: [],
  search: "",
  filter: {
    q: "",
    category: "",
    showPublic: false,
    showMyOwn: false,
    owner: ""
  },
  getVisibleCategories: function(filter, normalizer) {
    return this.getCategories(normalizer).filter(o => {
      const { products } = o;
      if (!products || !products.length) return false; //no products
      return filter ? filter(o) : true;
    });
  },
  getRealCategories: function(normalizer) {
    return this.getCategories(normalizer).filter(o => !o.name.match(/^_/g));
  },
  getCategories: function(normalizer) {
    return [].merge(this.items).map(o => {
      o.products = normalizeNodes(o.products);
      if (normalizer) normalizer(o.products);
      return o;
    });
  },
  getProducts: function() {
    return [].merge(...this.items.map(o => o.products));
  },
  getServices: function(products) {
    return this.getProducts().filter(o => o.atomic);
  },
  getSolutions: function(products) {
    return this.getProducts().filter(o => !o.atomic);
  }
};

export default builder("category", defaultState, {
  reducer: (state = defaultState, action) => {
    const { type, payload } = action;
    if (type === "category.ProductUpdate") {
      normalizeNode(payload);
      let found = state.products.find(o => o.product === payload.product);
      if (found)
        state.products.splice(state.products.indexOf(found), 1, payload);
      else state.products.push(payload);
      const cat = state.items.find(o => o.id === payload.category);
      if (cat && cat.id !== "__CDAP") {
        found = cat.products.find(o => o.product === payload.product);
        if (found) cat.products.splice(cat.products.indexOf(found), 1, payload);
        else cat.products.push(payload);
      }

      return { ...state };
    }

    if (type === "category.ProductDelete") {
      let found = state.products.find(o => o.product === payload.product);
      if (found) state.products.splice(state.products.indexOf(found), 1);
      const cat = state.items.find(o => o.id === payload.category);
      if (cat && cat.id !== "__CDAP") {
        found = cat.products.find(o => o.product === payload.product);
        if (found) cat.products.splice(cat.products.indexOf(found), 1);
      }
      return { ...state };
    }
    if (type === "category.ProductLoad") {
      const cats = state.items;
      normalizeNode(payload);
      for (let i = 0; i < cats.length; i++) {
        const cat = cats[i];
        if (cat.id !== "__CDAP") {
          const products = cat.products;
          const found = products.find(o => o.product === payload.product);
          if (found) {
            Object.assign(found, payload);
            break;
          }
        }
      }
      return { ...state };
    }
    if (type === "category.AddProducts") {
      const products = [].merge(payload);
      state.items.map(o => {
        if (o.id !== "__CDAP")
          o.products = normalizeNodes(
            products.filter(b => b.cat === o.id || b.category === o.id)
          );
      });
      return { ...state, products: payload };
    }
    if (type === "category.Filter") {
      state.filter = { ...state.filter, ...payload };
      const { q, category, showPublic, showMyOwn, owner } = state.filter;
      if (q || category || showPublic || showMyOwn) {
        state.items.map(cat => {
          let products = [].merge(cat.products);
          //filter by category
          if (category) {
            cat.hidden = cat.id !== category;
            products.map(o => (o.hidden = cat.hidden));
          } else {
            cat.hidden = false;
            products.map(o => (o.hidden = false));
          }
          products = products.filter(o => !o.hidden);
          //filter by query (q)
          if (q)
            products.map(o => {
              const text = `${o.name || ""} ${o.description || ""}`;
              o.hidden = !text.toLowerCase().includes(q.toLowerCase());
            });
          products = products.filter(o => !o.hidden);
          //filter by public attr
          if (showPublic) products.map(o => (o.hidden = !o.public));
          products = products.filter(o => !o.hidden);
          //filter by ownership
          if (showMyOwn) products.map(o => (o.hidden = o.owner !== owner));
        });
      } else {
        //reset state
        state.items.map(cat => {
          let products = [].merge(cat.products);
          cat.hidden = false;
          products.map(o => (o.hidden = false));
        });
      }
      return { ...state };
    }
    if (type === "category.Add") {
      state.items.push(payload);
      state.items = state.items.sort((o1, o2) =>
        o1.name.localeCompare(o2.name)
      );
      return { ...state };
    }
    if (type === "category.List") {
      state.items = []
        .merge(payload)
        .sort((o1, o2) => `${o1.name || ""}`.localeCompare(`${o2.name || ""}`));
      state.items.map(cat => {
        cat.hidden = false;
        cat.products = normalizeNodes(cat.products).sort((o1, o2) =>
          `${o1.name || ""}`.localeCompare(`${o2.name || ""}`)
        );
        cat.products.map(o => (o.hidden = false));
      });
      return { ...state };
    }
    if (type === "category.Recent") {
      // store recently viewed by id
      const { id } = payload;
      const recentStr = localStorage.getItem("recent") || "";
      const recentArr = recentStr === "" ? [] : recentStr.split(",");
      const found = recentArr.find(storedId => storedId === id);
      if (!found) {
        recentArr.unshift(id);
        if (recentArr.length > 3) recentArr.pop();
        localStorage.setItem("recent", recentArr.join(","));
      }
    }
    return state;
  },
  actions: ["List", "Add", "Filter", "View", "Recent"] //
    .concat(["AddProducts", "ProductLoad", "ProductDelete", "ProductUpdate"]),
  apis: {
    list: {
      method: "get",
      url: `/api/v1/categories`,
      success: "category.List",
      failure: "notification.Notify"
    },
    create: {
      method: "post",
      url: `/api/v1/categories`,
      success: "category.Add",
      failure: "notification.Notify"
    }
  }
});
