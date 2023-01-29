const { Router } = require('express');
const router = new Router();
const { mongoose } = require('mongoose')
const db = mongoose.connection;
const ObjectId = require('mongodb').ObjectId;
// const { encrypt, decrypt } = require('../ApiSeguridad/crypto')
const apiSeguridades = require('../../utils/apiSeguridades');

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const x = await db
            .collection("ColUsuarios")
            .find({ _id: new ObjectId(id) })
            .toArray();

        // x[0].UsuPassword = decrypt(x[0].UsuPassword)
        // x[0].UsuEmail = decrypt(x[0].UsuEmail)

        x[0].UsuPassword = await apiSeguridades.desencriptarEmail(x[0].UsuPassword);
        x[0].UsuEmail = await apiSeguridades.desencriptarEmail(x[0].UsuEmail);

        res.send(x);
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});

router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        if (id) {
            db.collection("ColUsuarios").deleteOne({ _id: new ObjectId(id) }, function (err, obj) {
                if (err) throw err;
                res.json("Se borro");
            });
        }
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});

router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { UsuNombre, UsuApellido, UsuDireccion, UsuTelefono, UsuCedula, UsuSocial} = req.body;


            var newvalues = {
                $set: {
                    UsuNombre: UsuNombre,
                    UsuApellido: UsuApellido,
                    UsuDireccion: UsuDireccion,
                    UsuTelefono: UsuTelefono,
                    UsuCedula: UsuCedula,
                    UsuSocial : UsuSocial,
                }
            };
            var myquery = { _id: new ObjectId(id) };
            db.collection("ColUsuarios").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw console.log(err);;
                console.log("se actualizó");
            });
            res.json("Se Actualizó");
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});


router.post('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {  UsuPassword } = req.body;

        // var crypPass = encrypt(UsuPassword)
        var  crypPass = await apiSeguridades.encriptarEmail(correo);

            var newvalues = {
                $set: {
                    UsuPassword: crypPass
                }
            };
            var myquery = { _id: new ObjectId(id) };
            db.collection("ColUsuarios").updateOne(myquery, newvalues, function (err, res) {
                if (err) throw console.log(err);;
                console.log("se actualizó");
            });
            res.json("Se actualizó");
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});


module.exports = router;