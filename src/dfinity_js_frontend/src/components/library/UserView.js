import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Card, Col, Badge, Table } from 'react-bootstrap';
import { toast } from "react-toastify";
import DeleteUser from '../users/DeleteUser';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { deleteUser, getUsers as getUserList  } from '../../utils/library';
import UpdateUser from '../users/UpdateUser';

const UserView = ({user}) => {
    const {id,name, role, reservedBooks, borrowedBooks} = user
    const navigate = useNavigate();

    const removeUser = () => {
        try {
            deleteUser(id);
            toast(<NotificationSuccess text="User Removed successfully." />);
            navigate(-1)
        } catch (error) {
            console.log({error});
            toast(<NotificationError text="Failed to Remove a User." />);
          }
    }

    return (
        <Col key={id}>
        <Card className="h-100">
            <Card.Body>
                <Table responsive>
                    <tbody>
                        <tr>
                            <td>ID:</td>
                            <td>{id}</td>
                        </tr>
                        <tr>
                            <td>Name:</td>
                            <td>{name}</td>
                        </tr>
                        <tr>
                            <td>Role:</td>
                            <td>{role}</td>
                        </tr>
                        <tr>
                            <td>Reserved Books:</td>
                            <td>{reservedBooks.join(', ')}</td>
                        </tr>
                        <tr>
                            <td>Borrowed Books:</td>
                            <td>{borrowedBooks.join(', ')}</td>
                        </tr>
                        <tr>
                            <td><DeleteUser remove={removeUser} /></td>
                            <td><UpdateUser userId={id}/></td>
                        </tr>

                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    </Col>
    )
}

export default UserView