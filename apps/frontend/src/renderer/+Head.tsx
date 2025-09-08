import { isDevelopment } from "#lib/utils";
import { KEYWORDS } from "@repo/shared/constants/meta";

import "../editor.css"

const title = [
  `Repliq — Форум нового поколения`
]

const desc = [
  `Repliq — это платформа для общения в формате тредов. 
    Создавай обсуждения, обменивайся мнениями и находи интересных собеседников на форуме нового поколения.`,
  `Общайся в тредах, находи единомышленников и делись мыслями на Repliq — современной социальной платформе для открытых дискуссий.`
]

const Meta = () => {
  return (
    <>
      <meta name="apple-mobile-web-app-title" content="Repliq" />
      <meta name="description" content={desc[0]} />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="author" content="Repliq Team" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title[0]} />
      <meta property="og:description" content={desc[1]} />
      <meta property="og:site_name" content="Repliq" />
      <meta property="og:image" content="/preview.jpg" />
      <meta property="og:url" content="/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title[0]} />
      <meta name="twitter:description" content={desc[1]} />
      <meta name="twitter:image" content="/preview.jpg" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="theme-color" content="#171717" />
    </>
  )
}

const Scripts = () => {
  return (
    <>
      <script src="/connect-worker.js" />
      {isDevelopment && (
        <script src="/metrika.js" async />
      )}
    </>
  )
}

const Links = () => {
  return (
    <>
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://api.fasberry.su/forum" />

      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet" />

      <link
        rel="preload"
        as="image"
        href="/logotype.png"
        type="image/png"
      />
    </>
  )
}

export default function HeadDefault() {
  return (
    <>
      <Links />
      <Meta />
      <Scripts />
    </>
  );
}