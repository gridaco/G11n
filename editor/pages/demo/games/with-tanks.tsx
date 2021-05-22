import React from "react";

const DEMO_UNITY_URL =
  "https://bridged-service-demo.s3-us-west-1.amazonaws.com/games-tanks-demo/index.html";

const sizes: { [key: string]: { width: number; height: number } } = {
  embed_iphone_x: {
    width: 100,
    height: 100,
  },
  embed_iphone_x_landscape: {
    width: 1100,
    height: 550,
  },
  embed_ipad_12_9: {
    width: 100,
    height: 100,
  },
  embed_macbook: {
    width: 100,
    height: 100,
  },
};

export default function TanksDemoPage() {
  const sizeKey = "embed_iphone_x_landscape";
  const size = sizes[sizeKey];

  return (
    <>
      <iframe src={DEMO_UNITY_URL} width={size.width} height={size.height} />
    </>
  );
}
