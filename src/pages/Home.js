import { Button, Row, Col } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Home() {
    const { user, setUser } = useContext(UserContext);
    

    return (
        <Row>
            <Col className="mt-5 pt-5 text-center mx-auto">
                <h1>Welcome to Zuitt Movie House Hub! 👻</h1>
                <p>
                    Dive into a world of endless entertainment! Whether you're a fan of action-packed blockbusters, heartwarming dramas, or spine-chilling thrillers, we've got something for everyone. Explore the latest releases, discover hidden gems, and relive timeless classics—all in one place.

                    Sit back, relax, and let the movie magic begin! 🎥✨
                </p>

                {/* Conditional Button for Admin & Regular User */}
                <Link className="btn btn-primary" to={user.isAdmin ? "/movies" : "/"}>
                    {user.isAdmin ? "Go to Admin Dashboard" : "View Movies"}
                </Link>

            </Col>
        </Row>
    );
}
