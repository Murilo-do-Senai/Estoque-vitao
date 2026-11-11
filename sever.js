const { default: app } = await import("./src/app.js");
import dotenv from "dotenv";


// dotenv.config();
dotenv.config({ silent: true });

const Porta = process.env.PORTA;

app.listen(Porta,()=>{
    console.log(`Servidor rodando na porta ${Porta}`)
});