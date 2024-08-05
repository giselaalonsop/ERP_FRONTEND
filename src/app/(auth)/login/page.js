
'use client'

import Button from '@/components/Button'
import Input from '@/components/Input'
import InputError from '@/components/InputError'
import Label from '@/components/Label'
import Link from 'next/link'
import { useAuth } from '@/hooks/auth'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthSessionStatus from '@/app/(auth)/AuthSessionStatus'
import useConfiguracion from '@/hooks/useConfiguracion'

const Login = () => {
    const router = useRouter()
    
    const {
        logo,
        loading,
    } = useConfiguracion()
    const { login } = useAuth({
        middleware: 'guest',
        redirectIfAuthenticated: '/dashboard',
    })

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [shouldRemember, setShouldRemember] = useState(false)
    const [errors, setErrors] = useState([])
    const [status, setStatus] = useState(null)
    const [img, setImg] = useState('')
    useEffect(() => {
        if(loading){
            return
        }
        if(logo){
            const logoPath = `http://localhost:8000/${logo}`
            setImg(logoPath)
        }
    }
    ,[logo])
    useEffect(() => {
        if (router.reset?.length > 0 && errors.length === 0) {
            setStatus(atob(router.reset))
        } else {
            setStatus(null)
        }
    })
   

    const submitForm = async event => {
        event.preventDefault()

        login({
            email,
            password,
            remember: shouldRemember,
            setErrors,
            setStatus,
        })
    }
    if (loading) {
        return <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center p-10">Loading...</div>
    }
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 flex items-center justify-center p-10">
            <div className="max-w-screen-xl bg-white shadow sm:rounded-lg flex justify-center flex-1 h-full overflow-hidden">
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col justify-center">
                    <div className="text-center">
                        <img
                            src={img || `https://storage.googleapis.com/devitary-image-host.appspot.com/15846435184459982716-LogoMakr_7POjrN.png`}
                            className="w-50 h-auto mx-auto"
                                    />
                    </div>

                    <div className="mt-12 flex flex-col items-center">
                        <h1 className="text-2xl xl:text-3xl font-extrabold">
                            Iniciar Sesión
                        </h1>
                        <div className="w-full flex-1 mt-8">
                            <div className="flex flex-col items-center">
                                
                               
                            </div>
                            
                            <AuthSessionStatus status={status} />
                            <form onSubmit={submitForm}>
                                <div className="mx-auto max-w-xs">
                                    <div>
                                        <Label htmlFor="email">Correo Electronico</Label>
                                        <Input
                                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={event =>
                                                setEmail(event.target.value)
                                            }
                                            required
                                            autoFocus
                                            placeholder="Ingrese un correo electronico"
                                        />
                                        <InputError
                                            messages={errors.email}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <Label htmlFor="password">Contraseña</Label>
                                        <Input
                                            className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={event =>
                                                setPassword(event.target.value)
                                            }
                                            required
                                            autoComplete="current-password"
                                        />
                                        <InputError
                                            messages={errors.password}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="block mt-4">
                    <label
                        htmlFor="remember_me"
                        className="inline-flex items-center">
                        <input
                            id="remember_me"
                            type="checkbox"
                            name="remember"
                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            onChange={event =>
                                setShouldRemember(event.target.checked)
                            }
                        />

                        <span className="ml-2 text-sm text-gray-600">
                           Recordarme
                        </span>
                    </label>
                </div>


                                    
                                    <Button className="mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                        <svg
                                            className="w-6 h-6 -ml-2"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round">
                                            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                            <circle cx="8.5" cy={7} r={4} />
                                            <path d="M20 8v6M23 11h-6" />
                                        </svg>
                                        <span className="ml-3">Ingresar</span>
                                    </Button>
                                   
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                'url("https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg")',
                        }}>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default Login
