import { Typography } from '@mui/material'
import LogoAnimation from '../components/LogoAnimation'
import LoginForm from '../components/LoginForm'


const Login = () => {
  return (
    <div className='w-[80%] mx-auto mt-1 flex flex-row'>
        {/* signup form */}
        <div className='flex flex-col gap-3 w-[50%]'>

           <div>
               <Typography variant="h3" sx={{fontWeight:600}} gutterBottom >
            <span>Welcome</span> <span className='text-yellow-400'>!</span>
           </Typography>
           <p className='text-gray-100 '>Login to servora to continue to servora</p>
        </div>

            <div className='mt-28'>
              <LoginForm/>
            </div>

        </div>
         
         {/* signup animation */}
        <div className='w-[50%] flex items-center justify-center mt-44'>
            <LogoAnimation/>
        </div>
    </div>
  )
}

export default Login