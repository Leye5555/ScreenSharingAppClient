import { useState, useEffect, useCallback } from 'react';
import socketIO from 'socket.io-client';
const socket = socketIO.connect('http://localhost:5000');

const Modal = ({ url }) => {
  const [image, setImage] = useState('');
  const [fullHeight, setFullHeight] = useState();
  useEffect(() => {
    socket.emit('browse', {
      url,
    });

    /** 
     Listens for the images and full height from the puppeteerMassScreenshots.
     The image is also converted to a readable file.
    */
    socket.on('image', ({ img, fullHeight }) => {
      setImage('data:image/jpeg;base64,' + img);
      setFullHeight(fullHeight);
    });
  }, [url]);

  const mouseMove = useCallback((event) => {
    const position = event.currentTarget.getBoundingClientRect();
    const widthChange = 1255 / position.width;
    const heightChange = 800 / position.height;

    socket.emit('mouseMove', {
      x: widthChange * (event.pageX - position.left),
      y:
        heightChange *
        (event.pageY - position.top - document.documentElement.scrollTop),
    });
  }, []);

  const mouseClick = useCallback((event) => {
    const position = event.currentTarget.getBoundingClientRect();
    const widthChange = 1255 / position.width;
    const heightChange = 800 / position.height;
    socket.emit('mouseClick', {
      x: widthChange * (event.pageX - position.left),
      y:
        heightChange *
        (event.pageY - position.top - document.documentElement.scrollTop),
    });
  }, []);
  return (
    <div className="popup">
      <div className="popup-ref">{image && <img src={image} alt="" />}</div>
    </div>
  );
};

export default Modal;
