const { Router } = require('express');
const router = new Router();
const { mongoose } = require('mongoose')
const db = mongoose.connection;
const ObjectId = require('mongodb').ObjectId;
// const { encrypt, decrypt } = require('../ApiSeguridad/crypto');
const apiSeguridades = require('../../utils/apiSeguridades');

router.get('/:nombre', async (req, res) => {
    try {
        const { nombre } = req.params;

        if (nombre === "_ERROR_") {
            const x = await db
                .collection("ColUsuarios")
                .find({ UsuNombre: { $regex: "" }, CliReclamos: { $elemMatch: { RecRespuesta: 'Sin Respuesta' } } })
                .toArray();

                let reg = x.length

                for (var i = 0; i < reg; i++) 
                    // x[i].UsuEmail = decrypt(x[i].UsuEmail)
                    x[i].UsuEmail = await apiSeguridades.desencriptarEmail(x[i].UsuEmail);

            res.send(x);
        } else {
            const x = await db
                .collection("ColUsuarios")
                .find({ UsuNombre: { $regex: nombre }, "CliReclamos.RecRespuesta": "Sin Respuesta" })
                .toArray();

                let reg = x.length

                for (var i = 0; i < reg; i++) 
                    // x[i].UsuEmail = decrypt(x[i].UsuEmail)
                    x[i].UsuEmail = await apiSeguridades.desencriptarEmail(x[i].UsuEmail);

            res.send(x);
        }
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});

router.post('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { RecTitulo, RecFecha, RecRespuesta } = req.body;

        console.log(RecTitulo, RecFecha, RecRespuesta)

        const query = { _id: new ObjectId(id), "CliReclamos.RecTitulo": RecTitulo, "CliReclamos.RecFecha": RecFecha };

        const newvalues = {
            $set: { "CliReclamos.$.RecRespuesta": RecRespuesta }
        };


        db.collection("ColUsuarios").updateOne(query, newvalues, function (err, res) {

        });
        res.json("Reclamo actualizado");

    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { RecTitulo, RecFecha, RecRespuesta } = req.body;

        console.log(RecTitulo, RecFecha, RecRespuesta)


        var newvalues = { $pull: { "CliReclamos": { "RecTitulo": RecTitulo } } };
        const myquery = { _id: new ObjectId(id) };

        db.collection("ColUsuarios").update(myquery, newvalues, function (err, res) {
            if (err) throw err;
        });
        res.json("Se eliminó el reclamo")
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});


module.exports = router;