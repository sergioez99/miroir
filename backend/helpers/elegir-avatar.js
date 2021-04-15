const elegirAvatar = (altura, peso) => {

    const imc = peso / ((altura / 100) * (altura / 100));

    console.log('IMC calculado: ...', imc);

    // aqui habra que definir las condiciones que diferencian un modelo de otro

    let modelo = 1;
    if (imc > 25) {
        modelo += 3;
    }
    if (imc > 18.5) {
        modelo += 3;
    }
    if (altura > 180) {
        modelo += 1;
    }
    if (altura > 160) {
        modelo += 1;
    }
    path = `${process.env.PATHUPLOAD}/modelo/avatar/${modelo}.json`;

    //comprobar si existe el archivo
    if (!fs.existsSync(path)) {
        path = `${process.env.PATHUPLOAD}/modelo/default.json`;
    }

    return path;
}