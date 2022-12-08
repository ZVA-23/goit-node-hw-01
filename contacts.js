const fs = require('fs/promises');
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

/**
 * Update all contacts
 */

async function updateContacts(contacts) {
  const contactsJson = JSON.stringify(contacts, null, 2);
  await fs.writeFile(contactsPath, contactsJson);
}

/**
 * Get all contacts in table: node index.js --action list
 */

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  const allContacts = JSON.parse(data);
  return allContacts;
}

/**
 * Get contact by id: node index.js --action get --id 5
 */

async function getContactById(contactId) {
  const id = String(contactId);
  const contacts = await listContacts();
  const result = contacts.find(contact => contact.id === id);
  return result || null;
}

/**
 * Add contact: node index.js --action add --name Mango --email mango@gmail.com --phone 322-22-22
 */

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

/**
 * Delete contact: node index.js --action remove --id 3
 */

async function removeContact(contactId) {
  const id = String(contactId);
  const contacts = await listContacts();
  const index = contacts.findIndex(contact => contact.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return result;
}

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
};
