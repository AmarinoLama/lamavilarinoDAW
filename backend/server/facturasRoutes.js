import express from 'express';
import Factura from '../modelos/Factura.js';

const router = express.Router();

// Crear factura
router.post('/', async (req, res) => {
  try {
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ error: "No se recibieron items en la factura" });
    }

    const factura = new Factura(req.body);
    await factura.save();
    res.status(201).json(factura);
  } catch (error) {
    console.error("Error al guardar factura:", error);
    res.status(400).json({ error: error.message });
  }
});

// Obtener factura por ID
router.get('/:id', async (req, res) => {
  console.log('Obteniendo factura con ID:', req.params.id);
  try {
    const factura = await Factura.findById(req.params.id);
    console.log('Factura encontrada:', factura);

    if (!factura) {
      console.error('Factura no encontrada con ID:', req.params.id);
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.json(factura);
  } catch (error) {
    console.error('Error al buscar factura:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;