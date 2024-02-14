import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import AddProduct from "./AddProduct";
import Product from "./Product";
import Loader from "../utils/Loader";
import { Row, Container, Nav } from "react-bootstrap";

import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import {
  getProducts as getProductList,
  createProduct, buyProduct,
  createBook,
  getBooks as getBookList
} from "../../utils/marketplace";
import AddBook from "./AddBook";
// import Books from "../../pages/Books";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // function to get the list of products
  const getProducts = useCallback(async () => {
    try {
      setLoading(true);
      setProducts(await getProductList());
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  });
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

  const addProduct = async (data) => {
    try {
      setLoading(true);
      const priceStr = data.price;
      data.price = parseInt(priceStr, 10) * 10**8;
      createProduct(data).then((resp) => {
        getProducts();
      });
      toast(<NotificationSuccess text="Product added successfully." />);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to create a product." />);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (data) => {
    try {
      setLoading(true);
      const priceStr = data.price;
      data.price = parseInt(priceStr, 10) * 10**8;
      data.copies = parseInt(data.copies);
      createBook(data).then(()=>{
        getBooks();
    })
      toast(<NotificationSuccess text="Book added successfully." />);
    } catch (error) {
      console.log({error});
      toast(<NotificationError text="Failed to create a book." />);
    } finally {
      setLoading(false)
    }
  }

  //  function to initiate transaction
  const buy = async (id) => {
    try {
      setLoading(true);
      await buyProduct({
        id
      }).then((resp) => {
        getProducts();
        toast(<NotificationSuccess text="Product bought successfully" />);
      });
    } catch (error) {
      toast(<NotificationError text="Failed to purchase product." />);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    // Call a function to perform the search based on the selected category
    performSearch(category);
  };

  const performSearch = (category) => {
    // Implement your search logic here, e.g., fetch data or update state
    console.log(`Searching for books in category: ${category}`);
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
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {products.map((_product) => (
              <Product
                product={{
                  ..._product,
                }}
                buy={buy}
              />
            ))}
          </Row>
          {/* <h1>This is the entry point</h1> */}
        </>
       ) : (
        <Loader /> 
     )} 
    </>
  );
};

export default Products;
