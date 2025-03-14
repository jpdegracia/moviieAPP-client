import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container, } from 'react-bootstrap';
import { Navigate, Link } from 'react-router-dom'; 
import Swal from 'sweetalert2';

import UserContext from '../UserContext';

export default function Login() {

    const { user, setUser } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isActive, setIsActive] = useState(true);

    const retrieveUserDetails = (token) => {
        
        fetch(`https://movieapp-api-lms1.onrender.com/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            setUser({
              id: data.user._id,
              isAdmin: data.user.isAdmin
            });
        })
    };

    function authenticate(e) {
        e.preventDefault();

        fetch(`https://movieapp-api-lms1.onrender.com/users/login`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {
            
            if(data.access){

                localStorage.setItem('token', data.access);
                retrieveUserDetails(data.access);

                Swal.fire({
                    title: "Login Successful",
                    icon: "success",
                    iconColor: "#FF99CC",
                    text: "Welcome to Workout Hub!",
                    showConfirmButton: false,
                    timer: 1500
                });
            
            } else if (data.error === "No Email Found") {

                Swal.fire({
                    title: "Email not found.",
                    icon: "error",
                    text: "Check the email you provided."
                });

            } else {

                Swal.fire({
                    title: "Authentication failed",
                    icon: "error",
                    text: "Check your login details and try again."
                });
            }
        })
        
        setEmail('');
        setPassword('');
    }

    useEffect(() => {

        if(email !== '' && password !== ''){
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [email, password]);

    return (
        (user.id !== null) ?
            <Navigate to="/" />
        :
            <Container fluid >
                <div className='row mt-5 pt-5'>
                    <div className='col-md-4 mx-auto'>
                        <Form onSubmit={(e) => authenticate(e)} className="w-100">
                            <h1 className="text-center">Login</h1>

                            <Form.Group className="mt-4">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control type="email" placeholder="Enter Email" required value={email} onChange={e => {setEmail(e.target.value)}}/>
                            </Form.Group>

                            <Form.Group className="mt-2 mb-4">
                                <Form.Label className="lato-90">Password:</Form.Label>
                                <Form.Control type="password" placeholder="Enter Password" required value={password} onChange={e => {setPassword(e.target.value)}}/>
                            </Form.Group>

                            <Container className="text-center">
                                {
                                    isActive ? 
                                        <Button type="submit" className="btn-primary py-2 px-4">Log In</Button> 
                                    : 
                                        <Button className="btn-primary py-2 px-4" disabled>Log In</Button>     
                                }
                            </Container>                        
                        </Form>
                    </div>
                </div>

            </Container>
    )
}