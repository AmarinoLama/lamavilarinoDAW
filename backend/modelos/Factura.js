import mongoose from 'mongoose';

const facturaSchema = new mongoose.Schema({
  items: [{
    productoId: { type: String, required: true },
    nombre: { type: String, required: true },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
    total: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: 'pagada' },
  dni: { type: String, required: false },
  clienteNombre: { type: String, required: false }
});

export default mongoose.model('Factura', facturaSchema);