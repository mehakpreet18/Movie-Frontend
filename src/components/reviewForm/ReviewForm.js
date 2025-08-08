import {Form,Button} from 'react-bootstrap';

const ReviewForm = ({handleSubmit,revText,labelText,defaultValue,isSubmitting}) => {
  return (

    <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>{labelText}</Form.Label>
            <Form.Control 
                ref={revText} 
                as="textarea" 
                rows={3} 
                defaultValue={defaultValue}
                disabled={isSubmitting}
                placeholder="Share your thoughts about this movie..."
            />
        </Form.Group>
        <Button 
            variant="outline-info" 
            onClick={handleSubmit}
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </Button>
    </Form>   

  )
}

export default ReviewForm
