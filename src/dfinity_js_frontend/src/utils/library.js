import { Principal } from "@dfinity/principal";
import { transferICP } from "./ledger";

export async function createBook(book) {
  return window.canister.library.addBook(book);
}

export async function createUser(user) {
  return window.canister.library.addUser(user);
}

export async function getBooks() {
  try {
    return await window.canister.library.getBooks();
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
    return await window.canister.library.getUsers();
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
    return await window.canister.library.getBook(bookId);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return {};
  }
}

export async function getUser(userId) {
  try {
    return await window.canister.library.getUser(userId);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return {};
  }
}

export async function updateBook(book){
  return window.canister.library.updateBook(book);
}

export async function updateUser(user) {
  return window.canister.library.updateUser(user);
}

export async function addReservedBook(userId, bookId) {
  return window.canister.library.addReservedBook(userId, bookId);
}

export async function addborrowBook(userId, bookId){
  try {
    return  window.canister.library.borrowBook(userId, bookId);
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
    return  window.canister.library.returnBook(userId, bookId);
  } catch (error) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return {}
  }
}

export async function checkAvailability(bookId) {
  return await window.canister.library.checkAvailability(bookId);
}

export async function filterBooksByCategory(category) {
  try {
    return await window.canister.library.filterBooksByCategory(category);
  } catch (err) {
    if (err.name === "AgentHTTPResponseError") {
      const authClient = window.auth.client;
      await authClient.logout();
    }
    return [];
  }
}

export async function deleteBook(bookId) {
  return window.canister.library.deleteBook(bookId);
}

export async function deleteUser(userId) {
  return window.canister.library.deleteUser(userId);
}


export async function buyBook(book) {
  const marketplaceCanister = window.canister.library;
  const orderResponse = await marketplaceCanister.createReserveOrder(book.id);
  const reservorPrincipal = Principal.from(orderResponse.Ok.reservor);
  const reservorAddress = await marketplaceCanister.getAddressFromPrincipal(reservorPrincipal);
  const block = await transferICP(reservorAddress, orderResponse.Ok.price, orderResponse.Ok.memo);
  await marketplaceCanister.completeReserve(reservorPrincipal, book.id, orderResponse.Ok.price, block, orderResponse.Ok.memo);
}


// Here is where i am to implement all functions connecting to my  canister 