import React from "react";
import Dropzone from "react-dropzone";

import Component from "./Component";
import Button from "./Button";

export class ButtonUpload extends Component {
  state = { files: [] };
  async onDrop(files) {
    await this.setState({ files });
    if (this.props.onUpload) await this.props.onUpload(this.state.files);
  }

  async onCancel(...args) {
    await this.setState({ files: [] });
    if (this.props.onCancel) await this.props.onCancel(...args);
  }

  renderComponent() {
    const defaultProps = this.props;

    return (
      <Dropzone
        {...Object.omit(defaultProps, "onUpload", "onCancel", "children")}
        className="btn-upload"
        onDrop={(...args) => this.onDrop(...args)}
        onFileDialogCancel={(...args) => this.onCancel(...args)}
      >
        {this.props.children || <Button text="Upload" />}
      </Dropzone>
    );
  }
}

export default ButtonUpload;
