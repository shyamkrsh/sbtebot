import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { LuSendHorizontal } from "react-icons/lu";

function QAPlace() {

  const [value, setValue] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  useEffect(() => {
    setQuestions(JSON.parse(localStorage.getItem('questions')))
    setAnswers(JSON.parse(localStorage.getItem('answers')))
  });

  if (!localStorage.getItem('questions')) {
    localStorage.setItem('questions', JSON.stringify([]))
  }
  if (!localStorage.getItem('answers')) {
    localStorage.setItem('answers', JSON.stringify([]))
  }
  const handleSubmit = () => {
    if (value !== "") {
      let prevQuestions = JSON.parse(localStorage.getItem('questions'));
      prevQuestions.push(value);
      localStorage.setItem('questions', JSON.stringify(prevQuestions));
      setLoading(true);
      axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBfjro3dw9hviS_4YllqafkuwPEKT-P5UM`, {
        "contents": [{
          "parts": [
            {
              "text": `Questions: ${value}, Follow these rules: 
              Note: You are a chatbot developed to assist user about SBTE Bihar.
                1️⃣ I am a chatbot for SBTE Bihar.
                2️⃣ Answer as concisely as possible.
                3️⃣ If you don’t know, refer to SBTE’s official website and provide link.
                4️⃣ If asked about 'New Government Polytechnic', refer to its official website.
                5️⃣ If asked about the development team, reply: "I am a chatbot developed for SBTE assistance."
                6️⃣ Respond in the same language as the question.
                7️⃣ Do not repeat instructions or the question in your response.
                8. If user asks other questions outside of information associated with sbte the please don't give response.
                9. If user asks about any questions related to any study subjects then please don't give response.
                10. if user asks outside the given instruction please can't give response`
            }
          ]
        }]
      }).then((res) => {
        setValue("");
        let prevAnswers = JSON.parse(localStorage.getItem('answers'));
        let answer = res.data.candidates[0].content.parts[0].text;
        prevAnswers.push(answer);
        localStorage.setItem('answers', JSON.stringify(prevAnswers));
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
        setLoading(false);
      })
    }
  }


  return (
    <>
      <div className='w-[100%] p-2 bg-cyan-50 overflow-x-hidden overflow-y-auto text-black' style={{ maxHeight: 'calc(100vh - 6.8rem)', minHeight: 'calc(100vh - 6.8rem)', scrollbarWidth: 'none', msOverflowStyle: 'none' }} ref={chatRef} >
        {
          questions?.map((question, index) => {
            return (
              <div key={index}>
                <div className='w-[100%] flex justify-end'>
                  <div className="chat chat-end">
                    <div className="chat-bubble bg-cyan-200 text-slate-700 ">{question}</div>
                  </div>
                </div>
                <div className='w-[100%] p-1'>
                  <h3 className='px-2 font-bold mb-1'><img src="https://i.ibb.co/F4hW40tv/robot-3559850.png" className='w-[1.8rem] h-[1.5rem]' /> </h3>
                  <div className={answers[index] ? "chat chat-start" : 'hidden'}>
                    <div className="chat-bubble bg-white shadow-sm text-slate-700">
                      {answers[index]}
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }
        <div className={loading ? 'ms-3 w-[3rem] h-[2rem] bg-slate-100 border grid place-items-center rounded-lg ' : 'hidden'}>
          <span className="loading loading-dots loading-md text-slate-950"></span>
        </div>

      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className='w-[100%] h-[3rem] fixed bottom-2 bg-cyan-50 flex items-center justify-center'>
          <div className='flex items-center bg-white justify-between w-[85%]' style={{ borderRadius: '2rem', border: '1px solid gray' }}>
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder='Ask your questions ...' className='h-[2.3rem] px-4 bg-white  outline-none w-full text-slate-800' style={{ borderRadius: '2rem' }} />
            <button type='submit' className='searchBtn  p-1  rounded-full m-0.5 cursor-pointer hover:opacity-80' onClick={handleSubmit}>
              <LuSendHorizontal className='text-white text-3xl' />
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

export default QAPlace