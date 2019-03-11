import EXIF from "exif-js";

export default function geotag(el) {
  return new Promise(function(resolve, reject) {
    EXIF.getData(el, e => {
      const lng = EXIF.getTag(el, "GPSLongitude"),
        lat = EXIF.getTag(el, "GPSLatitude");
      var toDecimal = function(number) {
        return (
          number[0].numerator +
          number[1].numerator / (60 * number[1].denominator) +
          number[2].numerator / (3600 * number[2].denominator)
        );
      };
      if ((lat, lng)) resolve([toDecimal(lat), toDecimal(lng)]);
      else reject("No GeoTag found");
    });
  });
}
