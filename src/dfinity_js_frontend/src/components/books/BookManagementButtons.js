import React, { useCallback, useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";

import { Container, Row, Col } from 'react-bootstrap';
import { addReservedBook, addborrowBook, addreturnBook, getUsers as getUserList } from '../../utils/library';
import Loader from '../utils/Loader';
import PlaceReservedBooks from './PlaceReservedBooks';
import BorrowBook from './BorrowBook';
import ReturnBook from './ReturnBook';

const BookManagementButtons = () => {

  const [loading, setLoading] = useState(false);

  const getUsers = useCallback( async () => {
    try {
      setLoading(true);
      await getUserList();
    } catch (error) {
      console.log({error});
    } finally {
      setLoading(false);
    }
  })

  const placeReserve = async (userId,bookId) => {
    try {
      setLoading(true);
      addReservedBook(userId, bookId).then(()=>{
        getUsers();
      });
      toast(<NotificationSuccess text="Book Reserved successfully." />);
    } catch (error) {
      console.log({error});
      toast(<NotificationError text="Failed to Reserve a book." />);
    } finally {
      setLoading(false)
    }
  }

  const placeBorrow = async (userId,bookId) => {
    try {
      setLoading(true);
      addborrowBook(userId, bookId).then(()=>{
        getUsers();
      });
      toast(<NotificationSuccess text="Book Borrowed successfully." />);
    } catch (error) {
      console.log({error});
      toast(<NotificationError text="Failed to Borrow a book." />);
    } finally {
      setLoading(false)
    }
  }

  const placeReturn = async (userId,bookId) => {
    try {
      setLoading(true);
      addreturnBook(userId, bookId).then(()=>{
        getUsers();
      });
      toast(<NotificationSuccess text="Book Returned successfully" />);
    } catch (error) {
      console.log({error});
      toast(<NotificationError text="Failed to Return a book." />);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
      getUsers();
  }, []);

  return (

    <>
      {!loading ? (
        <Container fluid  style={{ backgroundColor: '#333' }} className='my-3'>
          <Row className="justify-content-between py-2">
            <Col xs="auto">
              <PlaceReservedBooks save={placeReserve} />
            </Col>
            <Col xs="auto">
              <BorrowBook save={placeBorrow}/>
            </Col>
            <Col xs="auto">
             <ReturnBook save={placeReturn}/>
            </Col>
          </Row>
        </Container>
      ) : (
        <Loader />
      )}

    </>
  )
}

export default BookManagementButtons