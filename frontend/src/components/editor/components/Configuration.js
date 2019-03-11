import React, { Component } from "react";

import { connect } from "../../../redux";

import { ButtonUpload, Checkbox, Icon } from "../../core";

export class Configuration extends Component {
  onUploadProductImage = async files => {
    const product = this.props.Product.detail;
    //upload image
    const file = files[0];
    const { error } = await this.props.api({
      ...this.props.apis.product.imageUpload,
      upload: { id: product.id, files: file }
    });
    if (!error) {
      const image = `/uploads/${file.name}`;
      await this.props.productChange({ image });
      //save product
      await this.props.api(
        {
          ...this.props.apis.product.update,
          path: [product.id]
        },
        { ...product, image }
      );
    }
  };
  render() {
    const product = this.props.Product.detail;
    let { name, description, image, category, cat } = product;
    const categories = this.props.Category.items;
    return (
      <div className="configuration horizontal">
        <div className="vertical">
          <label>Name</label>
          <input
            type="text"
            placeholder="Project name"
            value={name}
            onChange={e => this.props.productChange({ name: e.target.value })}
          />
          <div className="horizontal">
            <div className="vertical fit bottom">
              <label>Category</label>
              <select
                value={cat || category}
                onChange={e =>
                  this.props.productChange({ category: e.target.value })
                }
              >
                {categories.map((o, i) => (
                  <option key={i} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="horizontal bottom">
              <Checkbox
                checked={product.public ? true : false}
                onChange={(e, v) => this.props.productChange({ public: v })}
              />
              <label>Public</label>
            </div>
          </div>
          <label>
            Image/Icon
            <ButtonUpload accept="image/*" onUpload={this.onUploadProductImage}>
              <div>
                <Icon
                  ref={e => (this.uploadIcon = e)}
                  title="Upload product icon"
                  icon="fas fa-upload"
                />
                {image ? (
                  <Icon
                    title="Project icon"
                    icon="fas fa-trash-alt"
                    onClick={e => {
                      e.preventDefault();
                      e.stopPropagation();
                      this.props.productChange({
                        image: "/assets/node/default-icon.svg"
                      });
                    }}
                  />
                ) : null}
              </div>
            </ButtonUpload>
          </label>
          <Icon
            ref={e => (this.uploadIcon = e)}
            title="Project icon"
            icon={image}
            onError={e => {
              this.uploadIcon.icon = "/assets/node/default-icon.svg";
            }}
          />
        </div>
        <div className="vertical">
          <label>Description</label>
          <textarea
            id="textarea-description"
            placeholder="Project Description"
            value={description}
            onChange={e =>
              this.props.productChange({ description: e.target.value })
            }
          />
        </div>
      </div>
    );
  }
}

export default connect(
  Configuration,
  true
);
