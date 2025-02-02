// self.addEventListener('install', (event) => {
//   self.skipWaiting(); 
// });

// self.addEventListener('activate', (event) => {
//   event.waitUntil(clients.claim()); 
// });

// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     (async () => {
//       const response = await fetch(event.request);

//       console.log(response)

//       return response;
//     })()
//   );
// });