import { Typography } from '@mui/material'
import SignupForm from '../components/SignupForm'
import LogoAnimation from '../components/LogoAnimation'


const Signup = () => {
  return (
    <div className='w-[80%] mx-auto mt-1 flex flex-row'>
        {/* signup form */}
        <div className='flex flex-col gap-3 w-[50%]'>

           <div>
               <Typography variant="h3" sx={{fontWeight:600}} gutterBottom >
            <span>Sign</span> <span className='text-yellow-400'>Up</span>
           </Typography>
           <p className='text-gray-100 '>Fill the form below to create your account</p>
        </div>

            <div >
                <SignupForm/>
            </div>

        </div>
         
         {/* signup animation */}
        <div className='w-[50%] flex items-center justify-center'>
            <LogoAnimation/>
        </div>
    </div>
  )
}

export default Signup