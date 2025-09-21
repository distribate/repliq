import { DEFAULT_META } from "#shared/constants/meta";
import { KEYWORDS } from "@repo/shared/constants/meta";

const Meta = () => {
  const { title, description } = DEFAULT_META

  return (
    <>
      <meta name="apple-mobile-web-app-title" content="Repliq" />
      <meta name="description" content={description[0]} />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="author" content="Repliq Team" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title[0]} />
      <meta property="og:description" content={description[1]} />
      <meta property="og:site_name" content="Repliq" />
      <meta property="og:image" content="/preview.jpg" />
      <meta property="og:url" content="/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title[0]} />
      <meta name="twitter:description" content={description[1]} />
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
      <script src="/registerSW.js" async></script>
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
      <link rel="preconnect" href="https://api.fasberry.su/forum" />
      <link rel="manifest" href="/site.webmanifest" />
      
      <link
        rel="preload"
        href="/fonts/OpenSans.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/SpaceGrotesk.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        as="image"
        href="/logotype.webp"
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