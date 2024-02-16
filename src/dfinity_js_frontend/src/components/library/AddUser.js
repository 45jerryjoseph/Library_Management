import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";


const AddUser = ({save}) => {

    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    const isFormFilled = () => name && role

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
                    <Modal.Title>New User</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <FloatingLabel
                         controlId='inputName'
                         label="Username"
                         className='mb-3'
                        >
                            <Form.Control
                             type='text'
                             onChange={(e) => {
                                setName(e.target.value)
                             }}
                             placeholder='Enter Username'
                            />
                        </FloatingLabel>
                        <FloatingLabel
                         controlId='inputRole'
                         label="User Role"
                         className='mb-3'
                        >
                            <Form.Control
                             type='text'
                             onChange={(e) => {
                                setRole(e.target.value)
                             }}
                             placeholder='Enter Role'
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
                                name,
                                role
                            });
                            handleClose();
                            }}
                        >
                            Save User
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </>
    )
}

AddUser.propTypes ={
    save: PropTypes.func.isRequired,
}


export default AddUser