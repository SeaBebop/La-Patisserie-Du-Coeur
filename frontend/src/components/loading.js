import React from "react";
//Idea from https://dev.to/kirteshbansal/bouncing-dots-loader-in-react-4jng
//I see how it works, you create 3 divs that are in the form of dots
//Then make them all infinitely move up and down
//Then make the 2nd and 3rd divs have delayed animations
//Used tailwindcss animate-bounce instead, just wanted to know how keyframe works
const Loader = (props) =>{
    return (
<div className="loader mt-[4vw] flex ">
            <div className="animate-bounce bg-[#ec3c5f]">

            </div>
            <div className="animate-bounce bg-[#e6e933]">

            </div>
            <div className="animate-bounce bg-[#f1853c]">

            </div>
        </div>
      
    )
}

export default Loader