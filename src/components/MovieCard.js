import React, { useState } from "react";
import { Card, Form, Button, ListGroup } from "react-bootstrap";
import Swal from "sweetalert2"; // Import SweetAlert2

const MovieCard = ({ movie }) => {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(movie.comments || []); // Use existing comments

    // Function to add a comment
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return; // Prevent empty comments

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "You must be logged in to comment.",
            });
            return;
        }

        try {
            const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/addComment/${movie._id}`, {
                method: "PATCH", // Ensure method matches the API
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ comment: newComment }),
            });

            if (!response.ok) {
                throw new Error("Failed to add comment");
            }

            // Update comments locally instead of reloading the page
            const newCommentObj = { comment: newComment };
            setComments([...comments, newCommentObj]); // Add new comment to the list

            setNewComment(""); // Clear input field
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Comment added successfully!",
            }); // Show success message
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message,
            }); // Show error message
        }
    };

    return (
        <Card className="mb-4 shadow-sm">
            <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{movie.director}</Card.Subtitle>
                <Card.Text>
                    <strong>Year:</strong> {movie.year} <br />
                    <strong>Genre:</strong> {movie.genre} <br />
                    <strong>Description:</strong> {movie.description}
                </Card.Text>

                {/* Comment Section */}
                <hr />
                <h6>Comments</h6>
                <ListGroup variant="flush">
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <ListGroup.Item key={index}>{comment.comment}</ListGroup.Item>
                        ))
                    ) : (
                        <p>No comments yet.</p>
                    )}
                </ListGroup>

                {/* Add Comment Form */}
                <Form onSubmit={handleAddComment} className="mt-3">
                    <Form.Group>
                        <Form.Control
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </Form.Group>
                    <Button type="submit" variant="primary" className="mt-2" disabled={!newComment.trim()}>
                        Add Comment
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default MovieCard;
