import { log } from "#shared/utils/log";

type ConnectOptions = {
  path: string;
  autoSkipWaiting?: boolean;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onRegistered?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: unknown) => void;
};

export async function connectServiceWorker(
  opts: ConnectOptions
) {
  const {
    path,
    autoSkipWaiting = false,
    onUpdate,
    onRegistered,
    onError,
  } = opts;

  if (!('serviceWorker' in navigator)) {
    log("SW", 'worker are not supported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      path,
      { type: 'module', scope: '/' }
    );

    onRegistered?.(registration);

    if (registration.waiting) {
      onUpdate?.(registration);

      if (autoSkipWaiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    }

    registration.addEventListener('updatefound', () => {
      const newSW = registration.installing;
      if (!newSW) return;

      newSW.addEventListener('statechange', () => {
        log('SW', 'installing worker state:', newSW.state);

        if (newSW.state === 'installed') {
          if (navigator.serviceWorker.controller) {

            onUpdate?.(registration);

            if (autoSkipWaiting) {
              newSW.postMessage({ type: 'SKIP_WAITING' });
            }
          } else {
            log('SW', 'worker installed for the first time');
          }
        }
      });
    });

    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;

      log('SW', 'controller changed — reloading page to activate new SW');

      window.location.reload();
    });

    return registration;
  } catch (err) {
    onError?.(err);
    throw err;
  }
}