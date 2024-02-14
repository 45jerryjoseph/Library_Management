import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, Button, Col, Badge, Stack, Row } from "react-bootstrap";
import { Principal } from "@dfinity/principal";
import { getBook } from "../../utils/marketplace";


const BookView = ({ book, buy }) => {
    const { id,
        title,
        author,
        category,
        description,
        attachmentUrl,
        availableCopies,
        reservePrice,
        reservor,
        dueDate
    } = book;

    const triggerBuy = () => {
        buy(id);
    }

    return (
        <Col key={id}>
            <Card className=" h-100">
                <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                        <span className="font-monospace text-secondary">{Principal.from(reservor).toText()}</span>
                        <Badge bg="secondary" className="ms-auto">
                            {availableCopies.toString()} available Copies
                        </Badge>
                    </Stack>
                </Card.Header>
                <div className=" ratio ratio-4x3">
                    <img src={attachmentUrl} alt={title} style={{ objectFit: "cover" }} />
                </div>
                <Card.Body className="d-flex  flex-column text-center">
                    <Card.Title>{title}</Card.Title>
                    <Card.Text className="flex-grow-1 d-flex flex-row"><span className="px-4"><strong>Author:</strong></span>{author}</Card.Text>
                    <Card.Text className="flex-grow-1 d-flex flex-row "><span className="px-4"><strong>Category:</strong></span>{category}</Card.Text>
                    <Card.Text className="flex-grow-1  "><span className="px-4"><strong>Description:</strong></span>{description}</Card.Text>
                    <Card.Text className="text-secondary">
                        <span>{reservedBy}</span>
                        <span>{rbook.borrowedBy}</span>
                    </Card.Text>
                    <Card.Text className="text-secondary">
                        <span><strong>Book Id:</strong></span>
                        <span>{id}</span>
                    </Card.Text>
                    <Button
                        variant="outline-dark"
                        onClick={triggerBuy}
                        className="w-100 py-3"
                    >
                        Reserve Book for {(reservePrice / BigInt(10**8)).toString()} ICP
                    </Button>
                </Card.Body>
            </Card>
        </Col>
    );
}

BookView.propTypes = {
    book: PropTypes.instanceOf(Object).isRequired,
    buy: PropTypes.func.isRequired,
};

export default BookView