let db;
const request = indexedDB.open("contactDirectory", 1);

request.onupgradeneeded = function(event) {
  db = event.target.result;
  if (!db.objectStoreNames.contains('contacts')) {
    db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
  }
};

request.onsuccess = function(event) {
  db = event.target.result;
};

request.onerror = function(event) {
  console.log("Error opening database:", event.target.errorCode);
};

async function addContact(contact) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["contacts"], "readwrite");
      const store = transaction.objectStore("contacts");
      const request = store.add(contact);
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function getContact(id) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["contacts"], "readonly");
      const store = transaction.objectStore("contacts");
      const request = store.get(id);
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async function getAllContacts() {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["contacts"], "readonly");
      const store = transaction.objectStore("contacts");
      const request = store.getAll();
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function deleteContact(id) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["contacts"], "readwrite");
      const store = transaction.objectStore("contacts");
      const request = store.delete(id);
  
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async function updateContact(id, updatedContact) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["contacts"], "readwrite");
      const store = transaction.objectStore("contacts");
      const request = store.put(updatedContact, id);
  
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
  
  