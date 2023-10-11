import './styles.css';


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registered!'))
        .catch(err => console.log(`Service Worker registration failed: ${err}`));
    });
  }
  
  import { addContact, getContact, getAllContacts, deleteContact } from './db.js';

  // Notification function
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');
    if (isError) {
        notification.classList.add('error');
    }
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

  // UI Elements
const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');

// Event Listeners
contactForm.addEventListener('submit', handleAddContact);
contactList.addEventListener('click', handleContactActions); // for view, edit, delete

// ... More code to define the event handlers and logic

// Event Handlers
async function handleAddContact(event) {
    try {
      event.preventDefault();
      
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const phone = document.getElementById('contact-phone').value.trim();
  
      if (!name || !email || !phone) {
        alert('All fields are required!');
        return;
      }
  
      const formData = new FormData(event.currentTarget);
      const contact = Object.fromEntries(formData);
  
      // Check if we are editing an existing contact
      if (contactForm.dataset.editing) {
        const id = contactForm.dataset.editing;
        await updateContact(id, contact);
        delete contactForm.dataset.editing;
      } else {
        const id = await addContact(contact);
        contact.id = id;
        renderContact(contact);
      }
      event.currentTarget.reset();
    } catch (err) {
      console.error("Error handling contact:", err);
      alert('There was an error processing your request. Please try again.');
    }
  }


async function handleContactActions(event) {
  const action = event.target.dataset.action;
  if (action === 'delete') {
    const contactId = event.target.closest('[data-contact-id]').dataset.contactId;
    await deleteContact(contactId);
    event.target.closest('[data-contact-id]').remove();
  } else if (action === 'view') {
    const contactId = event.target.closest('[data-contact-id]').dataset.contactId;
    const contact = await getContact(contactId);
    renderContact(contact);
  }
  else if (action === 'edit') {
    const contactId = event.target.closest('[data-contact-id]').dataset.contactId;
    const contact = await getContact(contactId);
    populateFormWithContact(contact);
  }
  
}

function populateFormWithContact(contact) {
    contactForm.querySelector('[name="name"]').value = contact.name;
    contactForm.querySelector('[name="email"]').value = contact.email;
    contactForm.querySelector('[name="phone"]').value = contact.phone;
    contactForm.dataset.editing = contact.id; // to know if we're editing or adding
  }
  

// Render Functions

function renderContact(contact) {
    const contactItem = document.createElement('div');
    contactItem.dataset.contactId = contact.id;
    contactItem.classList.add('contact-item');
    contactItem.innerHTML = `
        <div class="contact-item__name">${contact.name}</div>
        <div class="contact-item__email">${contact.email}</div>
        <div class="contact-item__phone">${contact.phone}</div>
        <div class="contact-item__actions">
        <button class="button" data-action="view">View</button>
        <button class="button" data-action="edit">Edit</button>
        <button class="button" data-action="delete">Delete</button>
        </div>
    `;
    contactList.appendChild(contactItem);
    }

async function renderContacts() {
    const contacts = await getAllContacts();
    contacts.forEach(renderContact);
    }

renderContacts();


