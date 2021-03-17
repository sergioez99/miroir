const { response } = require('express');

const Prenda = require('../models/prendas.model');

const conversacion = async(req, res = response) => {

    var respuesta = "";

    //Gifs que solo van para telegram xd
    if(req.body.queryResult.action.localeCompare('get_gifs') == 0){
        var pgifs = req.body.queryResult.parameters.gifs;
        if(pgifs.localeCompare('comer') == 0){
            respuesta = {
                'fulfillmentText' : '¡Tengo mucha hambre!',
                'fulfillmentMessages': [{
                    'image':{
                        'imageUri': 'https://i.pinimg.com/originals/27/f8/09/27f8091ca7435834809fedce7ad4e523.gif',
                        'accesibilityText': ''
                    }
                }]
            }
        }
        if(pgifs.localeCompare('bailar') == 0){
            respuesta = {
                'fulfillmentText' : 'Twerking',
                'fulfillmentMessages': [{
                    'image':{
                        'imageUri': 'https://media.tenor.com/images/9be20f81db832b01ee93fb41cf00ba68/tenor.gif',
                        'accesibilityText': ''
                    }
                }]
            }
        }
        if(pgifs.localeCompare('llorar') == 0){
            respuesta = {
                'fulfillmentText' : 'Estoy muy triste',
                'fulfillmentMessages': [{
                    'image':{
                        'imageUri': 'https://i.pinimg.com/originals/18/1c/06/181c065b666891b204e8d7f2ee4e7111.gif',
                        'accesibilityText': ''
                    }
                }]
            }
        }
        if(pgifs.localeCompare('reir') == 0){
            respuesta = {
                'fulfillmentText' : '¡Tengo mucha hambre!',
                'fulfillmentMessages': [{
                    'image':{
                        'imageUri': 'https://i.pinimg.com/originals/a1/61/cf/a161cff548a8f839cadb679cf58f7bf7.gif',
                        'accesibilityText': ''
                    }
                }]
            }
        }
        if(pgifs.localeCompare('estudiar') == 0){
            respuesta = {
                'fulfillmentText' : '¡No quiero estudiar!',
                'fulfillmentMessages': [{
                    'image':{
                        'imageUri': 'https://i.pinimg.com/originals/03/84/ec/0384ec3f3163bbfbe7a9788d5d9394af.gif',
                        'accesibilityText': ''
                    }
                }]
            }
        }
    }

    //Listar cuantas prendas tenemos si nos preguntan
    if(req.body.queryResult.action.localeCompare('get_prendas') == 0){
        var tallas = req.body.queryResult.parameters.prendas;
        var prendas = await Prenda.find({ talla: tallas });

        if(prendas.length == 0){
            prendas = await Prenda.find(); // Quiero que busque todas
            respuesta = {
                'fulfillmentText' : 'En Miroir disponemos ahora mismo de ' + prendas.length + ' prendas'
            }
        }
        else{
            respuesta = {
                'fulfillmentText' : 'En Miroir disponemos ahora mismo de ' + prendas.length + ' prendas de la talla ' + tallas
            }
        }
    }
    res.setHeader('Content-Type', 'application/json');

    var outString = JSON.stringify(respuesta);
    console.log(outString);
    res.send(outString);
}

module.exports = {
    conversacion
}