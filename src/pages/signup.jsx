import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FirebaseContext from '../context/firebase'
import * as ROUTES from '../constants/routes'
import { doesUsernameExist } from '../services/firebase'
//signup page where user uses firebase auth

export default function SignUp() {
    const navigate  = useNavigate()
    const {firebase } = useContext(FirebaseContext)

    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [password, setPassword] = useState('')

    const [error, setError] = useState('')
    const isInvalid = password === '' || emailAddress ==='' || fullName === '' || username === ''

    const handleSignUp = async (event) => {
        event.preventDefault()

        const usernameExist = await doesUsernameExist(username)
        if (!usernameExist){
            try {
                const createdUserResult = await firebase
                .auth()
                .createUserWithEmailAndPassword(emailAddress, password)

                await createdUserResult.user.updateProfile({
                    displayName: username
                })

                await firebase.firestore().collection('users').add({
                    userId: createdUserResult.user.uid,
                    username: username.toLowerCase(),
                    fullName,
                    emailAddress: emailAddress.toLowerCase(),
                    following: [],
                    followers: [],
                    dateCreated: Date.now()
                })

                navigate(ROUTES.DASHBOARD);
            } catch (error) {
                setFullName('')
                setEmailAddress('')
                setPassword('')
                setError(error.message);
            } 
        } else {
            setUsername('')
            setError('That username is already taken, please try another.')
        }
    }

    useEffect(() => {
        document.title = 'SignUp - Instagram'
    }, [])

    return (
        <div className='container flex mx-auto max-w-screen-md items-center h-screen'>
            <div className='flex w-3/5'>
                <img src='/images/iphone-with-profile.jpg' alt='Iphone with Instagram'/>
            </div>
            <div className='flex flex-col w-2/5'>
                <div className='flex flex-col items-center bg-white p-4 border border-gray-primary rounded mb-4'>
                <h1 className='flex justify-center w-full'>
                    <div className='text-2xl font-bold mt-2'>
                        NOT 
                    </div> 
                    <img src='/images/logo.png' alt='Instagram' className='mt-2 w-6/12 mb-4 ml-2' />
                </h1>
                {error && <p className='mb-4 text-xs text-red-primary'>{error}</p>}
                <form onSubmit={handleSignUp} method='POST'>
                    <input
                        aria-label='Enter your username'
                        type='text'
                        placeholder='Username'
                        className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
                        onChange={({target}) => setUsername(target.value)}
                        value={username}
                    />
                    <input
                        aria-label='Enter your full name'
                        type='text'
                        placeholder='Full name'
                        className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
                        onChange={({target}) => setFullName(target.value)}
                        value={fullName}
                    />
                    <input
                        aria-label='Enter your email address'
                        type='text'
                        placeholder='Email address'
                        className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
                        onChange={({target}) => setEmailAddress(target.value)}
                        value={emailAddress}
                    />
                    <input
                        aria-label='Enter your password'
                        type='password'
                        placeholder='Password'
                        className='text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2'
                        onChange={({target}) => setPassword(target.value)}
                        value={password}
                    />
                    <button
                        disabled={isInvalid}
                        type='submit'
                        className={`bg-blue-medium text-white w-full rounded-md h-8 font-bold ${isInvalid && 'opacity-50'}`}
                    >
                        Sign up
                    </button>
                </form>
                </div>
                <div className='flex justify-center items-center flex-col w-full bg-white p-4 border border-gray-primary rounded'>
                    <p className='text-sm'>Have an account?{' '}
                        <Link to='/login' className='font-bold text-blue-medium'>
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}