"use client"
import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { useRouter } from 'next/navigation';

function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}/admin/login`, {
                username,
                password
            });
            localStorage.setItem('token', response.data.data.token);
            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            // Display generic error message
            setError('Incorrect username or password');
        }
    };

    return (
        <div className='loginContainer overflow-hidden'>
            <Card shadow={false} className='w-fit py-[60px] px-[50px] m-auto mt-[150px]'>
                <Typography variant="h4" color="blue-gray">
                    Sign In
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Nice to meet you !
                </Typography>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleLogin} className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-6">
                        <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        <Input label="Password" type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="mt-10" fullWidth>
                        Sign In
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default Login;
