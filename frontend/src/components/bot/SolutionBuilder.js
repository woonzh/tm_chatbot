import React, { Component } from "react";

import { connect } from "../../redux";

import { ButtonRounded } from "../core";
import BotEditor from "./BotEditor";

class SolutionBuilder extends Component {
  get solutions() {
    // Note: Solutions are non-atomic products
    const products = this.props.Category.getProducts();
    return products.filter(o => !o.hidden && !o.atomic);
  }

  async openEditor(node) {
    const products = this.props.Category.getProducts();
    const temp = {
      nodeDataArray: [].merge(
        node.nodeDataArray.map(o => ({
          ...products.find(p => p.id === o.product),
          key: o.key,
          loc: o.loc
        }))
      ),
      linkDataArray: [].merge(node.linkDataArray),
      variables: [],
      selection: []
    };
    await this.props.botUpdateExperiment(temp);
    this.props.popupAdd(<BotEditor noclose={true} className="editor" />);
  }

  renderSolutionActions(product) {
    return (
      <div className="actions">
        <ButtonRounded
          icon="Edit"
          title="Edit solution"
          onClick={e => this.props.history.push(`/projects/${product.id}`)}
        />
        <ButtonRounded
          icon="FileCopyOutlined"
          title="Clone as new solution"
          onClick={e => this.openEditor(product)}
        />
        <ButtonRounded
          icon="PlayCircleFilled"
          title="Run solution"
          onClick={e => this.props.openProcessSetting(product)}
        />
        <ButtonRounded icon="Schedule" title="Set schedule for this solution" />
      </div>
    );
  }
  renderSolution(product, i) {
    const { name, image, description } = product;
    return (
      <div key={i} className="template-project" title={description}>
        <div className="template-project-name">{name}</div>
        <div className="template-project-description">
          {description || name}
        </div>
        <div
          className="icon-bot"
          style={{
            backgroundImage: `url(${image || "/assets/node/default-icon.svg"})`
          }}
        />
        {this.renderSolutionActions(product)}
      </div>
    );
  }
  renderSolutions() {
    const { solutions } = this;
    return solutions.map((o, i) => this.renderSolution(o, i));
  }
  render() {
    return (
      <div className="section-solution-builder">
        <h4>Build a Solution</h4>
        <div className="section-description">
          Get started with simple wizards and pre-programmed workflow processes.
        </div>
        <div className="template-projects-content">
          {this.renderSolutions()}
        </div>
      </div>
    );
  }
}

export default connect(
  SolutionBuilder,
  true
);
