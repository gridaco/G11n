import React from "react";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export default function BackButton({ url }: { url?: string }) {
  const router = useRouter();

  const onMouseEnter = (e: any) => {
    e.target.style.background = "lightgray";
  };
  const onMouseLeave = (e: any) => {
    e.target.style.background = "";
  };

  return (
    <ArrowLeftIcon
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => {
        url ? router.push(url) : router.back();
      }}
      style={{
        borderRadius: 10,
        marginLeft: 10,
        width: 30,
        height: 30,
        cursor: "pointer",
      }}
    ></ArrowLeftIcon>
  );
}
