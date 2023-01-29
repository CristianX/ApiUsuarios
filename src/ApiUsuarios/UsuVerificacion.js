const { Router } = require('express');
const router = new Router();
const { mongoose } = require('mongoose')
const db = mongoose.connection;
const ObjectId = require('mongodb').ObjectId;
var nodemailer = require('nodemailer');
// const { encrypt, decrypt } = require('../ApiSeguridad/crypto')
const apiSeguridades = require('../../utils/apiSeguridades');

router.get('/:correo', async (req, res) => {
    const { correo } = req.params;

    // correo_encrypt = encrypt(correo)
    correo_encrypt = await apiSeguridades.encriptarEmail(correo);

    try {
        const x = await db
            .collection("ColUsuarios")
            .find({ UsuEmail: correo_encrypt })
            .toArray();
        res.send(x);
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});

router.post('/:correo', async (req, res) => {
    const { correo } = req.params;

    // correo_encrypt = encrypt(correo)
    correo_encrypt = await apiSeguridades.encriptarEmail(correo);

    var transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'daed_sa@hotmail.com',
            pass: 'L4nnister'
        }
    });


    const x = await db
        .collection("ColUsuarios")
        .find({ UsuEmail: correo_encrypt })
        .toArray();

    var pass =  decrypt(x[0].UsuPassword)

    var mailOptions = {
        from: 'daed_sa@hotmail.com',
        to: correo,
        subject: 'Recuperacion de contraseña DANITEX',
        text: 'Esta es su contraseña: ' + pass
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.json("La contraseña se ha enviado al correo registrado");
        }
    });
});

module.exports = router;