import PFile from "./PFile";

export class PImage extends PFile {
  get accept() {
    return this.props.accept || "image/*";
  }
  get text() {
    return this.props.text || "Upload an image";
  }
}

export default PImage;
