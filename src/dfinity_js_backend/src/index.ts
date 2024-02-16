import { query, update, text, Record, StableBTreeMap, Variant, Vec, None, Some, Ok, Err, ic, Principal, Opt, nat64, Duration, Result, bool, Canister } from "azle";
import {
    Ledger, binaryAddressFromAddress, binaryAddressFromPrincipal, hexAddressFromPrincipal
} from "azle/canisters/ledger";
import { hashCode } from "hashcode";
import { v4 as uuidv4 } from "uuid";

const Book = Record({
    id: text,
    title: text,
    author: text,
    category: text,
    description: text,
    attachmentUrl: text,
    availableCopies: nat64,
    reservePrice: nat64,
    reservor: Principal,
    reservedBy: Opt(text),
    borrowedBy: Opt(text),
    dueDate: Opt(Duration),
});

const User = Record({
    id: text,
    name: text,
    role: text, // admin, librarian, member
    reservedBooks: Vec(text),
    borrowedBooks: Vec(text),
});
// The library to have the instance of being the reciever of the payment of Reservation fee

const BookPayload = Record({
    title: text,
    author: text,
    category: text,
    description: text,
    attachmentUrl: text,
    availableCopies: nat64,
    reservePrice: nat64
});

const UserPayload = Record({
    name: text,
    role: text,
});

const ReserveStatus = Variant({
    PaymentPending: text,
    Completed: text
});



// Stay with implementing Payment for Reserving 
const Reserve = Record({
    BookId: text,
    price: nat64,
    status: ReserveStatus,
    reservor: Principal,
    paid_at_block: Opt(nat64),
    memo: nat64
});

const Message = Variant({
    NotFound: text,
    InvalidPayload: text,
    PaymentFailed: text,
    PaymentCompleted: text
});


const booksStorage = StableBTreeMap(0,text, Book)
const usersStorage =  StableBTreeMap(1,text, User)
const persistedReserves = StableBTreeMap(2, Principal, Reserve);
const pendingReserves = StableBTreeMap(3, nat64, Reserve);

const TIMEOUT_PERIOD = 3600n; // reservation period in seconds


/* 
    initialization of the Ledger canister. The principal text value is hardcoded because 
    we set it in the `dfx.json`
*/
const icpCanister = Ledger(Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai"));

export default Canister({
    getBooks: query([], Vec(Book),() => {
        return booksStorage.values();
    }),
    getUsers: query([], Vec(User), () => {
        return usersStorage.values();
    }),
    getBook: query([text], Result(Book, Message), (id) => { 
        const bookOpt = booksStorage.get(id);
        if ("None" in bookOpt) {
            return Err({ NotFound: `book with id=${id} not found` });
        }
        return Ok(bookOpt.Some);
    }   
    ),

    getUser: query([text], Result(User, Message), (id) => { 
        const userOpt = usersStorage.get(id);
        if ("None" in userOpt) {
            return Err({ NotFound: `User with id=${id} not found` });
        }
        return Ok(userOpt.Some);
    }   
    ),

    // Filter the books by Category
    filterBooksByCategory: query([text], Vec(Book), (category) => {
        return booksStorage.values().filter((book) => book.category.toLowerCase() === category.toLowerCase());
    }
    ),
    // Check the Availability of a Book
    checkAvailability: query([text], bool, (bookId) => {
        const bookOpt = booksStorage.get(bookId);
        if ("None" in bookOpt) {
            return false;
        }
        return bookOpt.Some.availableCopies > 0;
    }),

    // Insert  a reserved book into the user's reservedBooks list
    addReservedBook: update([text, text], Result(User, Message), (userId, bookId) => {
        const userOpt = usersStorage.get(userId);
        if ("None" in userOpt) {
            return Err({ NotFound: `cannot reserve book: user with id=${userId} not found` });
        }
        const bookOpt = booksStorage.get(bookId);
        if ("None" in bookOpt) {
            return Err({ NotFound: `cannot reserve book: book with id=${bookId} not found` });
        }
        if (bookOpt.Some.availableCopies === 0) {
            return Err({ NotFound: `cannot reserve book: book with id=${bookId} not available` });
        }
        if (userOpt.Some.reservedBooks.includes(bookId)) {
            return Err({ NotFound: `cannot reserve book: book with id=${bookId} already reserved by user with id=${userId}` });
        }
        userOpt.Some.reservedBooks.push(bookId);
        bookOpt.Some.reservedBy = Some(userId);
        //Check if the bookId and UserId are in storage and if they are, update the book and user
        booksStorage.insert(bookId, bookOpt.Some);
        usersStorage.insert(userId, userOpt.Some);
        return Ok(userOpt.Some);
    }
    ),

    // Insert a borrowed book into the user's borrowedBooks list
    borrowBook: update([text, text], Result(User, Message), (userId, bookId) => {
        const userOpt = usersStorage.get(userId);
        if ("None" in userOpt) {
            return Err({ NotFound: `cannot borrow book: user with id=${userId} not found` });
        }
        const bookOpt = booksStorage.get(bookId);
        if ("None" in bookOpt) {
            return Err({ NotFound: `cannot borrow book: book with id=${bookId} not found` });
        }
        if (bookOpt.Some.availableCopies === 0) {
            return Err({ NotFound: `cannot borrow book: book with id=${bookId} not available` });
        }
        if (userOpt.Some.borrowedBooks.includes(bookId)) {
            return Err({ NotFound: `cannot borrow book: book with id=${bookId} already borrowed by user with id=${userId}` });
        }
        userOpt.Some.borrowedBooks.push(bookId);
        bookOpt.Some.borrowedBy = Some(userId);
        //Check if the bookId and UserId are in storage and if they are, update the book and user
        booksStorage.insert(bookId, bookOpt.Some);
        usersStorage.insert(userId, userOpt.Some);
        return Ok(userOpt.Some);
    }
    ),

    // Return a borrowed book from the user's borrowedBooks list
    returnBook: update([text, text], Result(User, Message), (userId, bookId) => {
        const userOpt = usersStorage.get(userId);
        if ("None" in userOpt) {
            return Err({ NotFound: `cannot return book: user with id=${userId} not found` });
        }
        const bookOpt = booksStorage.get(bookId);
        if ("None" in bookOpt) {
            return Err({ NotFound: `cannot return book: book with id=${bookId} not found` });
        }
        if (!userOpt.Some.borrowedBooks.includes(bookId)) {
            return Err({ NotFound: `cannot return book: book with id=${bookId} not borrowed by user with id=${userId}` });
        }
        userOpt.Some.borrowedBooks = userOpt.Some.borrowedBooks.filter((id: text) => id !== bookId);
        bookOpt.Some.borrowedBy = None;
        //Check if the bookId and UserId are in storage and if they are, update the book and user
        booksStorage.insert(bookId, bookOpt.Some);
        usersStorage.insert(userId, userOpt.Some);
        return Ok(userOpt.Some);
    }
    ),
    //update a book
    updateBook: update([Book], Result(Book, Message), (payload) => {
        const bookOpt = booksStorage.get(payload.id);
        if ("None" in bookOpt) {
            return Err({ NotFound: `cannot update the book: book with id=${payload.id} not found` });
        }
        booksStorage.insert(bookOpt.Some.id, payload);
        return Ok(payload);
    }
    ),
    //Create a Book
    addBook: update([BookPayload], Result(Book, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ NotFound: "invalid payoad" })
        }
        const book = { id: uuidv4(), reservedBy: None, borrowedBy: None, dueDate: None,reservor:ic.caller(), ...payload};
        booksStorage.insert(book.id, book);
        return Ok(book);
    }
    ),
    
    // Delete a book by id 
    deleteBook: update([text], Result(Book, Message), (id) => {
        const deletedbookOpt = booksStorage.get(id);
        if ("None" in deletedbookOpt) {
            return Err({ NotFound: `cannot delete the book: book with id=${id} not found` });
        }
        booksStorage.remove(id);
        return Ok(deletedbookOpt.Some);
    }
    ),
    
    //Create a User
    addUser: update([UserPayload], Result(User, Message), (payload) => {
        if (typeof payload !== "object" || Object.keys(payload).length === 0) {
            return Err({ NotFound: "invalid payoad" })
        }
        const user = { id: uuidv4(), reservedBooks: [], borrowedBooks: [], ...payload };
        usersStorage.insert(user.id, user);
        return Ok(user);
    }
    ),

    // Delete a user by id
    deleteUser: update([text], Result(User, Message), (id) => {
        const deletedUserOpt = usersStorage.get(id);
        if ("None" in deletedUserOpt) {
            return Err({ NotFound: `cannot delete the user: user with id=${id} not found` });
        }
        usersStorage.remove(id);
        return Ok(deletedUserOpt.Some);
    }
    ),

    // Update a user
    updateUser: update([User], Result(User, Message), (payload) => {
        const userOpt = usersStorage.get(payload.id);
        if ("None" in userOpt) {
            return Err({ NotFound: `cannot update the user: user with id=${payload.id} not found` });
        }
        usersStorage.insert(userOpt.Some.id, payload);
        return Ok(payload);
    }
    ),

    //create a reserve
    createReserveOrder: update([text], Result(Reserve, Message), (bookId) => {
        const bookOpt = booksStorage.get(bookId);
        if ("None" in bookOpt) {
            return Err({ NotFound: `cannot reserve book: book with id=${bookId} not found` });
        }
        const book = bookOpt.Some;
        const reserve = {
            BookId: book.id,
            price: book.reservePrice,
            status: { PaymentPending: "PAYMENT_PENDING" },
            reservor: book.reservor,
            paid_at_block: None,
            memo: generateCorrelationId(bookId)
        };
        pendingReserves.insert(reserve.memo, reserve);
        discardByTimeout(reserve.memo, TIMEOUT_PERIOD);
        return Ok(reserve);
    }
    ),

    // Complete a reserve for book
    completeReserve: update([Principal,text,nat64, nat64, nat64], Result(Reserve, Message), async (reservor,bookId,reservePrice, block, memo) => {
        const paymentVerified = await verifyPaymentInternal(reservor,reservePrice, block, memo);
        if (!paymentVerified) {
            return Err({ NotFound: `cannot complete the reserve: cannot verify the payment, memo=${memo}` });
        }
        const pendingReserveOpt = pendingReserves.remove(memo);
        if ("None" in pendingReserveOpt) {
            return Err({ NotFound: `cannot complete the reserve: there is no pending reserve with id=${bookId}` });
        }
        const reserve = pendingReserveOpt.Some;
        const updatedReserve = { ...reserve, status: { Completed: "COMPLETED" }, paid_at_block: Some(block) };
        const bookOpt = booksStorage.get(bookId);
        if ("None" in bookOpt){
            throw Error(`Book with id=${bookId} not found`)
        }
        const book = bookOpt.Some;
        book.availableCopies -= 1n;
        booksStorage.insert(book.id,book)
        persistedReserves.insert(ic.caller(), updatedReserve);
        return Ok(updatedReserve);

    }
    ),

    
     /*
        another example of a canister-to-canister communication
        here we call the `query_blocks` function on the ledger canister
        to get a single block with the given number `start`.
        The `length` parameter is set to 1 to limit the return amount of blocks.
        In this function we verify all the details about the transaction to make sure that we can mark the order as completed
    */
    verifyPayment: query([Principal, nat64, nat64, nat64], bool, async (receiver, amount, block, memo) => {
        return await verifyPaymentInternal(receiver, amount, block, memo);
    }),

    /*
        a helper function to get address from the principal
        the address is later used in the transfer method
    */
    getAddressFromPrincipal: query([Principal], text, (principal) => {
        return hexAddressFromPrincipal(principal, 0);
    }),

});

/*
    a hash function that is used to generate correlation ids for orders.
    also, we use that in the verifyPayment function where we check if the used has actually paid the order
*/
function hash(input: any): nat64 {
    return BigInt(Math.abs(hashCode().value(input)));
};

// a workaround to make uuid package work with Azle
globalThis.crypto = {
    // @ts-ignore
    getRandomValues: () => {
        let array = new Uint8Array(32);

        for (let i = 0; i < array.length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }

        return array;
    }
};


// HELPER FUNCTIONS
function generateCorrelationId(bookId: text): nat64 {
    const correlationId = `${bookId}_${ic.caller().toText()}_${ic.time()}`;
    return hash(correlationId);
};

/*
    after the order is created, we give the `delay` amount of minutes to pay for the order.
    if it's not paid during this timeframe, the order is automatically removed from the pending orders.
*/
function discardByTimeout(memo: nat64, delay: Duration) {
    ic.setTimer(delay, () => {
        const order = pendingReserves.remove(memo);
        console.log(`Reserve discarded ${order}`);
    });
};

async function verifyPaymentInternal(receiver: Principal, amount: nat64, block: nat64, memo: nat64): Promise<bool> {
    const blockData = await ic.call(icpCanister.query_blocks, { args: [{ start: block, length: 1n }] });
    const tx = blockData.blocks.find((block) => {
        if ("None" in block.transaction.operation) {
            return false;
        }
        const operation = block.transaction.operation.Some;
        const senderAddress = binaryAddressFromPrincipal(ic.caller(), 0);
        const receiverAddress = binaryAddressFromPrincipal(receiver, 0);
        return block.transaction.memo === memo &&
            hash(senderAddress) === hash(operation.Transfer?.from) &&
            hash(receiverAddress) === hash(operation.Transfer?.to) &&
            amount === operation.Transfer?.amount.e8s;
    });
    return tx ? true : false;
};