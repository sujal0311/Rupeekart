import React from 'react';
import { useNavigate,useParams } from 'react-router-dom';
const OrderSuccess = () => {
    const navigate=useNavigate()
    const location=useParams()

  return (
    <div style={styles.container} className='mt-28 mx-2 lg:mx-auto'>
        <img src="https://github.com/sujal0311/temp/blob/main/animation-1723655766708_31dc4b98.gif?raw=true" alt="" className='object-cover'/>
      <h1 style={styles.header}>Thank You for Your Order!</h1>
      <p style={styles.text}>Your order has been successfully placed.</p>
      <p style={styles.text}>Order Number: <strong>{location.orderId}</strong></p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() =>navigate(`/order/${location.orderId}`)}>
          View Order Details
        </button>
        <button style={styles.button} onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '50px',
    maxWidth: '500px',
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '2em',
    color: '#4CAF50',
    margin:'4px'
  },
  text: {
    fontSize: '1.2em',
    margin: '20px 0',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '30px',
  },
  button: {
    padding: '10px 15px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin:'2px 6px'
  }
};

export default OrderSuccess;
