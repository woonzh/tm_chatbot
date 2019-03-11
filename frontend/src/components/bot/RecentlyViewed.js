import React, { Component } from "react";

import { connect } from "../../redux";

class RecentlyViewed extends Component {
  get recentlyViewed() {
    const recent = localStorage.getItem("recent");
    return recent ? recent : "";
  }

  renderEachRecentlyViewed(product) {
    return (
      <div key={product.id} className="icon-bot">
        <img src="/assets/node/default-icon.svg" />
        <div className="text">{product.name}</div>
      </div>
    );
  }
  renderRecentlyViewed() {
    const recentIdArr = this.recentlyViewed.split(",");
    if (recentIdArr === "") return;
    const products = this.props.Category.products;
    return recentIdArr.map(id => {
      const product = products.find(p => p.id === id);
      if (product) return this.renderEachRecentlyViewed(product);
      return null;
    });
  }

  render() {
    return (
      <div className="section section-bots-recently-viewed">
        <h4>Recently Viewed</h4>
        <div className="recent-services">{this.renderRecentlyViewed()}</div>
      </div>
    );
  }
}

export default connect(RecentlyViewed);
