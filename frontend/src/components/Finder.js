import React, { Component } from "react";
import classNames from "classnames";
import _ from "lodash";
import { Typography } from "@material-ui/core";

import { connect } from "../redux";
import { URL } from "../utils";

import { ButtonUpload, Icon, Space } from "./core";
import FinderPreview from "./FinderPreview";

export class Finder extends Component {
  state = {
    q: "",
    file: "",
    selected: null,
    previewPath: null,
    previewMargin: 24,
    previewOffset: { right: 0, top: 0 },
    preview: { text: null, image: "", video: "", rows: null, json: null }
  };

  async componentDidMount() {
    await this.props.api(this.props.apis.application.fetchFolders);
    const { folders } = this.props.Application;
    if (folders.length) await this.onOpenFolder(folders[0]);
  }

  onOpenFile = async (e, o) => {
    if (this.state.selected === o) return this.preview.show();
    const target = e.target.closest(".file");
    const { previewMargin } = this.state;
    const previewOffset = {
      right: target.offsetLeft + previewMargin + 200,
      top: target.offsetTop + previewMargin
    };
    const previewPath = `${o.path}`;
    this.setState({ selected: o, previewPath, previewOffset });
    await this.props.applicationOpenFile(o);
  };
  async onDownloadFile(item) {
    const { folder } = this.props.Application;
    await this.props.applicationOpenFile(item);
    global.open(
      URL({
        ...this.props.apis.application.download,
        path: [folder.id],
        body: { filename: item }
      })
    );
  }
  async onDeleteFile(item) {
    const { folder } = this.props.Application;
    await this.props.applicationOpenFile(item);
    await this.props.api(
      {
        ...this.props.apis.application.unlink,
        path: [folder.id]
      },
      { filename: item }
    );
  }
  async onOpenFolder(item) {
    await this.props.applicationOpenFolder(item);
    await this.props.api({
      ...this.props.apis.application.fetchFiles,
      path: [item.id]
    });
  }
  async onUpload(files) {
    if (!files || !files.length) return;
    const { folder } = this.props.Application;
    if (!folder || _.isEmpty(folder))
      return await this.props.notificationNotify("Please select a project");
    await this.props.api({
      ...this.props.apis.application.upload,
      path: [folder.id],
      upload: files
    });
  }

  renderFolder(item, i) {
    const { name, description } = item;
    const { folder } = this.props.Application;
    const isActive = item === folder;
    return (
      <Typography
        component="div"
        className={classNames("folder", isActive ? "active" : "")}
        key={i}
        onClick={e => this.onOpenFolder(item)}
      >
        <h4>
          <Icon icon="fas fa-folder" /> {name}
        </h4>
        {description ? <div className="description">{description}</div> : null}
      </Typography>
    );
  }
  renderFolders() {
    const { folders } = this.props.Application;
    const { q } = this.state;
    const filtered = q
      ? folders.filter(o =>
          `${o.name} ${o.description}`.toLowerCase().includes(q.toLowerCase())
        )
      : folders;
    return (
      <Typography component="div" className="folders">
        <input
          type="text"
          placeholder="Search for project"
          value={q}
          onChange={e => this.setState({ q: e.target.value })}
        />
        {filtered.map((o, i) => this.renderFolder(o, i))}
      </Typography>
    );
  }

  renderFile(item, i) {
    const { file } = this.props.Application;
    const isActive = item === file;
    const { name } = item;
    return (
      <div
        key={i}
        ref={e => (this[name] = e)}
        className={classNames("file", isActive ? "active" : "")}
        onClick={e => this.onOpenFile(e, item)}
      >
        <Icon icon="fas fa-file" />
        <div className="filename">{name}</div>
        <Space />
      </div>
    );
  }
  renderFiles() {
    const { file } = this.state;
    const { files } = this.props.Application;
    return (
      <div className="files fit">
        <input
          type="text"
          placeholder="Search for file(s)"
          value={file}
          onChange={e => this.setState({ file: e.target.value })}
        />
        {files.map((o, i) => this.renderFile(o, i))}
      </div>
    );
  }
  renderPreview() {
    const { selected, preview, previewOffset, previewPath } = this.state;
    const { files } = this.props.Application;
    const count = files.length;
    const move = (e, next = true) => {
      const idx = files.indexOf(selected);
      const file =
        files[
          next
            ? idx === count - 1
              ? 0
              : idx + 1
            : idx === 0
            ? count - 1
            : idx - 1
        ];
      this.onOpenFile({ target: this[file.name] }, file);
    };
    return (
      <FinderPreview
        ref={e => (this.preview = e)}
        offset={previewOffset}
        data={preview}
        path={previewPath}
        file={selected}
        hasSkipButtons={count > 1}
        onSkipPrevious={e => move(e, false)}
        onSkipNext={e => move(e, true)}
      />
    );
  }
  render() {
    const { folder } = this.props.Application;
    return (
      <Typography component="div" className="vertical form file-manager">
        <h3 className="horizontal">
          {folder && folder.name}
          <Space />
          <ButtonUpload
            icon="fas fa-upload"
            onUpload={async files => await this.onUpload(files)}
          />
        </h3>
        <div className="horizontal fit">
          {this.renderFolders()}
          {this.renderFiles()}
          {this.renderPreview()}
        </div>
      </Typography>
    );
  }
}

export default connect(
  Finder,
  true
);
