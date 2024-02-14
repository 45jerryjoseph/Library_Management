import React, { useCallback, useEffect, useState } from 'react'
import AddProduct from '../marketplace/AddProduct'
import Product from '../marketplace/Product'
import { Row } from "react-bootstrap";


const UsersList = () => {
   
  return (
    <>
      {/* {!loading ? ( */}
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="fs-4 fw-bold mb-0">Users</h1>
            <AddProduct />
          </div>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {/* {products.map((_product) => (
              <Product
                product={{
                  ..._product,
                }}
                buy={buy}
              />
            ))} */}
            <p>Section of users List</p>
          </Row>
          {/* <h1>This is the entry point</h1> */}
        </>
       {/* ) : (  */}
        {/* <Loader />  */}
      {/* )}  */}
    </>
  )
}

export default UsersList