import React, { useState } from 'react'
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

const BorrowBook = ({save}) => {

    const [show, setShow] = useState(false);
    const [userId, setUserId] = useState("");
    const [bookId, setBookId] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const isFormFilled = () => userId && bookId

    return (
        <>
        <Button 
          onClick={handleShow}
          variant="primary" 
          className="rounded-pill" 
          style={{ backgroundColor: '#6c757d' }}
        >
          Borrow Book
        </Button>
        <Modal show={show} onHide={handleClose} centered >
                  <Modal.Header closeButton>
                      <Modal.Title>Enter Borrowed Book</Modal.Title>
                  </Modal.Header>
                  <Form>
                      <Modal.Body>
                          <FloatingLabel
                           controlId='inputBookId'
                           label="User Id"
                           className='mb-3'
                          >
                              <Form.Control
                               type='text'
                               onChange={(e) => {
                                  setUserId(e.target.value)
                               }}
                               placeholder='Enter User Id'
                              />
                          </FloatingLabel>
                          <FloatingLabel
                              controlId='inputBookId'
                              label="Book Id"
                              className='mb-3'
                          >
                              <Form.Control
                                  type='text'
                                  onChange={(e) => {
                                      setBookId(e.target.value)
                                  }}
                                  placeholder='Enter Book Id' 
                              />
                          </FloatingLabel>
                      </Modal.Body>
                      <Modal.Footer>
                          <Button variant="outline-secondary" onClick={handleClose}>
                              Close
                          </Button>
                          <Button
                              variant="dark"
                              disabled={!isFormFilled()}
                              onClick={() => {
                              save(
                                  userId,
                                  bookId
                              );
                              handleClose();
                              }}
                          >
                              Borrow Book
                          </Button>
                      </Modal.Footer>
                  </Form>
              </Modal>
  
  
      </>
        
    )
}

BorrowBook.propTypes = {
    save: PropTypes.func.isRequired
}

export default BorrowBook