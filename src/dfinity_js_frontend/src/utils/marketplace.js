import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createBook(book) {
  return window.canister.marketplace.addBook(book);
}

export async function createUser(user) {
  return window.canister.marketplace.addUser(user);
}

export async function getBooks() {
  try {
    return await window.canister.marketplace.getBooks();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function getUsers() {
  try {
    return await window.canister.marketplace.getUsers();
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}


export async function getBook(bookId) {
  try {
    return await window.canister.marketplace.getBook(bookId);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return {};
  }
}

export async function updateBook(book){
  return window.canister.marketplace.updateBook(book);
}

export async function updateUser(user) {
  return window.canister.marketplace.updateUser(user);
}

export async function addReservedBook(userId, bookId) {
  return window.canister.marketplace.addReservedBook(userId, bookId);
}

export async function addborrowBook(userId, bookId){
  try {
    return  window.canister.marketplace.borrowBook(userId, bookId);
  } catch (error) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return {}
  }
}

export async function addreturnBook(userId, bookId){
  try {
    return  window.canister.marketplace.returnBook(userId, bookId);
  } catch (error) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return {}
  }
}

export async function checkAvailability(bookId) {
  return await window.canister.marketplace.checkAvailability(bookId);
}

export async function filterBooksByCategory(category) {
  try {
    return await window.canister.marketplace.filterBooksByCategory(category);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function deleteBook(bookId) {
  return window.canister.marketplace.deleteBook(bookId);
}

export async function deleteUser(userId) {
  return window.canister.marketplace.deleteUser(userId);
}


export async function buyBook(book) {
  const marketplaceCanister = window.canister.marketplace;
  const orderResponse = await marketplaceCanister.createReserveOrder(book.id);
  const reservorPrincipal = Principal.from(orderResponse.Ok.reservor);
  const reservorAddress = await marketplaceCanister.getAddressFromPrincipal(reservorPrincipal);
  const block = await transferICP(reservorAddress, orderResponse.Ok.price, orderResponse.Ok.memo);
  await marketplaceCanister.completeReserve(reservorPrincipal, book.id, orderResponse.Ok.price, block, orderResponse.Ok.memo);
}


// Here is where i am to implement all functions connecting to my  canister 