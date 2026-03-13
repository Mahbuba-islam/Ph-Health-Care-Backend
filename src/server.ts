
import app from "./app";
import { seedSuperAdmin } from "./App/utilis/seed";
import { envVars } from "./config/env";



const bootstraf = async() => {
    try{
        await seedSuperAdmin()
   app.listen(envVars.PORT, () => {
    console.log(`server is running on http://localhost:${envVars.PORT}`);

    })
    }
    catch(error){
     console.log(error);
    }
    
}

bootstraf()