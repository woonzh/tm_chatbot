import React, { Component } from "react";
import classNames from "classnames";

import { connect } from "../../redux";

import { Hexagon } from "../";

class BotSelection extends Component {
  state = {
    filterValue: "",
    searchValue: ""
  };
  get categories() {
    const filteredCategory = this.props.Category.items.filter(o => {
      if (!o.products || !o.products.length) return false;
      return true;
    });
    return filteredCategory;
  }
  renderSearch() {
    return (
      <div className="section section-bots-searchBar">
        <h4>Find Services by Searching</h4>
        <div className="section-description">
          You can enter keywords and names.
        </div>
        <input
          type="text"
          placeholder="Example: Email, Image Recognition..."
          value={this.state.searchValue}
          onChange={e => this.setState({ searchValue: e.target.value })}
        />
      </div>
    );
  }
  renderOption(cat, i) {
    return (
      <option key={i} value={cat.id}>
        {cat.name}
      </option>
    );
  }
  renderCatFilter() {
    const { categories } = this;
    const { filterValue } = this.state;
    return (
      <div className="section section-bots-filter">
        <h4>Find Services by Category</h4>
        <div className="section-description">
          Select the bot through the category filter.
        </div>
        <select
          className={classNames(
            "category-filter",
            filterValue ? "" : "placeholder"
          )}
          value={filterValue}
          onChange={e =>
            this.setState({
              filterValue: e.target.value
            })
          }
        >
          <option value="">Select All Categories</option>
          {categories.map((cat, i) => this.renderOption(cat, i))}
        </select>
      </div>
    );
  }
  searchForBot(product, searchValue) {
    const nameAndDesc = `${product.name} ${product.description}`;
    return nameAndDesc.search(searchValue);
  }
  renderBot(o, i) {
    const { hidden, name, image } = o;
    const { searchValue } = this.state;

    if (this.searchForBot(o, searchValue) < 0) return;
    if (!hidden)
      return (
        <div
          key={i}
          className="bot"
          onClick={e => this.props.onSelected(o)}
          title={name}
        >
          <Hexagon
            key={i}
            style={{
              backgroundImage: `url(${image})`
            }}
          />
          <div className="name">{name}</div>
        </div>
      );
  }
  renderBots(products) {
    return (
      <div className="bots">{products.map((o, i) => this.renderBot(o, i))}</div>
    );
  }
  renderCategory() {
    const { categories } = this;
    const { filterValue, searchValue } = this.state;
    let renderCat = categories;

    if (filterValue !== "") {
      renderCat = categories.filter(cat => cat.id === filterValue);
    }
    if (searchValue !== "") {
      renderCat = renderCat.filter(cat => {
        return cat.products.find(p => this.searchForBot(p, searchValue) > 0);
      });
    }
    return renderCat.map((category, i) => {
      return (
        <div key={i} className="category">
          <h4>{category.name}</h4>
          {this.renderBots(category.products)}
        </div>
      );
    });
  }
  render() {
    return (
      <div className="bot-selection">
        <div className="searchbar">
          {this.renderCatFilter()}
          {this.renderSearch()}
        </div>
        <div className="categories">{this.renderCategory()}</div>
      </div>
    );
  }
}

export default connect(BotSelection);
