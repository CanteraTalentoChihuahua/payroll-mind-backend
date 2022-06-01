import express from "express";
const businessUnits = require("../controllers/businessUnits") ;

const businessUnitRouter = express.Router();


businessUnitRouter.post("/save", async (req, res) => {
    const { name } = req.body;
    try {
        await businessUnits.save(name);
        return res.status(200).json({
            message: "Unidad de negocio guardada con éxito."
        });
    } catch (error) {
        return res.status(500).json({
            message: "Algo salió mal."
        });
        } 
    });


businessUnitRouter.put("/edit", async (req, res) => { 
    const { id,name } = req.body;
});

businessUnitRouter.get("/list", async (req, res) => {
    
    });

businessUnitRouter.put("/delete", async (req, res) => { 
    const { id } = req.body;
});


export default businessUnitRouter;