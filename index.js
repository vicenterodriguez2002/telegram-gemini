import express, { response } from "express";
import { Telegraf , Markup} from "telegraf";


const app = express();



const PORT ="3000";
const TokenTelegram = "7967362555:AAHDpIJehiPj_FAdIk5OCQb4UMVVNt5M5xk";
const bot = new Telegraf(TokenTelegram); 



async function enviarMensaje(req,res) {

const TokenTelegram = "7967362555:AAHDpIJehiPj_FAdIk5OCQb4UMVVNt5M5xk";
const bot = new Telegraf(TokenTelegram); 
const chatID ="-4670252210";
const {mensaje}= req.query;

const metodo = req.method;



if(metodo==='GET'){
    return res.status(419).res.json({
        resultado:"No cumple con el metodo"
    })
}

if(mensaje===undefined){

    return res.status(200).res.json({
        resultado:"No estas enviando ningun mensaje"
    })
}


const RespuestaDelaIA = encodeURIComponent(mensaje);
const url = "https://api.telegram.org/bot"+TokenTelegram+"/sendMessage?chat_id="+chatID+"&text="+RespuestaDelaIA+"";
    fetch(url).then(response => response.json())
    .then(respuesta => {

        // console.log(respuesta);
        res.json({
            respuesta:{
                enviado:'Exito'
            }
        })


    }).catch(
        error=>console.log("Error:",error)
    )
}

function escapeMarkdownV2(text) {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, "\\$&");
  }
  
// Manejar mensajes entrantes en el bot
bot.on("text", (ctx) => {

    //aca recibe el mensaje
    console.log(`Mensaje recibido: ${ctx.message.text}`);

    const mensajedelusuario =ctx.message.text.toLowerCase();


    if(mensajedelusuario==='/menu' || mensajedelusuario==='menu'){
       

        // bot.start((ctx) => {
            ctx.reply(
              "¡Hola! Selecciona una opción:",
              Markup.inlineKeyboard([
                // [Markup.button.url("Visitar Google", "https://google.com")],
                [Markup.button.callback("Ultimos 10 sismos CL", "opcion_1")],
                [ Markup.button.callback("El ultimo sismo CL", "opcion_2")],
                // [ Markup.button.callback("IA CON GEMINI", "opcion_3")]
              ])
            );
        //   });


          bot.action("opcion_1", (ctx) => {
          
            const urlSismosTop10 = "https://api.gael.cloud/general/public/sismos";

            fetch(urlSismosTop10,{
                method:"GET"
            }).then(response=>response.json())
            .then(respuesta =>{
               // ctx.reply(respuesta);
              
            //    respuesta.forEach(sismos10 => {
            //     ctx.reply(sismos10.RefGeografica);
            //    });
            let mensaje = respuesta.slice(0, 10).map((sismo, index) => 
                `🔹 *Sismo ${index + 1}:*\n` +
                `📍 *Ubicación:* ${sismo.RefGeografica}\n` +
                `🌐 *Fecha y Hora:* ${sismo.Fecha}\n` +
                `🌍 *Magnitud:* ${sismo.Magnitud}\n` +
                `🌊 *Profundidad:* ${sismo.Profundidad}\n` +
                `📅 *Fecha Actualizada:* ${sismo.FechaUpdate}\n`
            ).join("\n──────────────────\n");
            
            ctx.reply(mensaje, { parse_mode: "Markdown" });
            
               
            }).catch(error => {
                ctx.reply("Hubo un error: "+error);

            });


          
            // ctx.reply("Elegiste los 10 ultimos sismos");
          });
          
          bot.action("opcion_2", (ctx) => {
        
            
            const urlSismosTop10 = "https://api.gael.cloud/general/public/sismos";

            fetch(urlSismosTop10,{
                method:"GET"
            }).then(response=>response.json())
            .then(respuesta =>{


                ctx.reply(
                    "*ESTE SISMO FUE 📍*"+respuesta[0].RefGeografica+
                    "\n⌚*A LA FECHA Y HORA* "+respuesta[0].Fecha+
                    "\n🌍 *CON UNA MAGNITUD DE* "+respuesta[0].Magnitud+
                    "\n⛰️ *CON UNA PROFUNDIDAD DE* "+respuesta[0].Profundidad+ "Km"+
                    "\n📅*FECHA ACTUALIZADA :* "+respuesta[0].FechaUpdate
                ,{ parse_mode: "Markdown" });
              
            
           
               
            }).catch(error => {
                ctx.reply("Hubo un error: "+error);

            });


          });
          
            // ctx.reply("Elegiste la gemini");

        // ctx.reply(`QUIERES HABLAR CON  ${ctx.message.text} ?`);
    }else{
        const API_IA="AIzaSyANpdHoPCj7kxkHlHwYcsMqZmyBw1tBHF4";
        
            const Url_IA="https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent?key="+API_IA;
        

            const mensajito="Cual es el mejor equipo de chile hablando de futbol cuentame todas sus copas y dame una lista";

            const consulta ={
                  contents: [{
                  parts:[{text: mensajedelusuario}]
                             }]
                 }


            fetch(Url_IA,{
                method:"POST",
                headers:{
                 "Content-Type": "application/json"
                },
                body: JSON.stringify(consulta)
            }).then(response=> response.json())
            .then(respuestaIA=>{
                // console.log(respuestaIA);
                const textoRespuesta = respuestaIA.candidates[0].content.parts[0].text;

                // ctx.reply( textoRespuesta,{ parse_mode: "MarkdownV2" });
              
                  const textoSeguro = escapeMarkdownV2(textoRespuesta);
                  ctx.reply(textoSeguro, { parse_mode: "MarkdownV2" });
                  

            }).catch(error=>console.log("error: "+error))

    }

    //aca le respondo el mensake
  //  ctx.reply(`Recibí tu mensaje: ${ctx.message.text}`);
});

// Iniciar el bot con long polling
bot.launch();
console.log("Bot funcionando con Long Polling");

// Manejo de señales para cerrar el bot correctamente
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));



app.post("/send", enviarMensaje);
app.get('/send', async function retornar(req,res) {
    
    res.status(200).json({
        Mensaje: "Usted no tiene acceso"
    });

});



app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
  
//   https.createServer({
//     cert:fs.readFileSync('server.crt'),
//     key:fs.readFileSync('server.key')
// }, app).listen(443, function(){
//     console.log("Corriendo en 443")
// })
