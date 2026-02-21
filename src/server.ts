
import app from "./app";
import { envVars } from "./config/env";



const bootstraf = () => {
    try{
   app.listen(envVars.PORT, () => {
    console.log(`server is running on http://localhost:${envVars.PORT}`);

    })
    }
    catch(error){
     console.log(error);
    }
    
}

bootstraf()