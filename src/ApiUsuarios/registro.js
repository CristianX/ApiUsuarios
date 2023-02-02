const { Router } = require('express');
const router = new Router();
const { mongoose } = require('mongoose')
const db = mongoose.connection;
const ObjectId = require('mongodb').ObjectId;
// const { encrypt, decrypt } = require('../ApiSeguridad/crypto')
const apiSeguridades = require('../../utils/apiSeguridades');

router.get('/:correo/:pass/:rol', async (req, res) => {
    const { correo } = req.params;
    const { pass } = req.params;
    const { rol } = req.params;

    // var crypEmail = encrypt(correo)
    // var crypPass = encrypt(pass)
    var crypEmail = await apiSeguridades.encriptarEmail(correo);
    var  crypPass = await apiSeguridades.encriptarEmail(pass);

    try {
        if (rol === "Movil") {
            const x = await db
                .collection("ColUsuarios")
                .find({ UsuEmail: crypEmail, UsuPassword: crypPass })
                .toArray();
            res.json(x);
        }
        else {
            const x = await db
                .collection("ColUsuarios")
                .find({ UsuEmail: crypEmail, UsuPassword: crypPass })
                .toArray();
            res.json(x);
        }
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});

router.post('/', async (req, res) => {

    console.log("Body enviado", req.body);

    const { UsuEmail, UsuPassword, UsuRol } = req.body;

    // var crypEmail = encrypt(UsuEmail)
    // var crypPass = encrypt(UsuPassword)
    var crypEmail = await apiSeguridades.encriptarEmail(UsuEmail);
    var  crypPass = await apiSeguridades.encriptarEmail(UsuPassword);

    console.log(UsuEmail)

    const newUsuario = {UsuEmail: crypEmail, UsuPassword: crypPass, UsuRol: UsuRol , UsuNombre: "", UsuApellido: "", UsuDireccion: "", UsuTelefono: "", CliReclamos: [] };
    try {
        db.collection('ColUsuarios').insertOne(newUsuario);
        res.json("Se inserto con éxito");
    } catch (error) {
        res.json("Error en la API: /usuario");
        //response.status(500).json({ message: "Error en la API: /usuario" })
    }
});

router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            db.collection("ColUsuarios").deleteOne({ _id: new ObjectId(id) }, function (err, obj) {
                if (err) throw err;
                res.send("Se borró su cuenta");
            });
        }
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});


router.put('/:id', (req, res) => {
    const { id } = req.params;
    try {
        var newvalues = {
            $unset: {
                PassNombre: "",
                PassApellido: "",
                PassDireccion: "",
                PassTelefono: "",
                PassEmail: "",
                PassPassword: "",
                PassRol: ""
            }
        };
        var myquery = { _id: new ObjectId(id) };
        db.collection("ColUsuarios").updateOne(myquery, newvalues, function (err, res) {

            res.json("Se actualizó con éxito al usuario");
        });

    } catch (error) {
        res.json("Error en la API: /usuario");
        response.status(500).json({ message: "Error en la API: /usuario" })
    }
});

module.exports = router;