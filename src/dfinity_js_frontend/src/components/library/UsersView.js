import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Row, Container, Nav } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import Loader from "../utils/Loader";
import { createUser, getUsers as getUserList } from "../../utils/library";
import AddUser from "./AddUser";
import UserView from "./UserView";


const UsersView = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUsers = useCallback( async () => {
        try {
          setLoading(true);
          setUsers(await getUserList());
          console.log(users)
        } catch (error) {
          console.log({error});
        } finally {
          setLoading(false);
        }
    })

    const addUser = async (data) => {
        try {
          setLoading(true);
          createUser(data).then(()=>{
            getUsers();
            console.log(users)
        })
          toast(<NotificationSuccess text="User added successfully." />);
        } catch (error) {
          console.log({error});
          toast(<NotificationError text="Failed to create a User." />);
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
          <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fs-4 fw-bold mb-0">Users List</h1>
                <AddUser save={addUser} />
                </div>
                <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5 mt-4">
                   { users.map((_user, index) => (
                        <UserView
                        key={index}
                        user={{
                            ..._user,
                        }}
                        />
                    ))}
                </Row>
                </>
                ) : (
                    <Loader /> 
                )} 
            </>
    )
}

export default UsersView