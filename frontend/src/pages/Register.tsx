import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUserData } from '../context/UserContext'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('')
  const navigate = useNavigate();
  const [password, setPassword] = useState('')
  const { btnLoading, registerUser } = useUserData();

  async function submitHandler(event: any) {
    event.preventDefault();
    registerUser(email, name, password, navigate);
  }

  return (
    <div className='flex items-center justify-center h-screen max-h-screen'>
      <div className="bg-black text-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-semibold text-center mb-8">Register to Spotify</h2>
        <form className="mt-8" onSubmit={submitHandler}>
          <div className="mb-4 ">
            <label className='block text-sm font-medium mb-1'>Name</label>
            <input type="text" name="" id="" placeholder='Enter Name' className='auth-input' required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="mb-4 ">
            <label className='block text-sm font-medium mb-1'>Email or Username</label>
            <input type="email" name="" id="" placeholder='Email or Username' className='auth-input' required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="mb-4 ">
            <label className='block text-sm font-medium mb-1'>Password</label>
            <input type="password" name="" id="" placeholder='Enter Password' className='auth-input' required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button disabled={btnLoading} className='auth-btn'>{btnLoading ? "Please Wait" : "Register"} </button>
        </form>
        <div className="text-center mt-6">
          <Link to={"/login"} className='text-sm text-gray-400 hover:text-gray-300'>Already have an account ? </Link>
        </div>
      </div>
    </div>
  )
}

export default Register
