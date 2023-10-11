if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered!'))
        .catch(err => console.log(`Service Worker registration failed: ${err}`));
    });
  }
  
  import { addContact, getContact, getAllContacts, deleteContact } from './db.js';