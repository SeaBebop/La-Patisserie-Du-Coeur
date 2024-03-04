import React, { useState } from 'react';
import MessageExampleMessage from './Prompt';
//Testing out prompts triggering in an array
export default function MessageFixedRight(props) {
  const message = 'hello';
  const title = 'myname';
  const msgClass = 'text-red-600';
  const [prompt, setPrompt] = useState(false);

  const triggerPrompt = async () => {
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    setPrompt((prevPrompt) => !prevPrompt);

    await sleep(3000);
    
    setPrompt((prevPrompt) => !prevPrompt);
  };


return (

  <div className='flex flex-col fixed right-0 z-[10000] lg:bottom-[70vh] bottom-[30vh]'>
    <button onClick={triggerPrompt}>Click Me</button>
    {prompt == true ? <div> < MessageExampleMessage message = { message } title = { title } error = { true} /> </div> : <div> </div>}
  </div>
);
}