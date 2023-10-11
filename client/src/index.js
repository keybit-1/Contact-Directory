import './styles.css';
import { addContact, getContact, getAllContacts, deleteContact, updateContact } from './db';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('Service Worker registered!'))
      .catch(err => console.log(`Service Worker registration failed: ${err}`));
  });
}

function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.classList.add('notification');
    if (isError) {
      notification.classList.add('error');
    }
    document.body.appendChild(notification);
  
    // Use requestAnimationFrame to smoothly add and remove the notification
    requestAnimationFrame(() => {
      notification.classList.add('show');
      requestAnimationFrame(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => {
          document.body.removeChild(notification);
        }, { once: true });
      });
    });
  }

document.addEventListener('DOMContentLoaded', async () => {
  const contactForm = document.getElementById('contact-form');
  const contactList = document.getElementById('contact-list');

  if (contactForm) {
    contactForm.addEventListener('submit', handleAddContact);
  }

  if (contactList) {
    contactList.addEventListener('click', handleContactActions);
  }

  await renderContacts();
});

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
    const contactForm = document.getElementById('contact-form');  // Fresh reference

    if (contactForm.dataset.editing) {
      const id = contactForm.dataset.editing;
      await updateContact(id, contact);
      delete contactForm.dataset.editing;
    } else {
      const id = await addContact(contact);
      contact.id = id;
      renderContact(contact);
    }
    contactForm.reset();
  } catch (err) {
    console.error("Error handling contact:", err);
    alert('There was an error processing your request. Please try again.');
  }
}

function populateFormWithContact(contact) {
  if (!contact) {
    console.error("Contact data is missing.");
    return;
  }

  const contactForm = document.getElementById('contact-form');  // Fresh reference

  if (contactForm) {
    contactForm.querySelector('[name="name"]').value = contact.name;
    contactForm.querySelector('[name="email"]').value = contact.email;
    contactForm.querySelector('[name="phone"]').value = contact.phone;
    contactForm.dataset.editing = contact.id;
  }
}

async function handleContactActions(event) {
    const action = event.target.dataset.action;
    const contactId = event.target.closest('[data-contact-id]').dataset.contactId;
    console.log("Retrieved contactId:", contactId);  // <-- Added log statement here
  
    switch (action) {
      case 'delete':
        await deleteContact(Number(contactId));  // Convert to number
        event.target.closest('[data-contact-id]').remove();
        break;
  
      case 'view':
        const contact = await getContact(Number(contactId));  // Convert to number
        if (contact) {  // Ensure contact data exists before rendering
          renderContact(contact);
        } else {
          console.error(`Failed to fetch contact for ID: ${contactId}`);
        }
        break;
  
      case 'edit':
        const editableContact = await getContact(Number(contactId));  // Convert to number
        if (editableContact) {  // Ensure contact data exists before populating the form
          populateFormWithContact(editableContact);
        } else {
          console.error(`Failed to fetch contact for ID: ${contactId}`);
        }
        break;
    }
  }

function renderContact(contact) {
  if (!contact || !contact.id || !contact.name || !contact.email || !contact.phone) {
    console.error("Invalid contact data:", contact);
    return;
  }

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
  const contactList = document.getElementById('contact-list');
  if (contactList) {
    contactList.appendChild(contactItem);
  }
}

async function renderContacts() {
  const contacts = await getAllContacts();
  contacts.forEach(renderContact);
}



