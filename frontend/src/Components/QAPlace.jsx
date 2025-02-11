import React, { useState, useRef, useEffect } from 'react';
import { LuSendHorizontal } from "react-icons/lu";
import { io } from 'socket.io-client';
import { FaPlus } from "react-icons/fa";
import { motion } from 'framer-motion';

const socket = io("https://sbtebotbackend.vercel.app", { autoConnect: false });

function QAPlace() {
  const [value, setValue] = useState("");
  const chatRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.connect();
    
    socket.on("answers", (ans) => {
      setAnswers((prevAnswers) => {
        let newAnswers = [...prevAnswers, ans];
        localStorage.setItem("answers", JSON.stringify(newAnswers));
        return newAnswers;
      });
      setLoading(false);
    });

    return () => {
      socket.off("answers");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const storedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
    const storedAnswers = JSON.parse(localStorage.getItem("answers")) || [];
    setQuestions(storedQuestions);
    setAnswers(storedAnswers);
  }, []);

  let handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    socket.emit("question", value);
    setLoading(true);

    setQuestions((prevQuestions) => {
      let newQuestions = [...prevQuestions, value];
      localStorage.setItem("questions", JSON.stringify(newQuestions));
      return newQuestions;
    });

    setValue("");
  };

  let builtQuestion = (data) => {
    socket.emit("question", data);
    setLoading(true);

    setQuestions((prevQuestions) => {
      let newQuestions = [...prevQuestions, data];
      localStorage.setItem("questions", JSON.stringify(newQuestions));
      return newQuestions;
    });
  };

  return (
    <>
      <div className='flex items-center justify-between h-[3.8rem] bg-white py-2 px-4 sticky top-0 left-0 z-50' style={{ boxShadow: '-1px 0px 2px gray' }}>
        <img src="https://i.ibb.co/0RkP7K2z/sbte-logo.png" className='w-[2.5rem] h-[2.5rem] cursor-pointer' />
        <h1 className='text-2xl font-semibold text-cyan-500 font-serif'>SBTE AI BOT</h1>
        <div className='cursor-pointer cardBtn' onClick={() => { localStorage.clear(); setQuestions([]); setAnswers([]); }}>
          <FaPlus className='text-2xl text-white' />
        </div>
      </div>

      <div className='w-[100%] relative p-2 bg-cyan-50 overflow-y-auto text-black pb-16' style={{ maxHeight: 'calc(100vh - 6.8rem)' }} ref={chatRef}>
        {questions.map((question, index) => (
          <div key={index}>
            <div className='w-[100%] flex justify-end'>
              <motion.div initial={{ opacity: 0.4, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="chat chat-end" style={{ minWidth: '70%' }}>
                <div className="chat-bubble bg-cyan-200 text-slate-700 ">{question}</div>
              </motion.div>
            </div>
            <div className='w-[100%] p-1'>
              <h3 className='px-2 font-bold mb-1'><img src="https://i.ibb.co/F4hW40tv/robot-3559850.png" className='w-[1.8rem] h-[1.5rem]' /></h3>
              <motion.div initial={{ opacity: 0.4, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={answers[index] ? "chat chat-start" : 'hidden'}>
                <div className="chat-bubble bg-white shadow-sm text-slate-700">{answers[index]}</div>
              </motion.div>
            </div>
          </div>
        ))}
        {loading && <div className='ms-3 w-[3rem] h-[2rem] bg-slate-100 border grid place-items-center rounded-lg'><span className="loading loading-dots loading-md text-slate-950"></span></div>}
      </div>

      <form onSubmit={handleSubmit}>
        <div className='w-[100%] h-[5rem] fixed bottom-0 bg-cyan-50 flex items-center justify-center'>
          <div className='flex items-center bg-white justify-between w-[85%]' style={{ borderRadius: '2rem', border: '1px solid gray' }}>
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder='Ask your questions ...' className='h-[2.3rem] px-4 bg-white w-full text-slate-800' />
            <button type='submit' className='searchBtn p-1 rounded-full'><LuSendHorizontal className='text-white text-3xl' /></button>
          </div>
        </div>
      </form>
    </>
  );
}

export default QAPlace;
