import React from 'react';
import { Container, Card, Spinner } from 'react-bootstrap';

function ChannelContent({ content, loading }) {
  return (
    <Container>
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title>{content.title}</Card.Title>
            <Card.Text>
              {JSON.stringify(content, null, 2)}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default ChannelContent;
