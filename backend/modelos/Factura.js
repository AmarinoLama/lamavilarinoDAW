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
  estado: { type: String, default: 'pagada' }
});

export default mongoose.model('Factura', facturaSchema);