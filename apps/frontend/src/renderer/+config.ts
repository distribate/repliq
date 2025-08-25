import vikeReact from "vike-react/config";
import type { Config } from "vike/types";

const script = `<noscript>
    <div><img src="https://mc.yandex.ru/watch/95784050" style="position:absolute; left:-9999px;" alt="" /></div>
  </noscript>`

export default {
  title: "Repliq",
  extends: vikeReact,
  reactStrictMode: false,
  ssr: false,
  bodyHtmlEnd: script,
  passToClient: ["snapshot"],
} satisfies Config;