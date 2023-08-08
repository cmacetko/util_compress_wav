var ffmpeg = require('fluent-ffmpeg');

var fs = require("fs");
var uuid = require("uuid");
var http = require('http');
var filesize = require("filesize");

var express = require("express");
var bodyParser = require("body-parser");

const sendRes = function(callback, IsSucesso, data){

	if( IsSucesso == true )
	{
		
        callback.status(200).json(data);
		
	}else{
		
        callback.status(500).json(data);
		
	}    


};

const remover_arquivo = function(filename){

    fs.unlink(filename, (err) => {

        if(err) 
        {
            
            console.error("unlink | error");
            console.error(err);
            
        }else{

            console.log("unlink | sucesso");
            
        }
    
    })

};

const compress_wav = async function(file_origem, file_destino){

    return new Promise((resolve, reject) => {

        try {

            /*
            https://www.npmjs.com/package/fluent-ffmpeg
            */
            ffmpeg(file_origem).
            audioBitrate(128).
            audioChannels(1).
            audioFrequency(12000).
            on("error", (err) => {
                
                reject(err);

            }).
            on("end", () => {
                
                resolve();
                
            }).
            save(file_destino);
            
        } catch(err) {

            console.log(err);

            reject(err);
            
        }

    });

};

var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.use(function(req, res, next){

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);

    next();

});

app.post("/gerar", async function(req, res){

    if( req.body.arquivo != "" ) 
	{

        console.log("-------------------------------------");
        console.log("arquivo: " + req.body.arquivo);
    
        var filenamepre = uuid();
        var filename = filenamepre + ".wav";
        var filename2 = filenamepre + "_final.wav";
		var output = __dirname + "/tmp/" + filename;
		var output2 = __dirname + "/tmp/" + filename2;
        var writeStream = fs.createWriteStream(output);

        var ArqAudio = req.body.arquivo;
        ArqAudio = ArqAudio.replace("https://", "http://");

		http.get(ArqAudio, function(response) {
            
            if( response.statusCode == 200 )
            {

                response.pipe(writeStream).on('finish', async function() {

                    try {

                        await compress_wav(output, output2);
            
                        fs.readFile(output2, {encoding: 'base64'}, function(err, data) {
                            
                            if(err) 
                            {
                                
                                console.error("readFile | error no arquivo: " + output2);
                                console.error(err);

                                remover_arquivo(output);
                                remover_arquivo(output2);
                                sendRes(res, false, {"Msg": "Falha em ler Raw"});

                            }else{

                                var stats = fs.statSync(output);
                                var stats2 = fs.statSync(output2);

                                console.log(">>> SUCESSO <<<");
                                console.log("Tamanho do Arquivo Original: " + filesize(stats.size, {round: 0}));
                                console.log("Tamanho do Arquivo Destino: " + filesize(stats2.size, {round: 0}));
                                
                                remover_arquivo(output);
                                remover_arquivo(output2);
                                sendRes(res, true, {"TamanhoOrigem": filesize(stats.size, {round: 0}), "TamanhoResultado": filesize(stats2.size, {round: 0}), "Arquivo": data.toString()});

                            }

                        });

                    } catch(e) {
            
                        console.log("Falha em Otimizar Arquivo");
                        console.log(e);

                        remover_arquivo(output);
                        remover_arquivo(output2);
                        sendRes(res, false, {"Msg": "Falha em Otimizar Arquivo"});
                        
                    }

                }).on('error', function(e){
                        
                    console.log("Falha no pipe");
                    console.log(e);

                    remover_arquivo(output);
                    sendRes(res, false, {"Msg": "Falha em Obter Raw do Arquivo"});

                });
                
            }else{

                console.log("Falha em Obter Arquivo - Status Code: " + res.statusCode);
    
                remover_arquivo(output);
		        sendRes(res, false, {"Msg": "Falha em Obter Arquivo - Status Code: " + res.statusCode});
                
            }

        });

	}else{

        console.log("Dados nao informados");
    
		sendRes(res, false, {"Msg": "arquivo nao informado"});

	}

});

app.listen(9000, function(){ 
    
    console.log("Porta: 9000");
    console.log("Desenvolvido por PALOMA MACETKO <cmacetko@gmail.com>");

});