import './App.css'
import Navbar from './Components/Navbar'
import QAPlace from './Components/QAPlace'


function App() {

  return (

    <>
      <div className='bg-cyan-50' style={{ maxHeight: '100vh', minHeight: '100vh' }}>
        <Navbar />
        <QAPlace />
      </div>
    </>
  )
}

export default App
