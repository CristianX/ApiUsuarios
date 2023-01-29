const { Router } = require('express');
const router = new Router();
const { mongoose } = require('mongoose')
const db = mongoose.connection;
const ObjectId = require('mongodb').ObjectId;

router.get('/', async (req, res) => {
    try {
        const x = await db
            .collection("ColUsuarios")
            .find({})
            .toArray();
        res.send(x);
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});

router.post('/', (req, res) => {
    try {
        const { UsuNombre } = req.body;
        const newUsuario = { ...req.body };

        console.log(req.body)

        db.collection('ColUsuarios').insertOne(newUsuario);
        res.json(newUsuario);

    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    if (id) {
        db.collection("ColUsuarios").deleteOne({ _id: new ObjectId(id) }, function (err, obj) {
            if (err) throw err;
            res.send("Se borro");
        });
    }
});

/*router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { UsuNombre, UsuApellido, UsuDireccion, UsuTelefono, UsuEmail, UsuPassword, UsuRol } = req.body;
    if (UsuNombre && UsuApellido && UsuDireccion && UsuTelefono && UsuEmail && UsuPassword && UsuRol) {
        var newvalues = {
            $set: {
                UsuNombre: UsuNombre,
                UsuApellido: UsuApellido,
                UsuDireccion: UsuDireccion,
                UsuTelefono: UsuTelefono,
                UsuEmail: UsuEmail,
                UsuPassword: UsuPassword,
                UsuRol: UsuRol
            }
        };
        var myquery = { _id: new ObjectId(id) };
        db.collection("ColUsuarios").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("se actualizó");
        });
        res.json("se actualizó");
    } else {
        res.status(500).json({ error: 'There was an error.' });
    }
});*/


//ELIMINAR UN CAMPO
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;

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

        });
        res.json("se borro un campo");
    } catch (error) {
        res.json("Error en la API: /usuario");
    }
});

module.exports = router;