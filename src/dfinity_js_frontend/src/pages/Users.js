import React from 'react'
import UsersList from '../components/users/UsersList'
import {  Container } from "react-bootstrap";


const Users = () => {
  return (
      <Container fluid="md" >

         {/* This will hold the Users structure  */}
        <UsersList />
      </Container>

  )
}

export default Users