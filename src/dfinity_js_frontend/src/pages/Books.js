import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Nav, Button, Form, FloatingLabel } from "react-bootstrap";
import Wallet from '../components/Wallet';
import Products from "../components/marketplace/Products";
import { login, logout as destroy } from "../utils/auth";
import { balance as principalBalance } from "../utils/ledger"
import { Notification } from '../components/utils/Notifications';
import Cover from '../components/utils/Cover';
import coverImg from "../assets/img/Library.jpg"
import Users from './Users';
import BookManagementButtons from '../components/books/BookManagementButtons';
import BooksView from '../components/marketplace/BooksView';
import { checkAvailability } from '../utils/marketplace';


const Books = () => {
  const isAuthenticated = window.auth.isAuthenticated;
  const principal = window.auth.principalText;


  const [balance, setBalance] = useState("0");
  const [bookid, setBookid] = useState("")
  const [status, setStatus] = useState(Boolean)
  const [message, setMessage] = useState("")


  const getBalance = useCallback(async () => {
    if (isAuthenticated) {
      setBalance(await principalBalance());
    }
  });

  const checkStatus = async() => {
    try {
      setStatus( await checkAvailability(bookid));
      if( status.toString() == "true"){
        setMessage("Book is available")
      } else {
        setMessage("Book is not available")
      }
      console.log({status});
    } catch (error) {
      console.log({error});
    }
  }
  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
      
    <>
      <Notification />
      {isAuthenticated ? (
        // {/* This is the page that will hold all books page structure */}
          // <h1>I need to add Books here</h1>
          // <Link to="/users">Users</Link> 
          <Container fluid="md">
            <Nav className='justify-content-end pt-3 pb-5'>
              <Nav.Item>
                <Wallet
                      principal={principal}
                      balance={balance}
                      symbol={"ICP"}
                      isAuthenticated={isAuthenticated}
                      destroy={destroy}
                      />
              </Nav.Item>
            </Nav>
            <div>
              <Link to="/users" className='justify-content-start py-2 px-3 my-2 bg-secondary text-white rounded-pill '>Available Users</Link> 
              <BookManagementButtons />
              {/* <Products /> */}
              <BooksView />
              {/* <Users /> */}
            </div>
            <div    style={{
                backgroundColor: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                // position: 'fixed',
                bottom: 0,
                // width: '81%',
                padding: '5px',
                marginTop: "7px"
              }} >
            <Button
            variant="success"
            className="rounded-pill "
            onClick={checkStatus}
            >
            Check Availability
            </Button>
            {/* Input Section with taking book Id  */}
            <Form>
              <FloatingLabel
                controlId="inputBookId"
                label="Book Id"
                className="mb-3 mx-4 "
              >
                <Form.Control
                  type="text"
                  onChange={(e) => {
                    setBookid(e.target.value);
                  }}
                  placeholder="Enter Book Id"
                />
              </FloatingLabel>
            </Form>
              <p className='text-white'>{message}</p>
            </div>
          </Container>

      ) : (
        <Cover name="Library Books Management" login={login} coverImg={coverImg} />
        // <h1>lorem*2</h1>
        )}
    </>
          
  )
}

export default Books