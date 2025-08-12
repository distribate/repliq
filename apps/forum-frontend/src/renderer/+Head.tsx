import { KEYWORDS } from "@repo/shared/constants/meta";

const Scripts = () => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/worker.js')
      .then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              } else {}
            }
          });
        });
      })
      .catch(err => console.warn('Worker registration failed:', err));

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      console.log('New worker activated, reloading page...');
      window.location.reload();
    });
  });
}
            `
        }}
      />
      {import.meta.env.PROD && (
        <>
          <script src="/metrika.js" async />
        </>
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

      <meta name="theme-color" content="#171717" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400..900&display=swap" rel="stylesheet" />
      <Scripts />
    </>
  );
}