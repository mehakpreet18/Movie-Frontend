import {useEffect, useRef, useState} from 'react';
import api from '../../api/axiosConfig';
import {useParams} from 'react-router-dom';
import {Container, Row, Col, Alert, Card, Badge} from 'react-bootstrap';
import ReviewForm from '../reviewForm/ReviewForm';

import React from 'react'

const Reviews = ({getMovieData,movie,reviews,setReviews}) => {

    const revText = useRef();
    let params = useParams();
    const movieId = params.movieId;
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(()=>{
        getMovieData(movieId);
    },[])

    const addReview = async (e) =>{
        e.preventDefault();

        const rev = revText.current;

        if (!rev.value.trim()) {
            setMessage({ text: 'Please enter a review before submitting.', type: 'warning' });
            return;
        }

        setIsSubmitting(true);
        setMessage({ text: '', type: '' });

        try
        {
            console.log('Sending review data:', {reviewBody:rev.value,imdbId:movieId});
            
            const response = await api.post("/api/v1/reviews",{reviewBody:rev.value,imdbId:movieId});

            console.log('Full response:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
            console.log('Response headers:', response.headers);

            // Check if the response is successful (status 200-299)
            if (response.status >= 200 && response.status < 300) {
                console.log('Response is successful, processing...');
                
                // Clear the form
                rev.value = "";
                
                // Show success message
                setMessage({ text: 'Review added successfully!', type: 'success' });
                
                // Create a new review object from the response
                const newReview = {
                    body: response.data.reviewBody,
                    reviewBody: response.data.reviewBody,
                    date: response.data.id?.date,
                    id: response.data.id
                };
                
                console.log('Created new review object:', newReview);
                console.log('Current reviews:', reviews);
                console.log('Reviews type:', typeof reviews);
                console.log('Is reviews array?', Array.isArray(reviews));
                
                // Ensure reviews is an array before spreading
                const currentReviews = Array.isArray(reviews) ? reviews : [];
                const updatedReviews = [...currentReviews, newReview];
                setReviews(updatedReviews);
                
                console.log('Updated reviews state:', updatedReviews);
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    setMessage({ text: '', type: '' });
                }, 3000);
            } else {
                console.log('Response status not in success range:', response.status);
                throw new Error('Unexpected response status: ' + response.status);
            }
        }
        catch(err)
        {
            console.error('Error caught in catch block:', err);
            console.error('Error type:', typeof err);
            console.error('Error response:', err.response);
            console.error('Error request:', err.request);
            console.error('Error message:', err.message);
            
            // Check if it's an axios error with response
            if (err.response) {
                console.log('Axios error with response - Status:', err.response.status);
                console.log('Axios error with response - Data:', err.response.data);
                setMessage({ 
                    text: err.response.data?.message || `Failed to add review. Please try again.`, 
                    type: 'danger' 
                });
            } else if (err.request) {
                console.log('Axios error with request but no response');
                setMessage({ 
                    text: 'No response from server. Please check your connection.', 
                    type: 'danger' 
                });
            } else {
                console.log('Other type of error:', err.message);
                setMessage({ 
                    text: 'Failed to add review. Please try again.', 
                    type: 'danger' 
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <Container>
        <Row>
            <Col><h3>Reviews</h3></Col>
        </Row>
        
        {/* Message Display */}
        {message.text && (
            <Row className="mt-2">
                <Col>
                    <Alert variant={message.type} dismissible onClose={() => setMessage({ text: '', type: '' })}>
                        {message.text}
                    </Alert>
                </Col>
            </Row>
        )}

        <Row className="mt-2">
            <Col md={4}>
                <img src={movie?.poster} alt={movie?.title} className="img-fluid" />
            </Col>
            <Col md={8}>
                {
                    <>
                        <Row>
                            <Col>
                                <ReviewForm 
                                    handleSubmit={addReview} 
                                    revText={revText} 
                                    labelText="Write a Review?" 
                                    isSubmitting={isSubmitting}
                                />  
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <hr />
                            </Col>
                        </Row>
                    </>
                }
                
                {/* Reviews Display */}
                <Row>
                    <Col>
                        <h5>Reviews</h5>
                        {(!reviews || !Array.isArray(reviews) || reviews.length === 0) ? (
                            <Alert variant="info">
                                No reviews yet. Be the first to review this movie!
                            </Alert>
                        ) : (
                            reviews.map((r, index) => {
                                // Get the review text from either body or reviewBody
                                const reviewText = r.body || r.reviewBody || 'No review text available';
                                
                                return(
                                    <div key={index} className="mb-3 p-3 border rounded">
                                        <p className="mb-0">{reviewText}</p>
                                    </div>
                                )
                            })
                        )}
                    </Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col>
                <hr />
            </Col>
        </Row>        
    </Container>
  )
}

export default Reviews
