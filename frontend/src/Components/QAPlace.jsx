import React, { useState, useRef, useEffect } from 'react'
import { LuSendHorizontal } from "react-icons/lu";
import { io } from 'socket.io-client'
import { FaPlus } from "react-icons/fa";
import { motion } from 'framer-motion'

function QAPlace() {
  const [value, setValue] = useState("");
  const chatRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify([]));
    localStorage.setItem('answers', JSON.stringify([]));
  }, [])

  if (!localStorage.getItem('questions')) {
    localStorage.setItem('questions', JSON.stringify([]));
  }
  if (!localStorage.getItem('answers')) {
    localStorage.setItem('answers', JSON.stringify([]));
  }
  const socket = io(`${import.meta.env.VITE_API_URL}`, {
    withCredentials: true
  });

  let handleSubmit = async (e) => {
    e?.preventDefault();
    socket.emit("question", value);
    let prevQuestions = JSON.parse(localStorage.getItem('questions'));
    prevQuestions.push(value);
    localStorage.setItem('questions', JSON.stringify(prevQuestions));
    setQuestions(JSON.parse(localStorage.getItem('questions')));
    setLoading(true);

    socket.on("answers", (ans) => {
      let prevAnswers = JSON.parse(localStorage.getItem('answers'));
      prevAnswers.push(ans);
      localStorage.setItem('answers', JSON.stringify(prevAnswers));
      setAnswers(JSON.parse(localStorage.getItem('answers')));
      setLoading(false);
    })
    setValue("");
  }

  let builtQuestion = (data) => {
    socket.emit("question", data);
    let prevQuestions = JSON.parse(localStorage.getItem('questions'));
    prevQuestions.push(data);
    localStorage.setItem('questions', JSON.stringify(prevQuestions));
    setQuestions(JSON.parse(localStorage.getItem('questions')));
    setLoading(true);

    socket.on("answers", (ans) => {
      let prevAnswers = JSON.parse(localStorage.getItem('answers'));
      prevAnswers.push(ans);
      localStorage.setItem('answers', JSON.stringify(prevAnswers));
      setAnswers(JSON.parse(localStorage.getItem('answers')));
      setLoading(false);
    })
    setValue("");
  }


  return (
    <>
      <div className='flex items-center justify-between h-[3.8rem] bg-white py-2 px-4 sticky top-0 left-0 z-50' style={{ boxShadow: '-1px 0px 2px gray' }}>
        <div className='cursor-pointer'>
          <img src="https://i.ibb.co/0RkP7K2z/sbte-logo.png" className='w-[2.5rem] h-[2.5rem]' />
        </div>
        <h1 className='text-2xl font-semibold text-cyan-500 font-serif'>SBTE AI BOT</h1>
        <div className='cursor-pointer cardBtn' onClick={() => { localStorage.removeItem('questions'), localStorage.removeItem('answers'), setQuestions([]), setAnswers([]) , setLoading(false)}}>
          <FaPlus className='text-2xl text-white' />
        </div>
      </div>

      <div className='w-[100%] relative px-2 pt-2 pb-[6rem] bg-cyan-50 overflow-x-hidden overflow-y-auto text-black md:pb-4' style={{ maxHeight: 'calc(100vh - 6.8rem)', minHeight: 'calc(100vh - 6.8rem)', scrollbarWidth: 'none', msOverflowStyle: 'none' }} ref={chatRef} >
        {
          questions?.map((question, index) => {
            return (
              <div key={index}>
                <div className='w-[100%] flex justify-end'>
                  <motion.div
                    initial={{ opacity: 0.4, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="chat chat-end" style={{ minWidth: '70%' }}>
                    <div className="chat-bubble bg-cyan-200 text-slate-700 ">{question}</div>
                  </motion.div>
                </div>
                <div className='w-[100%] p-1'>
                  <h3 className='px-2 font-bold mb-1'><img src="https://i.ibb.co/F4hW40tv/robot-3559850.png" className='w-[1.8rem] h-[1.5rem]' /> </h3>
                  <motion.div
                    initial={{ opacity: 0.4, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={answers[index] ? "chat chat-start" : 'hidden'}>
                    <div className="chat-bubble bg-white shadow-sm text-slate-700">
                      {answers[index]?.replace(/\*\*(.*?)\*\*/g, '\n $1 \n')
                        .split("\n")
                        .map(line => line.trim())
                        .filter(line => line !== "")
                        .join("\n")}
                    </div>
                  </motion.div>
                </div>
              </div>
            )
          })
        }

        <div className={questions.length == 0 ? 'w-[96%] h-[10rem]  mx-auto mt-[60%]' : "hidden"}>
          <img src="https://i.ibb.co/F4hW40tv/robot-3559850.png" className='w-[4rem] h-[4rem] mx-auto' />
          <p className='py-1 px-2 bg-cyan-500 rounded-full text-center text-white mt-5' onClick={() => builtQuestion("When 6th Semester SBTE Exam will be conducted ?")}>When 6th Semester SBTE Exam will be conducted ?</p>
          <p className='py-1 px-2 bg-cyan-500 rounded-full text-center text-white mt-1' onClick={() => builtQuestion("Why my result is showing pending ?")}>Why my result is showing pending ?</p>
          <p className='py-1 px-2 bg-cyan-500 rounded-full text-center text-white mt-1' onClick={() => builtQuestion("How to check result ?")}>How to check result ?</p>
        </div>



        <div className={loading ? 'ms-3 w-[3rem] h-[2rem]  grid place-items-center rounded-lg ' : 'hidden'}>
          <span className="loading loading-dots loading-md text-slate-950"></span>
        </div>
      </div >

      <form onSubmit={handleSubmit}>
        <div className='w-[100%] h-[5rem] fixed bottom-0 bg-cyan-50 flex items-center justify-center'>
          <div className='flex items-center bg-white justify-between w-[85%]' style={{ borderRadius: '2rem', border: '1px solid gray' }}>
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder='Ask your questions ...' className='h-[2.3rem] px-4 bg-white  outline-none w-full text-slate-800' style={{ borderRadius: '2rem' }} />
            <button type='submit' className='searchBtn  p-1  rounded-full m-0.5 cursor-pointer hover:opacity-80'>
              <LuSendHorizontal className='text-white text-3xl' />
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default QAPlace