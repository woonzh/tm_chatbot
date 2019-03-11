import React from "react";
import { Page } from "../components";

import { connect } from "../redux";
import { Button, ButtonRounded } from "../components";
import { BotEditor, ProcessSetting } from "../components";

export class ProductsPage extends Page {
  async componentDidMount() {
    await super.componentDidMount();
    await this.props.api(this.props.apis.product.list);
  }
  async openProcessSetting(item) {
    await this.onSelectProduct(item);
    this.processSettingForm = (
      <ProcessSetting
        onClose={e => this.props.popupRemove(this.processSettingForm)}
      />
    );
    await this.props.popupAdd(this.processSettingForm);
  }
  async onSelectProduct(item) {
    await this.props.productDetail(item);
  }
  async openEditor(node) {
    const products = this.props.Category.products;
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
    this.editor = this.renderEditor();
    this.props.popupAdd(this.editor);
  }
  async onCreateNewProject() {
    const { error } = await this.props.api(this.props.apis.product.create);
    if (!error)
      await this.props.history.push(
        `/projects/${this.props.Product.detail.id}`
      );
  }

  renderEditor() {
    return (
      <BotEditor
        noclose={true}
        className="editor"
        onAfterClose={e =>
          this.props.api(
            this.props.apis.bot.experimentclean,
            this.props.Bot.temp
          )
        }
      />
    );
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
          onClick={e => this.openProcessSetting(product)}
        />
        <ButtonRounded icon="Schedule" title="Set schedule for this solution" />
      </div>
    );
  }
  renderProduct(o, i) {
    const { name, description, image } = o;
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
        {this.renderSolutionActions(o)}
      </div>
    );
  }
  renderProducts() {
    const products = this.props.Product.items.filter(o => !o.hide);
    return products.map((o, i) => this.renderProduct(o, i));
  }
  renderNewProduct() {
    return (
      <div className="product new-product">
        <Button
          className="btn-new-project"
          onClick={e => this.onCreateNewProject()}
        />
      </div>
    );
  }
  renderComponent() {
    return (
      <div className="page page-products">
        <h3>
          <input
            type="text"
            placeholder="Search Solutions"
            className="project-search-field"
            onChange={e => this.props.productSearch(e.target.value)}
          />
        </h3>
        <div className="page-content products template-projects-content">
          {this.renderNewProduct()}
          {this.renderProducts()}
        </div>
      </div>
    );
  }
}

export default connect(
  ProductsPage,
  true
);
