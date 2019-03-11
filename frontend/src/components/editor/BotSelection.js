import React, { Component } from "react";
import go from "gojs";
import classNames from "classnames";
import { InputAdornment } from "@material-ui/core";

import { connect } from "../../redux";

import { ButtonRounded, Icon, TextField } from "../core";

import { nodeTemplate } from "./templates";
import BotForm from "./BotForm";

const { jQuery } = global;
const $ = go.GraphObject.make;

const normalizeCanvasData = (products, id) => {
  return products
    .filter(o => !o.hidden && o.id !== id)
    .map(p => Object.omit(p, "id"));
};

export class BotSelection extends Component {
  state = { filter: {} };

  get id() {
    return this.props.id;
  }
  get categories() {
    const { id } = this;
    return this.props.Category.getVisibleCategories(o => {
      const { products } = o;
      if (!products.filter(o => !o.hidden && o.id !== id).length) return false; //no hidden
      return true;
    });
  }
  //////////
  async componentDidMount() {
    const { id } = this;
    await this.setState({ filter: { ...this.props.Category.filter } });
    if (!this.props.loaded) {
      await this.props.api(this.props.apis.category.list, { product: id });
      await this.props.categoryFilter(this.state.filter);
    }
    await this.buildCanvases();
  }
  async componentDidUpdate() {
    await this.buildCanvases();
  }
  async componentWillUnmount() {
    jQuery(this.panel.closest(".main-content")).removeClass("hide-palette");
    await this.props.categoryFilter(this.state.filter);
  }
  //////////
  async buildCanvas(el, i) {
    const container = jQuery(el);
    const catid = container.data("catid");
    if (!el.done) {
      const canvasEl = container.find(".products").get(0);
      const layout = $(go.GridLayout, {
        wrappingWidth: 250,
        wrappingColumn: 3,
        spacing: go.Size.parse("0 0 ")
      });
      const o = $(go.Palette, canvasEl, { allowZoom: false, layout });
      //node templates
      const opts = { size: 37, margin: 11, fontSize: 8 };
      o.nodeTemplateMap.add(
        "default",
        nodeTemplate({ ...opts, onlyImage: false, selectionAdorned: false })
      );
      o.nodeTemplateMap.add(
        "onlyImage",
        nodeTemplate({ ...opts, onlyImage: true, selectionAdorned: false })
      );
      //events
      o.addDiagramListener("ObjectSingleClicked", async e => {
        const node = e.diagram.lastInput.targetObject.part.data;
        if (this.props.onNodeClick) await this.props.onNodeClick(node);
      });
      o.addDiagramListener("ObjectDoubleClicked", async e => {
        const node = e.diagram.lastInput.targetObject.part.data;
        if (this.props.onNodeDClick) await this.props.onNodeDClick(node);
        else if (!this.props.popup && node.atomic) this.openAddBotForm(node);
      });
      el.canvas = o;
      el.done = true;
      container.addClass("close");
    }
    const canvas = el.canvas;
    const categories = this.props.Category.getCategories();
    const cat = categories.find(c => c.id === catid);
    canvas.model.nodeDataArray = normalizeCanvasData(cat.products, this.id);
    return canvas;
  }
  async buildCanvases() {
    const containers = jQuery(this.dom).find(".category");
    await Promise.all(
      containers.toArray().map((el, i) => this.buildCanvas(el, i))
    );
  }
  ////////
  openAddBotForm = node => this.props.popupAdd(<BotForm node={node} />);
  onToggleCategory = e => {
    const curDiv = e.target.closest(".category");
    const catsDiv = jQuery(e.target.closest(".categories")).find(".category");
    catsDiv.map(function(i) {
      if (this !== curDiv)
        jQuery(this)
          .find(".products")
          .slideUp();
      else
        jQuery(this)
          .find(".products")
          .slideToggle();
    });
  };
  toggleContent = () => {
    jQuery(this.panel)
      .find(".core-icon")
      .toggleClass("fa-chevron-right fa-chevron-left");
    jQuery(this.panel).toggleClass("hide");
    jQuery(this.panel.closest(".main-content")).toggleClass("hide-palette");
  };

  renderCategory = (item, i) => {
    const className = classNames(
      "category",
      !item.products || !item.products.length ? "empty" : ""
    );
    return (
      <div key={item.id} data-catid={item.id} className={className}>
        <div className="category-name" onClick={this.onToggleCategory}>
          {item.name}
        </div>
        <div className="products" />
      </div>
    );
  };
  renderCategories = () => {
    const { categories } = this;
    return (
      <div className="categories" ref={e => (this.dom = e)}>
        {categories.map((item, i) => this.renderCategory(item, i))}
      </div>
    );
  };
  renderCategorySelection() {
    const product = this.props.Product.detail;
    let { category } = product;
    const categories = this.props.Category.items;
    return (
      <select
        value={category}
        onChange={e => this.props.productChangeCategory(e.target.value)}
      >
        {categories.map((o, i) => (
          <option key={i} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    );
  }
  render() {
    const { q } = this.props.Category.filter;
    return (
      <div className="palette" ref={e => (this.panel = e)}>
        {this.props.header}
        {this.props.popup ? null : (
          <div className="handle" onClick={this.toggleContent}>
            <Icon icon="fas fa-chevron-left" />
          </div>
        )}
        <div className="horizontal center middle fullW product-search">
          <TextField
            id="textarea-product-search"
            placeholder="Search for a service"
            value={q}
            onChange={e => this.props.categoryFilter({ q: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon icon="fas fa-search" title="Add bot" />
                </InputAdornment>
              )
            }}
          />
          {this.props.popup ? null : (
            <ButtonRounded
              icon="fas fa-plus"
              title="Add bot"
              onClick={e => this.openAddBotForm()}
            />
          )}
        </div>
        {this.renderCategories()}
      </div>
    );
  }
}

export default connect(
  BotSelection,
  true
);
