import { useEffect, useRef, useState } from "react"
import SVG_Story from "../components/SVG_Story";
import SVG_Location from "../components/SVG_Location";
import SVG_Star from "../components/SVG_Star";
import SVG_Food from "../components/SVG_Food";

const Location = () => {
  const containerRef = useRef(null);
  const [trigger,setTrigger] = useState(false);
  
  //https://i.ibb.co/hC4m8mk/40213353998.png
  //https://i.ibb.co/VtpN4L1/pexels-photo-205961.png




  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log(entry)
        entry.target.classList.add('revealed');

      }
      else {
        entry.target.classList.remove('revealed');
      }
    }
    )
  })
  useEffect(() => {
    const hiddenElements = document.querySelectorAll('.unrevealed');
    hiddenElements.forEach((el) => observer.observe(el))
  }, [containerRef])

  const backgroundURL =
    'url("https://i0.wp.com/www.society19.com/ca/wp-content/uploads/sites/2/2019/02/bakeries-vanfeatured.png?fit=768%2C576&ssl=1")';
  return (
   
  
    <div className="h-screen">
      <div className="  flex flex-row item-center unrevealed justify-around ml-[20vw] w-[50vw] ">
        <div className="flex mt-[20vw] bg-[#1a58ab]  rounded-md shadow-lg">
          <div className="flex flex-col text-white  w-[20vw] justify-center">
            <p className="font-body uppercase text-yellow-400 text-[1.6vw]">La Patisserie Du Coeur</p>
        <p className="  items-center"> 123 Rue de l'Amour, San Fraciso, California</p>
        <p className="items-center">555-123-4567</p>
        </div>
        <iframe scrolling="no" className="h-[20vw]  w-[30vw] right-0 rounded-md" marginheight="0" marginwidth="0" ref={containerRef} loading="lazy" id="gmap_canvas" src="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=123%20Rue%20de%20l'Amour%20San%20Fraciso+(La%20Patisserie%20Du%20Coeur)&amp;t=&amp;z=13&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" width="520" height="400" frameborder="0"></iframe>
       </div>
  
  <div>
    
  </div>
      </div>   
    </div>
    




  )
}

export default Location