'use client';
import { useAuth } from '@/hooks/auth';
import Button from '@/components/Button';
import Input from '@/components/Input';
import InputError from '@/components/InputError';
import Label from '@/components/Label';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const Register = () => {
    const { register } = useAuth({ middleware: 'guest', redirectIfAuthenticated: '/dashboard' });

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState([]);

   
    const submitForm = async event => {
        event.preventDefault();

        register({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            setErrors,
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center overscroll-none">
            <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div>
                        <img src="https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png" className="w-32 mx-auto" />
                    </div>
                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>
                        <div className="w-full flex-1 mt-8">
                            <form onSubmit={submitForm}>
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" type="text" value={name} className="block mt-1 w-full" onChange={event => setName(event.target.value)} required autoFocus />
                                    <InputError messages={errors.name} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={email} className="block mt-1 w-full" onChange={event => setEmail(event.target.value)} required />
                                    <InputError messages={errors.email} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" value={password} className="block mt-1 w-full" onChange={event => setPassword(event.target.value)} required autoComplete="new-password" />
                                    <InputError messages={errors.password} className="mt-2" />
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="passwordConfirmation">Confirm Password</Label>
                                    <Input id="passwordConfirmation" type="password" value={passwordConfirmation} className="block mt-1 w-full" onChange={event => setPasswordConfirmation(event.target.value)} required />
                                    <InputError messages={errors.password_confirmation} className="mt-2" />
                                </div>
                                
                                <div className="flex items-center justify-end mt-4">
                                    <Link href="/login" className="underline text-sm text-gray-600 hover:text-gray-900">Already registered?</Link>
                                    <Button className="ml-4">Register</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat" style={{ backgroundImage: 'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")' }}></div>
                </div>
            </div>
        </div>
    );
};

export default Register;
