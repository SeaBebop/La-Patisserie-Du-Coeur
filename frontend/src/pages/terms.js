import { useEffect, useRef, useState } from "react"
import SVG_Story from "../components/SVG_Story";
import SVG_Location from "../components/SVG_Location";
import SVG_Star from "../components/SVG_Star";
import SVG_Food from "../components/SVG_Food";

const Terms = () => {
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
   
  
      <div className="mt-[11vw] p-[2vw] mb-[2vw] text-white flex flex-col item-center unrevealed justify-around ml-[10vw]  w-[80vw] bg-[#1a58ab] rounded-md shadow-lg">
        <p>Thank you for using our website! These terms and conditions govern your use of our website, so please read them carefully. By using our website, you agree to be bound by these terms and conditions.</p>

<p> <h1 className="underline"> Intellectual Property:</h1>
The content on our website, including text, graphics, logos, images, and software, is our property or the property of our licensors and is protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or use any of the content on our website without our express written permission.
</p>
<p> <h1 className="underline"> Use of Our Website:</h1>
You may use our website for lawful purposes only. You may not use our website to violate any laws or regulations or to infringe upon the rights of others. You may not use our website to transmit or distribute viruses, malware, or other harmful software.
</p>
<p> <h1 className="underline">Third-Party Links:</h1> 
Our website may contain links to third-party websites. We are not responsible for the content of these websites or for any damages that may arise from your use of them. We do not endorse or guarantee the accuracy of any information on third-party websites.
</p>
<p> <h1 className="underline">Disclaimer of Warranties:</h1> 

We make no warranties or representations about the accuracy or completeness of the content on our website. We do not guarantee that our website will be free from errors or interruptions. We are not responsible for any damages that may arise from your use of our website.
</p>
<p> <h1 className="underline">Limitation of Liability:</h1> 
To the fullest extent permitted by law, we are not liable for any damages that may arise from your use of our website. This includes direct, indirect, incidental, consequential, or punitive damages, even if we have been advised of the possibility of such damages.
</p>

<p> <h1 className="underline">Indemnification:</h1> 
You agree to indemnify and hold us harmless from any claims, damages, or expenses that may arise from your use of our website or from your violation of these terms and conditions.
</p>
<p> <h1 className="underline"> Changes to These Terms and Conditions:</h1>
We may update these terms and conditions from time to time by posting a new version on our website. We encourage you to review these terms and conditions periodically to stay informed about any changes.
</p>
<p> <h1 className="underline">Governing Law:</h1> 

These terms and conditions are governed by the laws of [insert governing law]. Any disputes that may arise from your use of our website will be resolved in accordance with the laws of [insert governing law].
</p>

<p> <h1 className="underline">Contact Us:</h1> 
If you have any questions or concerns about these terms and conditions, please contact us at [insert contact information].
</p>

  
  <div>
    
  </div>
      </div> 




  )
}

export default Terms