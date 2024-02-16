import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";


const AddBook = ({save}) => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [attachmentUrl, setImage] = useState("");
    const [availableCopies, setCopies] = useState(0);
    const [reservePrice, setPrice] = useState(0);

    const isFormFilled = () => title && author && category && description && attachmentUrl && availableCopies && reservePrice

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button 
                onClick={handleShow}
                variant='dark'
                className='rounded-pill px-0'
                style={{width: "38px"}}
            >
                <i className="bi bi-plus"></i>
            </Button>
            <Modal show={show} onHide={handleClose} centered >
                <Modal.Header closeButton>
                    <Modal.Title>New Book</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel
                         controlId='inputTitle'
                         label="Book Title"
                         className='mb-3'
                        >
                            <Form.Control
                             type='text'
                             onChange={(e) => {
                                setTitle(e.target.value)
                             }}
                             placeholder='Enter Book Title'
                            />
                        </FloatingLabel>
                        <FloatingLabel
                         controlId='inputAuthor'
                         label="Book Author"
                         className='mb-3'
                        >
                            <Form.Control
                             type='text'
                             onChange={(e) => {
                                setAuthor(e.target.value)
                             }}
                             placeholder='Enter Book Author'
                            />
                        </FloatingLabel>
                        <FloatingLabel
                         controlId='inputCategory'
                         label="Book Category"
                         className='mb-3'
                        >
                            <Form.Control
                             type='text'
                             onChange={(e) => {
                                setCategory(e.target.value)
                             }}
                             placeholder='Enter Book Category'
                            />
                        </FloatingLabel>
                        <FloatingLabel
                         controlId='inputDescription'
                         label="Book Description"
                         className='mb-3'
                        >
                            <Form.Control
                             type='text'
                             onChange={(e) => {
                                setDescription(e.target.value)
                             }}
                             placeholder='Enter Book Description'
                            />
                        </FloatingLabel>
                        <FloatingLabel
                         controlId='inputImageURL'
                         label="Book Image"
                         className='mb-3'
                        >
                            <Form.Control
                             type='text'
                             onChange={(e) => {
                                setImage(e.target.value)
                             }}
                             placeholder='Enter Book Image URL'
                            />
                        </FloatingLabel>
                        <FloatingLabel
                         controlId='inputCopies'
                         label="Book Available Copies"
                         className='mb-3'
                        >
                            <Form.Control
                             type='text'
                             onChange={(e) => {
                                setCopies(e.target.value)
                             }}
                             placeholder='Enter Available Copies '
                            />
                        </FloatingLabel>
                        <FloatingLabel
                         controlId='inputPrice'
                         label="Book Price"
                         className='mb-3'
                        >
                            <Form.Control
                             type='text'
                             onChange={(e) => {
                                setPrice(e.target.value)
                             }}
                             placeholder='Enter Book reserve Price'
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
                            save({
                                title,
                                author,
                                category,
                                attachmentUrl,
                                description,
                                availableCopies,
                                reservePrice,
                            });
                            handleClose();
                            }}
                        >
                            Save Book
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </>
    )
}

AddBook.propTypes = {
    save: PropTypes.func.isRequired,
};

export default AddBook