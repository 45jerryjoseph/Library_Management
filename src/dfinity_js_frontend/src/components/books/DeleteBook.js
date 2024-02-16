import React from 'react'
import { Button } from "react-bootstrap";


const DeleteBook = ({remove}) => {
  return (
    <Button 
        onClick={()=>{
            remove()
        }}
        variant='dark'
        className='rounded-pill px-0'
        style={{width: "38px"}}
    >
    <i className="bi-trash-fill"></i>
    </Button>
  )
}

export default DeleteBook