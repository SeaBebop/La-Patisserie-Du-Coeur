import { useEffect, useRef, useState } from "react"
import SVG_Story from "../components/SVG_Story";
import SVG_Location from "../components/SVG_Location";
import SVG_Star from "../components/SVG_Star";
import SVG_Food from "../components/SVG_Food";

const Privacy = () => {
  const containerRef = useRef(null);
  const [trigger,setTrigger] = useState(false);
  
  //https://i.ibb.co/hC4m8mk/40213353998.png
  //https://i.ibb.co/VtpN4L1/pexels-photo-205961.png




  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {

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
   
  
      <div className="lg:mt-[11vw] mt-[20vw] p-[2vw] min-h-[750px] mb-[2vw] text-black flex flex-col item-center unrevealed justify-around ml-[10vw]  w-[80vw]  bg-[#ff6e61a9]  rounded-md shadow-lg">
        <p>
        Thank you for visiting our website! We value your privacy and are committed to protecting it. This privacy policy explains how we collect, use, and safeguard your personal information when you visit our website.
        </p>
        <p><h1 className="underline"> Information Collection:</h1>
When you visit our website, we may collect certain information about you, such as your name, email address, and other contact details. We may also collect information about your browsing behavior, such as the pages you visit and the links you click on.
</p>
<p><h1 className="underline">Use of Information:</h1>
We use the information we collect to provide and improve our services, respond to inquiries, and communicate with you about our products and services. We may also use your information to personalize your experience on our website and to send you promotional materials or other information that may be of interest to you.
</p>
<p><h1 className="underline">Information Sharing:</h1>
We do not share your personal information with third parties except as necessary to provide our services or as required by law. We may share your information with our service providers, such as our web hosting provider or email service provider, but only to the extent necessary to provide our services.
</p>

<p><h1 className="underline">Data Security:</h1>
We take reasonable measures to protect your personal information from unauthorized access, disclosure, or use. However, no data transmission over the internet or other network can be guaranteed to be 100% secure, so we cannot guarantee the security of your information.
</p>
<p><h1 className="underline">Cookies:</h1>
We use cookies to collect information about your browsing behavior on our website. Cookies are small files that are stored on your device and help us understand how you use our website. You can disable cookies in your browser settings if you prefer not to have them.
</p>
<p><h1 className="underline">Children's Privacy:</h1>
Our website is not intended for use by children under the age of 13, and we do not knowingly collect personal information from children under the age of 13.
</p>

<p><h1 className="underline">Changes to This Policy:</h1>
We may update this privacy policy from time to time by posting a new version on our website. We encourage you to review this policy periodically to stay informed about how we are protecting your privacy.
</p>

<p><h1 className="underline">Contact Us:</h1>
If you have any questions or concerns about our privacy policy, please contact us at 555-123-4567.
  </p>

  
  <div>
    
  </div>
      </div> 




  )
}

export default Privacy