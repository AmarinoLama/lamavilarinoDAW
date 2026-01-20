import express from 'express';
import Factura from '../modelos/Factura.js';

const router = express.Router();

// Crear factura
router.post('/', async (req, res) => {
  try {
    const factura = new Factura(req.body);
    await factura.save();
    res.status(201).json(factura);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener factura por ID
router.get('/:id', async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id);
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;