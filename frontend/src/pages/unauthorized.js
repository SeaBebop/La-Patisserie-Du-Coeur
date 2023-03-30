import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return(
    <div>
    <p>You can't be in the salty splatoon!</p>

    <button onClick={goBack}>Go Back</button>    
    </div>
  
  )
}

export default Unauthorized