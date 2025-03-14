import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import UserContext from '../UserContext';

export default function AddMovie() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    // Initialize state variables
    const [title, setTitle] = useState("");
    const [director, setDirector] = useState("");
    const [year, setYear] = useState("");
    const [description, setDescription] = useState("");
    const [genre, setGenre] = useState("");

    function createMovie(e) {
        e.preventDefault();

        let token = localStorage.getItem('token');

        fetch(`https://movieapp-api-lms1.onrender.com/movies/addMovie`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                director,
                year,
                description,
                genre
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                setTitle("");
                setDirector("");
                setYear("");
                setDescription("");
                setGenre("");

                Swal.fire({
                    icon: 'success',
                    title: 'Movie added successfully!',
                    confirmButtonText: 'OK'
                }).then(() => navigate("/movies"));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong.',
                    confirmButtonText: 'OK'
                });
            }
        });
    }

    return (
        user.isAdmin === true ? (
            <>
                <h1 className="my-5 text-center">Add Movie</h1>
                <Form onSubmit={createMovie}>
                    <Form.Group>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Movie Title"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Director:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Director Name"
                            required
                            value={director}
                            onChange={e => setDirector(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Release Year:</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter Release Year"
                            required
                            value={year}
                            onChange={e => setYear(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Description:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter Description"
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Genre:</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Genre"
                            required
                            value={genre}
                            onChange={e => setGenre(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="my-5">Submit</Button>
                </Form>
            </>
        ) : (
            <Navigate to="/movies" />
        )
    );
}