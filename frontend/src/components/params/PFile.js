import React, { Component } from "react";
import classNames from "classnames";
import Dropzone from "react-dropzone";
import mime from "mime-types";

import { Icon } from "../core";

export class PFile extends Component {
  state = {
    root: this.props.root,
    value: ((this.props.param && this.props.param.value) || "").replace(
      this.codeReg,
      ""
    ),
    file: this.props.param.file
  };
  get code() {
    return this.props.code || "PRODUCT_DIR";
  }
  get codeReg() {
    return new RegExp(`^\`${this.props.code}\`\\/`, "g");
  }
  get accept() {
    return this.props.accept;
  }
  get text() {
    return this.props.text || "Upload a file";
  }
  ////////
  async componentDidMount() {
    const { file } = this.state;
    if (file) await this.onPreview();
  }
  async shouldComponentUpdate(props) {
    const nvalue = ((props.param && props.param.value) || "").replace(
      this.codeReg,
      ""
    );
    if (nvalue !== this.state.value) this.setState({ value: nvalue });
  }
  ////////
  onDrop = async files => {
    const file = files[0];
    await this.setState({ file, value: file.name }, async () => {
      await this.onPreview();
      if (this.props.onUpload) await this.props.onUpload(this.state.file);
    });
  };
  onCancel = async (...args) =>
    this.props.onCancel ? await this.props.onCancel(...args) : false;
  onPreview = async () => {
    const { file } = this.state;
    if (!file) return null;
    const preview = this.preview;
    const reader = new FileReader();
    reader.onloadend = e =>
      global
        .jQuery(preview)
        .attr("src", URL.createObjectURL(file))
        .parents(".bot-param-preview")
        .removeClass("error");
    try {
      reader.readAsDataURL(file);
    } catch (e) {}
  };
  onChange = async () => {
    const { value, file } = this.state;
    const { param, onChange } = this.props;
    let nvalue = file ? file.name : value;
    nvalue = /^`DIR`\//g.test(value) ? value : `\`${this.code}\`/${value}`;
    onChange({ target: { value: nvalue, file } }, param);
  };
  onReset = async e => {
    await this.setState({ value: "", file: null }, e =>
      global.jQuery(this.preview).attr("src", "")
    );
  };
  onAddCode = async e => {
    let { value } = this.state;
    value = value.replace(/^`DIR`\//g, "").replace(/^`PRODUCT_DIR`\//g, "");
    await this.setState({ value: `\`DIR\`/${value}` }, e => {
      global.jQuery(this.preview).attr("src", "");
      if (this.props.autosave) this.onChange();
    });
  };
  ////////
  renderPreview() {
    const { file, root, value } = this.state;
    const render = e => {
      if (!file && (!value || /^`DIR`\//g.test(value))) return null;
      let name, type, src;
      if (file) {
        name = file.name;
        type = file.type;
      } else if (value) {
        name = value.substring(value.lastIndexOf("/") + 1);
        type = mime.lookup(name);
        src = `${root}/${value}`;
      }
      if (/^image/g.test(type))
        return (
          <img
            ref={e => (this.preview = e)}
            alt={name}
            src={src}
            onError={e =>
              global
                .jQuery(e.target.closest(".bot-param-preview"))
                .addClass("error")
            }
          />
        );
      if (/^video/g.test(type))
        return <video controls ref={e => (this.preview = e)} src={src} />;
    };
    return (
      <div className="bot-param-preview">
        {this.props.autosave ? null : (
          <Icon
            icon="fas fa-save"
            className="icon-save"
            onClick={this.onChange}
          />
        )}
        {this.code === "DIR" ? null : (
          <Icon
            icon="fas fa-code"
            className="icon-code"
            onClick={this.onAddCode}
          />
        )}
        {this.props.atomic ? null : (
          <Dropzone
            className="dropzone"
            multiple={false}
            accept={this.accept}
            onDrop={(...args) => this.onDrop(...args)}
            onFileDialogCancel={(...args) => this.onCancel(...args)}
          >
            <Icon icon="fas fa-upload" title={this.text} />
          </Dropzone>
        )}
        {!value ? null : (
          <Icon
            icon="fas fa-trash"
            className="icon-delete"
            onClick={this.onReset}
          />
        )}
        <div className="name" title={value}>
          {value}
        </div>
        {render()}
      </div>
    );
  }
  renderFileSelection() {
    const { files } = this.props;
    const onChange = e =>
      this.setState({ value: e.target.value, file: null }, e => {
        if (this.props.autosave) this.onChange();
      });
    return (
      <div className="horizontal">
        <input
          type="text"
          placeholder="Enter file name here or ->"
          value={this.state.value}
          onChange={onChange}
        />
        {this.props.atomic || (!files || !files.length) ? null : (
          <select value={this.state.value} onChange={onChange}>
            <option value="">Select from project</option>
            {files.map((o, i) => (
              <option key={i} value={o.name}>
                {o.name}
              </option>
            ))}
          </select>
        )}
      </div>
    );
  }
  render() {
    const { file } = this.state;
    const { title, param } = this.props;
    const { name, description, required } = param;
    return (
      <div
        className={classNames(
          "bot-param bot-param-file-manager",
          this.props.className,
          required && !file ? "error" : ""
        )}
      >
        <h4>
          {title === false ? null : name}
          {title === false ? null : <span>{required ? " (*)" : ""}</span>}
          {title === false ? null : <label>{description}</label>}
        </h4>
        {this.renderPreview()}
        {this.renderFileSelection()}
      </div>
    );
  }
}

export default PFile;
