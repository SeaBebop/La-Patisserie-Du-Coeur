import React, { useState } from 'react';
import MessageExampleMessage from './Prompt';

export default function MessageFixedTest() {
  const message = 'hello';
  const title = 'myname';
  const msgClass = 'text-red-600';
  const [promptList, setPromptList] = useState([]);

  const triggerPrompt = async () => {
    const newList = [...promptList, <MessageExampleMessage message={message} title={title} error={true} />];
    setPromptList(newList);

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(1000);

    const updatedList = promptList.slice(1); // remove the first element
    setPromptList(updatedList);
  };

  const Visual =  () => {
    return (
      promptList.map((item, index) => (
        <div key={index}>
          {item}
        </div>
      ))
    );
  };

  return (
    <div className='flex flex-col fixed right-0 z-[10000] mt-[10vw]'>
      <button onClick={triggerPrompt}>Click Me</button>
      <Visual />
    </div>
  );
}