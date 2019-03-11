import PFile from "./PFile";

export class PVideo extends PFile {
  get accept() {
    return this.props.accept || "video/*";
  }
  get text() {
    return this.props.text || "Upload a video";
  }
}

export default PVideo;
