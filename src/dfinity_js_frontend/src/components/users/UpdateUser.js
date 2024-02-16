import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";
import { toast } from "react-toastify";
import { getUser, updateUser } from '../../utils/library';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';

const UpdateUser = ({userId}) => {

    const [userName, setName] = useState("");
    const [userRole, setRole] = useState("");
    const [reservedList, setReservedList] = useState([])
    const [borrowedList, setBorrowedList] = useState([])

    const navigate = useNavigate();

    const isFormFilled = () =>  userName && userRole

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        // Fetch user details based on userId
        const fetchUserDetails = async () => {
            try {
                const user = await getUser(userId);
                setReservedList(user.reservedBooks);
                setBorrowedList(user.borrowedBooks); // Initialize reservedList with borrowedBooks
                setRole(user.role); // Initialize role
                setName(user.name);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUserDetails();
    }, [userId]);
    

    const updateReservedList = (e) => {
        const input = e.target.value;
        const bookIds = input ? input.split(',').map((id) => id.trim()) :[];
        setReservedList(bookIds);
    };

    const updateBorrowedList = (e) => {
        const input = e.target.value;
        const bookIds = input ? input.split(',').map((id) => id.trim()) : [];
        setBorrowedList(bookIds);
    };
    const saveChanges = async () => {
        try {
            // Update user details with the modified reservedList and role
            await updateUser({id: userId,name: userName,
                role: userRole, 
                borrowedBooks: borrowedList || [],
                reservedBooks: reservedList || []
             });
            toast(<NotificationSuccess text="User updated successfully." />);
            navigate(-1)
        } catch (error) {
            console.error(error);
            toast(<NotificationError text="Failed to update a User." />);
        }
    };

    return (
        <>
            <Button 
                onClick={handleShow}
                variant='dark'
                className='rounded-pill px-0'
                style={{width: "38px"}}
            >
                <i className="bi-pencil-square"></i>
            </Button>
            <Modal show={show} onHide={handleClose} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>

                         <FloatingLabel
                        controlId='inputId'
                        label="User Id"
                        className='mb-3'
                        >
                            <Form.Control
                            type='text'
                            defaultValue={userId}
                            placeholder='Enter Id'
                            />
                        </FloatingLabel>

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
                        <FloatingLabel 
                        controlId='inputBorrowedBooks' 
                        label='Borrowed Books' 
                        className='mb-3'>
                            <Form.Control
                                type='text'
                                defaultValue={(borrowedList ? borrowedList.join(',') : '') || ''}
                                onChange={updateBorrowedList}
                                placeholder='Enter comma-separated book IDs'
                            />
                        </FloatingLabel>
                        <FloatingLabel 
                            controlId='inputReservedBooks' 
                            label='Reserved Books' 
                            className='mb-3'>
                            <Form.Control
                                type='text'
                                defaultValue={(reservedList ? reservedList.join(',') : '') || ''}
                                onChange={updateReservedList}
                                placeholder='Enter comma-separated book IDs'
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
                            saveChanges();
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


export default UpdateUser