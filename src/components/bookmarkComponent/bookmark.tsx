import { exec } from 'child_process';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookBookmark } from '@fortawesome/free-solid-svg-icons'

interface BookmarkProps {
  url: string;
  title: string;
}

const Bookmark: React.FC = () => {
    const url = window.location.href;
    const title = document.title;

  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleBookmark = () => {
    // Here you can implement your logic to bookmark the page
    console.log(`Bookmarking ${title} (${url})`);

    if (window.navigator.userAgent.indexOf('Chrome') > -1 || window.navigator.userAgent.indexOf('Safari') > -1) {
        // For Chrome and Safari browsers
        alert('Press Ctrl+D (Cmd+D on Mac) to bookmark this page.');
      } else if (window.navigator.userAgent.indexOf('Firefox') > -1) {
        // For Firefox
        alert('Press Ctrl+D (Cmd+D on Mac) to bookmark this page.');
      } else if (window.navigator.userAgent.indexOf('MSIE') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1) {
        // For Internet Explorer
        window["external"]["AddFavorite"](url, title);
      } else {
        // For other browsers
        alert('Press Ctrl+D (Cmd+D on Mac) to bookmark this page.');
      }
    
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
      <FontAwesomeIcon icon={faBookBookmark}/> 
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bookmark Page</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to bookmark this page?
          <br />
          <strong>{title}</strong>
          <br />
          <small>{url}</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleBookmark}>
            Bookmark
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Bookmark;
