import { useState, useEffect, useContext } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import UserContext from '../UserContext';

export default function Register() {
    const { user } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsActive(email !== "" && password !== "");
    }, [email, password]);

    function registerUser(e) {
        e.preventDefault();

        fetch(`https://movieapp-api-lms1.onrender.com/users/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.message === "Registered Successfully") {
                setEmail('');
                setPassword('');
                Swal.fire({
                    title: 'Success!',
                    text: 'Registration successful',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                let errorMessage = "Something went wrong.";
                if (data.message === "Email invalid") {
                    errorMessage = "Email is invalid";
                } else if (data.message === "Password must be atleast 8 characters long") {
                    errorMessage = "Password must be at least 8 characters";
                }
                Swal.fire({
                    title: 'Error',
                    text: errorMessage,
                    icon: 'error'
                });
            }
        });
    }

    return (
        user.id !== null ?
            <Navigate to="/" />
        :
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4" style={{ width: '400px', boxShadow: '0px 0px 10px rgba(0,0,0,0.1)' }}>
                <h1 className="text-center">Register</h1>
                <Form onSubmit={registerUser}>
                    <Form.Group>
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    {!isActive && (
                        <Alert variant="danger" className="mt-3 text-center">
                            Please enter your registration details
                        </Alert>
                    )}
                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 mt-3"
                        disabled={!isActive}
                    >
                        Register
                    </Button>
                </Form>
                <p className="text-center mt-3">
                    Already have an account? <Link to="/login">Click here</Link> to log in.
                </p>
            </Card>
        </div>
    );
}