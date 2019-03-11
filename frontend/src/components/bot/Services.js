import React, { Component, Fragment } from "react";

import { connect } from "../../redux";

import BotEditor from "./BotEditor";

const { jQuery } = global;

class Services extends Component {
  get categories() {
    return this.props.Category.getVisibleCategories(o => {
      const { products } = o;
      if (!products.filter(o => !o.hidden && o.atomic).length) return false; //no hidden atomic
      return true;
    });
  }
  setRecentlyViewed(id) {
    this.props.categoryRecent({ id });
  }
  async openEditor(node) {
    this.setRecentlyViewed(node.id);
    const temp = {
      nodeDataArray: [node],
      linkDataArray: [],
      variables: [],
      selection: [node]
    };
    //create a temp process on client
    await this.props.botCreateExperiment(temp);
    //display the editor
    this.props.popupAdd(
      <BotEditor noclose={true} className="editor" selected={node} />
    );
  }

  handleCollapse = () => {
    jQuery(".services-content").slideToggle(e =>
      jQuery(".arrow").toggleClass("down")
    );
  };
  renderEachService(category) {
    const { products } = category;
    const services = products.filter(o => !o.hidden && o.atomic);
    return services.map((service, i) => {
      const { name, description } = service;
      return (
        <div
          key={i}
          className="service"
          title={description}
          onClick={e => this.openEditor(service)}
        >
          {name}
        </div>
      );
    });
  }
  renderCat(category, i) {
    return [
      <div key={i} className="service-category-name">
        <div className="service-category-name-text">{category.name}</div>
      </div>,
      this.renderEachService(category)
    ];
  }
  renderServicesByCat() {
    const { categories } = this;
    return categories.map((category, i) => {
      return (
        <div key={i} className="service-category">
          {this.renderCat(category, i)}
        </div>
      );
    });
  }
  render() {
    return (
      <Fragment>
        <div className="section-services">
          <div className="services-heading" onClick={this.handleCollapse}>
            <div className="arrow down" />
            <h5>Services</h5>
          </div>
          <div className="services-content">{this.renderServicesByCat()}</div>
        </div>
        <hr />
      </Fragment>
    );
  }
}

export default connect(Services);
