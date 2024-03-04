import React from 'react'
import { MessageHeader, Message } from 'semantic-ui-react'
export default function MessageExampleMessage(props) {
  const message = props.message
  const title = props.title
  const msgClass = props.error === true ? 'text-red-600' : 'text-blue-600'
  return (
    < div className={"bg-[#f8f8f9] border-[#c9cacb] border rounded-md flex justify-start flex-col items-start px-[1.3vw] py-[.7vw]"}>
      <p className={"font-bold text-black"}>{title}</p>
      <p className={msgClass}>{message}</p>

    </div>
  )
}
