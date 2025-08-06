import { KEYWORDS } from "@repo/shared/constants/meta";

const Scripts = () => {
  return (
    <>
      {import.meta.env.PROD && (
        <script type="text/javascript">
          {`(function (m, e, t, r, i, k, a) {
          m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date();
        for (var j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
        k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
    })
        (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

        ym(95784050, "init", {
          clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true
    });`}
        </script>
      )}
    </>
  )
}

export default function HeadDefault() {
  return (
    <>
      <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="shortcut icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-title" content="Repliq" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="description" content="Repliq — это платформа для общения в формате тредов. Создавай обсуждения, обменивайся мнениями и находи интересных собеседников на форуме нового поколения." />
      <meta name="keywords" content={KEYWORDS} />
      <meta name="author" content="Repliq Team" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Repliq — Форум нового поколения" />
      <meta property="og:description" content="Общайся в тредах, находи единомышленников и делись мыслями на Repliq — современной социальной платформе для открытых дискуссий." />
      <meta property="og:site_name" content="Repliq" />
      <meta property="og:image" content="/preview.jpg" />
      <meta property="og:url" content="/" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Repliq — Форум нового поколения" />
      <meta name="twitter:description" content="Общайся в тредах, находи единомышленников и делись мыслями на Repliq — современной социальной платформе для открытых дискуссий." />
      <meta name="twitter:image" content="/preview.jpg" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..900&display=swap" rel="stylesheet" />
      
      <Scripts />
    </>
  );
}