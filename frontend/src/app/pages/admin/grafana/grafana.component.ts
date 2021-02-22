const urlUsuario = 'http://localhost:3000/api/usuarios/usuario';
const urlCliente = 'http://localhost:3000/api/clientes/cliente';
const urlPrenda = 'http://localhost:3000/api/prendas/prenda';

var url_req = new XMLHttpRequest();
var numUsu;
var numCli;
var numPre;

var usuarios;
var clientes;
var prendas;

var found = false;

url_req.onload = function () {
    usuarios = JSON.parse(this.responseText);
    clientes = JSON.parse(this.responseText);
    prendas = JSON.parse(this.responseText);

    numUsu = usuarios.length;
    numCli = clientes.length;
    numPre = prendas.lenght;

    console.log(`Cargadas ${numUsu} usuarios`);
    console.log(`Cargadas ${numCli} clientes`);
    console.log(`Cargadas ${numPre} prendas`);
}

url_req.open('GET', urlUsuario, false);
url_req.send();
/*
const userIdMax = 750;
const precioMax = 600;
const precioMin = 100;
*/
var xhr = new XMLHttpRequest();
var intentos = 0;
var index = 0;

function genRandoms() {
    let res = document.getElementById('resultado');
    console.log('Buscando ' + numUsu + ' usuarios');
    newUsuario();
    newCliente();
    newPrenda();
}

function newUsuario() {
    if (index >= numUsu) {
        index = 0;
    }
    var url = 'https://services.gisgraphy.com/reversegeocoding/search?country=ES&format=json&from=1&to=10';

    /*Randoms */
    let cli = clientes[index];
    let usu = usuarios[index];
    let pre = prendas[index];

    //console.log('[' + Math.floor(porcentaje(index + 1)) + '%] ' + usu.nombre + ` (${intentos})`);

    var clientes = cli.prendas + (Math.floor(Math.random() * 80) - 40) / 1000;
    var usuarios = usu.prendas + (Math.floor(Math.random() * 60) - 30) / 1000;
    var prend = prendas + (Math.floor(Math.random() * 70) - 60) / 1000;

    url += `&lat=${clientes}&lng=${usuarios}&lng=${prend}`;
    url.replace(',', '.');
    url.replace(',', '.');
    url.replace(',', '.');

    xhr.open('GET', url, false);
    xhr.onload = function () {
        var usuario = JSON.parse(this.responseText).result[0];

        var email = Math.floor((Math.random()));
        var peso = Math.floor((Math.random()*2));
        var altura = Math.floor((Math.random() * 4) + 2);
        var pecho = Math.floor(Math.random() * 2);
        var cadera = Math.floor(Math.random() * 2);
        var cintura = Math.floor(Math.random() * 2);
        var rol = Math.floor(Math.random() * 2);
        var alta = Math.floor(Math.random() * 2);
            /*
            var amueblado = Math.floor(Math.random() * 2);
            var parking = Math.floor(Math.random() * 2);
            var banyos = Math.floor((Math.random() * 2) + 1);
            var planta = Math.floor((Math.random() * 7) + 1);
            var trastero = Math.floor(Math.random() * 2);
            var ascensor = Math.floor(Math.random() * 2);
            var calefaccion = Math.floor(Math.random() * 2);
            var aireacondicionado = Math.floor(Math.random() * 2);
            var descripcion = "";
            var tipoanuncio = 0;
            var visitas = Math.floor(Math.random() * 13);

            res.innerHTML += "<b>" + uni.nombre + ':   </b>' + direccion + '<br>';
            if (porhab == 0) {
                var titulo = "Piso en " + casa.streetName + " (" + casa.city + ')';
            } else {
                var titulo = "Habitación en " + casa.streetName + " (" + casa.city + ')';
            }
            */
        res.innerHTML += "email:"     + email;
        res.innerHTML += "peso:"      + peso + ',  ';
        res.innerHTML += "altura:"    + altura + ',  ';
        res.innerHTML += "pecho:"     + pecho + ',  ';
        res.innerHTML += "cadera:"    + cadera + ',  ';
        res.innerHTML += "cintura:"   + cintura + ',  ';
        res.innerHTML += "rol:" + rol + ',  ';
        res.innerHTML += "alta:" + alta + ',  ';

            /*
            res.innerHTML += "piscina:  " + piscina + '<br>';
            res.innerHTML += "terraza:  " + terraza + ',  ';
            res.innerHTML += "amueblado:  " + amueblado + ',  ';
            res.innerHTML += "parking:  " + parking + ',  ';
            res.innerHTML += "planta:  " + planta + ',  ';
            res.innerHTML += "trastero:  " + trastero + '<br>';
            res.innerHTML += "ascensor:  " + ascensor + ',  ';
            res.innerHTML += "calefaccion:  " + calefaccion + ',  ';
            res.innerHTML += "aireacondicionado:  " + aireacondicionado + '<br>';
            res.innerHTML += '<br><br>';

            console.log('[' + Math.floor(porcentaje(index + 1)) + '%] Piso encontrado!');
            */


        /*url usuario */
        let almacenarURLUsuario = `p_usuario=${usuario}&p_email=${email}&peso=${peso}&p_altura=${altura}&p_pecho=${pecho}&p_cadera=${cadera}&p_cintura=${cintura}&p_rol=${rol}&p_alta=${alta}`;

            /*
            saveUrl += `&p_ciudad=${casa.city}&p_numero=${numero}&p_numerohabitaciones=${numerohabitaciones}&p_banyos=${banyos}&p_terraza=${terraza}`
            saveUrl += `&p_wifi=${wifi}&p_aireacondicionado=${aireacondicionado}&p_ascensor=${ascensor}&p_mascota=${mascota}&p_piscina=${piscina}&p_trastero=${trastero}`
            saveUrl += `&p_amueblado=${amueblado}&p_parking=${parking}&p_planta=${planta}&p_calefaccion=${calefaccion}&p_descripcion=${descripcion}&p_visitas=${visitas}`
            saveUrl += `&p_tipoanuncio=${tipoanuncio}`;
            */

        toDatabase(urlUsuario, almacenarURLUsuario);

        index++;
        intentos = -1;
        found = true;
       }

       xhr.send();
       intentos++;

       if (intentos > 3) {
           index++;
           intentos = 0;
           console.log('  el usuario se llama:' + usu.nombre);
           console.log('  el cliente se llama:' + cli.nombre);
           console.log('  la prenda se llama:'  + pre.nombre);
           sleep(7000);
       } else {
           if (found) {
               found = false;
               sleep(7000);
           } else {
               //newPiso();
           }
       }

}

function newCliente() {
  var cliente = JSON.parse(this.responseText).result[0];

  let cli = clientes[index];

  var url = 'https://services.gisgraphy.com/reversegeocoding/search?country=ES&format=json&from=1&to=10';

  console.log('[' + Math.floor(porcentaje(index + 1)) + '%] ' + cli.nombre + ` (${intentos})`);

  var email = Math.floor((Math.random() * 1000));
  var password = Math.floor((Math.random()));
  var alta = Math.floor((Math.random() * 4) + 2);
  var activo = Math.floor(Math.random() * 2);
  var validado = Math.floor(Math.random() * 2);
  var nombre = Math.floor(Math.random() * 2);
  var nombreEmpresa = Math.floor(Math.random() * 2);
  var nif = Math.floor(Math.random() * 2);
  var telefono = Math.floor(Math.random() * 2);
  var rol = Math.floor(Math.random() * 2);

  res.innerHTML += "email:"     + email;
  res.innerHTML += "password:"      + password + ',  ';
  res.innerHTML += "alta:"    + alta + ',  ';
  res.innerHTML += "activo:"     + activo + ',  ';
  res.innerHTML += "validado:"    + validado + ',  ';
  res.innerHTML += "nombre:"   + nombre + ',  ';
  res.innerHTML += "nombreEmpresa:" + nombreEmpresa + ',  ';
  res.innerHTML += "nif:" + nif + ',  ';
  res.innerHTML += "telefono:" + telefono + ',  ';
  res.innerHTML += "rol:" + rol + ',  ';


    /*url cliente */
    let almacenarURLCliente = `p_emailt=${email}&p_password=${password}&p_alta=${alta}&p_activo=${activo}&p_validado=${validado}&p_nombre=${nombre}&p_nombreEmpresa=${nombreEmpresa}&p_nif=${nif}&p_telefono=${telefono}&p_rol=${rol}`;

    toDatabase(urlCliente, almacenarURLCliente);

    index++;
    intentos = -1;
    found = true;
    xhr.send();
    intentos++;

    if (intentos > 3) {
        index++;
        intentos = 0;

        console.log('  el cliente se llama:' + cli.nombre);

        sleep(7000);
    } else {
        if (found) {
            found = false;
            sleep(7000);
        } else {
            //newPiso();
        }
    }


}

function newPrenda() {

  var prenda  = JSON.parse(this.responseText).result[0];
  let pre = clientes[index];

  var url = 'https://services.gisgraphy.com/reversegeocoding/search?country=ES&format=json&from=1&to=10';

  console.log('[' + Math.floor(porcentaje(index + 1)) + '%] ' + pre.nombre + ` (${intentos})`);

  var email = Math.floor((Math.random() * 1000));
  var password = Math.floor((Math.random()));
  var alta = Math.floor((Math.random() * 4) + 2);
  var activo = Math.floor(Math.random() * 2);
  var validado = Math.floor(Math.random() * 2);
  var nombre = Math.floor(Math.random() * 2);
  var nombreEmpresa = Math.floor(Math.random() * 2);
  var nif = Math.floor(Math.random() * 2);
  var telefono = Math.floor(Math.random() * 2);
  var rol = Math.floor(Math.random() * 2);

  res.innerHTML += "email:"     + email;
  res.innerHTML += "password:"      + password + ',  ';
  res.innerHTML += "alta:"    + alta + ',  ';
  res.innerHTML += "activo:"     + activo + ',  ';
  res.innerHTML += "validado:"    + validado + ',  ';
  res.innerHTML += "nombre:"   + nombre + ',  ';
  res.innerHTML += "nombreEmpresa:" + nombreEmpresa + ',  ';
  res.innerHTML += "nif:" + nif + ',  ';
  res.innerHTML += "telefono:" + telefono + ',  ';
  res.innerHTML += "rol:" + rol + ',  ';


    /*url cliente */
    let almacenarURLCliente = `p_emailt=${email}&p_password=${password}&p_alta=${alta}&p_activo=${activo}&p_validado=${validado}&p_nombre=${nombre}&p_nombreEmpresa=${nombreEmpresa}&p_nif=${nif}&p_telefono=${telefono}&p_rol=${rol}`;

    toDatabase(urlCliente, almacenarURLCliente);

    index++;
    intentos = -1;
    found = true;

    xhr.send();
    intentos++;

    if (intentos > 3) {
        index++;
        intentos = 0;

        console.log('  la prenda se llama:'  + pre.nombre);
        sleep(7000);
    } else {
        if (found) {
            found = false;
            sleep(7000);
        } else {
            //newPiso();
        }
    }


}


function toDatabase(url, req_body) {
  let hxhr = new XMLHttpRequest();
  hxhr.open("POST", url, true);

  hxhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  hxhr.onload = function () {
   console.log(this.responseText);
  }
  hxhr.send(req_body);

}

function newStatus(n) {
  document.getElementById('title').textContent = 'Resultados (' + n + '/' + numUsu + ')';
  document.getElementById('title').textContent = 'Resultados (' + n + '/' + numCli + ')';
  document.getElementById('title').textContent = 'Resultados (' + n + '/' + numPre + ')';
}

function porcentaje(n) {
  return ((100 * n) / numUsu);
}

function sleep(milliseconds) {
  setTimeout(() => {
      //newPiso();
  }, milliseconds);
}



