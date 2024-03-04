import * as React from "react";
const SVG_Cart = (props) => (
    <svg
    width='1.7vw'
    height='1.7vw'
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path fill="black" fillOpacity={0.01} d="M0 0h48v48H0z" />
    <path d="M39 32H13L8 12h36l-5 20Z" fill="red" />
    <path
      d="M3 6h3.5L8 12m0 0 5 20h26l5-20H8Z"
      stroke="white"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx={13}
      cy={39}
      r={3}
      stroke="white"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx={39}
      cy={39}
      r={3}
      stroke="white"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 22h8m-4 4v-8"
      stroke="red"
      strokeWidth={4}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default SVG_Cart;