const DEVICE_FRAMES_HOST =
  "https://bridged-service-static.s3-us-west-1.amazonaws.com/device-frames/";

const frames = {
  "iphone-11-fit-black-no-shadow": "iphone-11-fit-black-no-shadow",
};

/**
 * builds device frame public resource url.
 * e.g. "https://bridged-service-static.s3-us-west-1.amazonaws.com/device-frames/iphone-11-fit-black-no-shadow.png"
 *
 * @returns
 */
export function getDeviceFrameResourceUrl({
  color = "black",
  shadow = "no-shadow",
  fit = "fit",
  format = "png",
  device,
}: {
  device: "iphone-11";
  color?: "black";
  shadow?: "shadow" | "no-shadow";
  fit?: "fit";
  format: "png" | "svg";
}): string {
  const _built = `${device}-${fit}-${color}-${shadow}`;
  if (frames[_built]) {
    return `${DEVICE_FRAMES_HOST}${frames[_built]}.${format}`;
  } else {
    throw 'your requested device-frame resource does not exist on bridged "device-frames" registry';
  }
}
