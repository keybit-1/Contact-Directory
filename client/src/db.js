let db;

const request = indexedDB.open("contactDirectory", 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    if (!db.objectStoreNames.contains('contacts')) {
        db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
    }
};

let dbReady = new Promise((resolve, reject) => {
    request.onsuccess = function(event) {
        db = event.target.result;
        resolve();
    };

    request.onerror = function(event) {
        console.log("Error opening database:", event.target.errorCode);
        reject(event.target.errorCode);
    };
});

async function addContact(contact) {
    await dbReady;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["contacts"], "readwrite");
        const store = transaction.objectStore("contacts");
        const request = store.add(contact);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getContact(id) {
    await dbReady;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["contacts"], "readonly");
        const store = transaction.objectStore("contacts");
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function getAllContacts() {
    await dbReady;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["contacts"], "readonly");
        const store = transaction.objectStore("contacts");
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function deleteContact(id) {
    await dbReady;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["contacts"], "readwrite");
        const store = transaction.objectStore("contacts");
        const request = store.delete(id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

async function updateContact(id, updatedContact) {
    await dbReady;
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(["contacts"], "readwrite");
        const store = transaction.objectStore("contacts");
        const request = store.put(updatedContact, id);

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}

export {
    addContact,
    getContact,
    getAllContacts,
    deleteContact,
    updateContact
};



  
  