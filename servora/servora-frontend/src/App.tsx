
import { RouterProvider } from 'react-router-dom'
import { routes } from './app/routes'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'

const App = () => {
  const token = useSelector((state : any) => state.auth.token);

  console.log(token);
  

  return (
    <div className='bg-[#0B0B0F] text-white h-screen w-screen overflow-y-auto'>
      <RouterProvider router={routes}/>
      <Toaster/>
    </div>
  )
}

export default App