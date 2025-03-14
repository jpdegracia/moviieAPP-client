import React, { useEffect, useState } from "react";
import { Container, Row, Col, Spinner, Alert, Form } from "react-bootstrap";
import MovieCard from "./MovieCard";

const UserView = () => {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]); // Stores search results
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // Search input state

    useEffect(() => {
        const fetchMovies = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch("https://movieapp-api-lms1.onrender.com/movies/getMovies", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch movies: ${response.status}`);
                }

                const data = await response.json();
                console.log("Fetched movies:", data); // Debugging

                const movieList = Array.isArray(data.movies) ? data.movies : [];
                setMovies(movieList);
                setFilteredMovies(movieList); // Initialize filteredMovies with all movies
            } catch (err) {
                console.error("Error fetching movies:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Search function to filter movies
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();

        const results = movies.filter(movie =>
            movie.title.toLowerCase().includes(lowerCaseQuery) ||
            movie.director.toLowerCase().includes(lowerCaseQuery) ||
            movie.genre.toLowerCase().includes(lowerCaseQuery) ||
            movie.description.toLowerCase().includes(lowerCaseQuery) ||
            movie.year.toString().includes(lowerCaseQuery) // Convert year to string for searching
        );

        setFilteredMovies(results);
    }, [searchQuery, movies]);

    return (
        <Container>
            <h2 className="text-center my-4">User View - Movie List</h2>

            {/* Centered Search Bar */}
            <Form className="d-flex justify-content-center mb-4">
                <Form.Control
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-50 text-center"
                />
            </Form>

            {loading && <Spinner animation="border" className="d-block mx-auto" />}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && filteredMovies.length === 0 && (
                <p className="text-center">No movies found</p>
            )}

            <Row>
                {filteredMovies.map((movie) => (
                    <Col key={movie._id} md={4} sm={6} xs={12}>
                        <MovieCard movie={movie} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default UserView;