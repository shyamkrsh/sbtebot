import './App.css'
import Navbar from './Components/Navbar'
import QAPlace from './Components/QAPlace'


function App() {

  return (

    <>
      <div className='bg-cyan-50 overflow-hidden relative' style={{maxHeight: 'calc(100vh - 3.8rem)', minHeight: 'calc(100vh - 3.8rem)'}}>
        <Navbar />
        <QAPlace />
      </div>
    </>
  )
}

export default App
