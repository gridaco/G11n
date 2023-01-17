import { useRouter } from "next/router";
import React from "react";
export default function () {
  const router = useRouter();
  const { id } = router.query
  return <div>{id} Settings</div>;
}
