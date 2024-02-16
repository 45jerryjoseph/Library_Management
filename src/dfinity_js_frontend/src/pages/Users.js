import React from 'react'
import {  Container } from "react-bootstrap";
import UsersView from '../components/library/UsersView';


const Users = () => {
  return (
      <Container fluid="md" >

         {/* This will hold the Users structure  */}
        <UsersView />
      </Container>

  )
}

export default Users