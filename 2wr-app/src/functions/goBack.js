import router from "@/router";

export default function () {
  window.history.length > 1 ? router.go(-1) : router.push("/");
}