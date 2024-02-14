import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Row, Container, Nav } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  buyBook,
    createBook,
    filterBooksByCategory,
    getBooks as getBookList
} from "../../utils/marketplace";
import AddBook from "./AddBook";
import Loader from "../utils/Loader";
import BookView from "./BookView";


const BooksView = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [status, setStatus] = useState()

    const getBooks = useCallback( async () => {
        try {
          setLoading(true);
          setBooks(await getBookList());
        } catch (error) {
          console.log({error});
        } finally {
          setLoading(false);
        }
    })

    const addBook = async (data) => {
        try {
          setLoading(true);
          const priceStr = data.reservePrice;
          data.reservePrice = parseInt(priceStr, 10) * 10**8;
          data.availableCopies = parseInt(data.availableCopies);
          createBook(data).then(()=>{
            getBooks();
            console.log(books)
        })
          toast(<NotificationSuccess text="Book added successfully." />);
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to create a book." />);
        } finally {
          setLoading(false)
        }
    }

    const buy = async (id) => {
      try {
        setLoading(true);
        await buyBook({
          id
        }).then((resp) => {
          getBooks();
          toast(<NotificationSuccess text="Book reserved successfully" />);
        });
      } catch (error) {
        toast(<NotificationError text="Failed to reserve Book." />);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        getBooks();
        // performSearch(selectedCategory);
    }, []);

    const handleCategoryClick = (category) => {
     setSelectedCategory(category);
       // Call a callback function to perform the search based on the selected category
       performSearch(category);
    };

    const performSearch = async (category) => {
      // Implement your search logic here, e.g., fetch data or update state
      try {
        setLoading(true);
        setBooks(await filterBooksByCategory(category));
      } catch (error) {
        toast(<NotificationError text="No available Book of Category Selected" />);
      } finally {
        setLoading(false)
      }
    };

    return (
        <>
      {!loading ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Library Books Management</h1>
            <AddBook save={addBook} />
          </div>
          <Container fluid>
            <Nav variant="pills" defaultActiveKey="#fantasy" className="justify-content-center">
              <Nav.Item>
                <Nav.Link

              
                  onClick={() => handleCategoryClick('fantasy')}
                  active={selectedCategory === 'fantasy'}
                >
                  Fantasy
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                 
                  onClick={() => handleCategoryClick('adventure')}
                  active={selectedCategory === 'adventure'}
                >
                  Adventure
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link

                  onClick={() => handleCategoryClick('romance')}
                  active={selectedCategory === 'romance'}
                >
                  Romance
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link

                  onClick={() => handleCategoryClick('fiction')}
                  active={selectedCategory === 'fiction'}
                >
                  Fiction
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Container>
          {/* For the Filter by category i will filter by passing the handleCategoryClick function as prop*/}
          {/* I can implement tenary function such that when we have category products it shows otherwise it shows all */}
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5 mt-4">

            {/* If their is category options display based on the category */}
            { selectedCategory ? (  books.map((_book, index) => (
              <BookView
                key={index}
                book={{
                  ..._book,
                }}
                buy={buy}
              />
            )) ) : (
              books.map((_book, index) => (
                <BookView
                  key={index}
                  book={{
                    ..._book,
                  }}
                  buy={buy}
                />
              ))
            )}
          </Row>
          {/* <h1>This is the entry point</h1> */}
        </>
       ) : (
        <Loader /> 
     )} 
    </>
    )
}

export default BooksView