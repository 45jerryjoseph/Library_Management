import React, { useState } from 'react'
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";


const PlaceReservedBooks = ({save}) => {
    const [show, setShow] = useState(false)
    const [userId, setUserId] = useState("")
    const [bookId, setBookId] = useState("")


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
        Place Reserved Books
      </Button>
      <Modal show={show} onHide={handleClose} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Reserve Book</Modal.Title>
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
                            Reserve Book
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>


    </>
  )
}

PlaceReservedBooks.propTypes = {
    save: PropTypes.func.isRequired
}

export default PlaceReservedBooks