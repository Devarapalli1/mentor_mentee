import React, { useEffect } from "react";
import { Card, Container } from "react-bootstrap";

const Notifications = ({ user, notifications, loadNotifications }) => {
  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <Container className="my-5">
      <h4>Notifications</h4>

      {notifications?.length > 0
        ? notifications.map((notification, index) => (
            <Card key={index} className="notification mb-2">
              <Card.Body>{notification.text}</Card.Body>
            </Card>
          ))
        : "No notifications"}
    </Container>
  );
};

export default Notifications;
