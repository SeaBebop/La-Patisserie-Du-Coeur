import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { ChakraProvider, Button, HStack, Input, Flex } from '@chakra-ui/react';
import { useNumberInput } from '@chakra-ui/react';
import { useState } from 'react';
export default function QuantityInput(props) {
  const total = props.total
  const name = props.name
  const low = total === 0 ? 0 : 1


  const [value,setValue] = useState(low);
  const dec = () =>{ value > 0 ? setValue(Math.abs(value-1)) : setValue(value)}
  const inc = () =>{ value < total ? setValue(value+1) : setValue(value)}

  if (total === 0) {
    return (
      <div>
        <div className='lg:hidden flex-row  lg:gap-[.5vw] gap-[1vw] flex '>


              
              <div  className='lg:px-[.4vw] lg:py-[.1vw] p-[1vw]  select-none rounded-sm bg-red-400' disabled={true}>-</div>
              <input id={name} type='number' disabled={true} />
              <div   className='lg:px-[.4vw] lg:py-[.1vw] p-[1vw]  select-none rounded-sm bg-blue-200' disabled={true} >+</div>


        </div>
        <div className='lg:flex flex-row hidden lg:gap-[.5vw] gap-[1vw] ' >
  
              <div   className='lg:px-[.4vw] lg:py-[.1vw] p-[1vw]  select-none rounded-sm bg-red-600' disabled={true} >-</div>
              <input id={name}  type='number'  disabled={true} />
              <div   className='lg:px-[.4vw] lg:py-[.1vw] p-[1vw]  select-none rounded-sm bg-blue-300' disabled={true}>+</div>
        </div>
      </div>

    )
  }



  return (
    <div>
      <div className='lg:hidden flex cursor-pointer lg:gap-[.5vw]  gap-[1vw] flex-row '>
          <div type='' className='lg:px-[.4vw] lg:py-[.1vw] p-[1vw] select-none  rounded-sm bg-red-600' onClick={dec} >-</div>
          <input id={name}  type='number'  value={value} min={low} max={total} />
          <div className='lg:px-[.4vw] lg:py-[.1vw] p-[1vw] select-none rounded-sm bg-blue-300'  onClick={inc}>+</div>
      </div>
      <div className='lg:flex hidden cursor-pointer lg:gap-[.5vw] gap-[1vw] flex-row' >
          <div  className='lg:px-[.4vw] lg:py-[.1vw] p-[1vw] select-none rounded-sm bg-red-600' onClick={dec} >-</div>
          <input id={name}  type='number'  value={value} min={low} max={total} />
          <div  className='lg:px-[.4vw] lg:py-[.1vw] p-[1vw]  select-none rounded-sm bg-blue-300' onClick={inc} >+</div>
      </div>
    </div>

  )
}