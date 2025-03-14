import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Table, Button, Spinner, Alert, Form, Row, Col, Modal } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AdminView = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await fetch("https://movieapp-api-lms1.onrender.com/movies/getMovies", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch movies");
                }

                const data = await response.json();
                setMovies(Array.isArray(data.movies) ? data.movies : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // DELETE Function
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/deleteMovie/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Failed to delete movie");
            }

            setMovies(movies.filter(movie => movie._id !== id));
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Movie deleted successfully!',
            });
        } catch (err) {
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message,
            });
        }
    };

    // OPEN UPDATE MODAL
    const handleUpdate = (movie) => {
        setSelectedMovie({ ...movie }); // Clone movie object to allow edits
        setShowModal(true);
    };

    // HANDLE INPUT CHANGES
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedMovie(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // UPDATE MOVIE FUNCTION (Using PATCH)
    const handleUpdateSubmit = async () => {
        if (!selectedMovie) return;
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://movieapp-api-lms1.onrender.com/movies/updateMovie/${selectedMovie._id}`, {
                method: "PATCH", // FIX: Changed to PATCH (matches API)
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(selectedMovie)
            });

            if (!response.ok) {
                throw new Error("Failed to update movie");
            }

            // Update the movie list in state
            setMovies(movies.map(movie => movie._id === selectedMovie._id ? selectedMovie : movie));
            setShowModal(false);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Movie updated successfully!',
            });
        } catch (err) {
            setError(err.message);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update movie',
            });
        }
    };

    const filteredMovies = movies.filter(movie =>
        Object.values(movie).some(value =>
            typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Container>
            <h2 className="text-center my-4">Admin Dashboard</h2>
            {loading && <Spinner animation="border" className="d-block mx-auto" />}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="mb-3">
                <Col><Button variant="primary" onClick={() => navigate('/addMovie')}>Add Movie</Button></Col>
                <Col className="text-end">
                    <Form.Control 
                        type="text" 
                        placeholder="Search movies..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                </Col>
            </Row>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Director</th>
                        <th>Year</th>
                        <th>Description</th>
                        <th>Genre</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMovies.length > 0 ? (
                        filteredMovies.map((movie) => (
                            <tr key={movie._id}>
                                <td>{movie._id}</td>
                                <td>{movie.title}</td>
                                <td>{movie.director}</td>
                                <td>{movie.year}</td>
                                <td>{movie.description}</td>
                                <td>{movie.genre}</td>
                                <td>
                                    <Button variant="primary" className="me-2 mb-2" onClick={() => handleUpdate(movie)}>Update</Button>
                                    <Button variant="danger" className="mb-2" onClick={() => handleDelete(movie._id)}>Delete</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">No movies available</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* UPDATE MODAL */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Movie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedMovie && (
                        <Form>
                            <Form.Group className="mb-2">
                                <Form.Label>Title</Form.Label>
                                <Form.Control type="text" name="title" value={selectedMovie.title} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Director</Form.Label>
                                <Form.Control type="text" name="director" value={selectedMovie.director} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Year</Form.Label>
                                <Form.Control type="number" name="year" value={selectedMovie.year} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" name="description" value={selectedMovie.description} onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Genre</Form.Label>
                                <Form.Control type="text" name="genre" value={selectedMovie.genre} onChange={handleChange} />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdateSubmit}>Save Changes</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default AdminView;
