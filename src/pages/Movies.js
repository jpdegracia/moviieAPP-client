import { useState, useEffect, useContext } from 'react';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import UserContext from '../UserContext';
import { Form, InputGroup, Alert } from 'react-bootstrap';

export default function Movies() {
    const { user } = useContext(UserContext);
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [errorMessage, setErrorMessage] = useState(null);

    const fetchData = () => {
        let fetchUrl = `https://movieapp-api-lms1.onrender.com/movies/getMovies`;

        fetch(fetchUrl, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => {
            console.log("Response Status:", res.status); // Log HTTP status
            return res.json();
        })
        .then(data => {
            console.log("Fetched Data:", JSON.stringify(data, null, 2)); // Log full API response for debugging

            if (Array.isArray(data)) {
                setMovies(data);
                setErrorMessage(null);
            } else if (data.movies && Array.isArray(data.movies)) {
                setMovies(data.movies);
                setErrorMessage(null);
            } else if (data.message) {
                console.error("API Error:", data.message);
                setErrorMessage(data.message);
                setMovies([]);
            } else {
                console.error("Unexpected API response:", data);
                setErrorMessage("Unexpected response from server.");
                setMovies([]);
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            setErrorMessage("Failed to fetch movies. Please try again later.");
            setMovies([]);
        });
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const filteredMovies = Array.isArray(movies) 
        ? movies.filter(movie =>
            movie?.name?.toLowerCase().includes(searchTerm.toLowerCase()) // Ensure movie.name exists
        ).sort((a, b) => {
            return sortOrder === 'asc'
                ? (a.name || "").localeCompare(b.name || "") // Avoid undefined errors
                : (b.name || "").localeCompare(a.name || "");
        })
        : [];

    return (
        user.isAdmin ? (
            <AdminView moviesData={movies} fetchData={fetchData} />
        ) : (
            <>
                <h1 className="text-center mt-5">Movies:</h1>

                <InputGroup className="mb-3 mt-5 gap-5">
                    <Form.Control
                        type="text"
                        placeholder="Search movies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Form.Select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
                        <option value="asc">Sort A-Z</option>
                        <option value="desc">Sort Z-A</option>
                    </Form.Select>
                </InputGroup>

                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

                {filteredMovies.length === 0 && !errorMessage ? (
                    <Alert variant="warning">No movies found.</Alert>
                ) : (
                    <UserView moviesData={filteredMovies} />
                )}
            </>
        )
    );
}
