<template>
  <div class="success-wrapper">
    <div class="success-card">
      <!-- Icono -->
      <div class="icon-wrapper">
        <i class="bi bi-check-circle-fill"></i>
      </div>

      <h2 class="title">Pago realizado correctamente</h2>

      <p class="message">
        Tu pedido ha sido confirmado y procesado correctamente.
      </p>

      <p>Descargue su factura en formato PDF:</p>
      <button @click="generarFacturaPDF" class="btn btn-primary">
        <i class="bi bi-file-earmark-pdf"></i> Descargar Factura
      </button>

      <br/>
      <br/>
      

      <div class="actions">
        <router-link
          to="/"
          class="btn btn-outline-primary border-1 shadow-none rounded-0"
        >
          Volver al inicio
        </router-link>

        <router-link
          to="/noticias"
          class="btn btn-primary border-0 shadow-none rounded-0"
        >
          Seguir comprando
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import { useCestaStore } from '@/store/cesta';
  import { watch, toRefs } from 'vue';
  import logo from '@/assets/logoCochesTeis.svg';

  export default {
    data() {
      return {
        cartItems: [],
        totalPrice: 0,
        facturaId: null,
      };
    },

    mounted() {
      const cartStore = useCestaStore();
      const { items } = toRefs(cartStore);
      this.cartItems = cartStore.items;
      this.totalPrice = cartStore.totalPrice;

      // Guardar factura al montar el componente
      this.guardarFactura();

      watch(() => cartStore.items, (newVal) => {
        this.cartItems = newVal;        
      }, { deep: true });
    },

    methods: {
      async guardarFactura() {
        try {
          const factura = {
            items: this.cartItems.map(item => ({
              productoId: item._id,
              nombre: item.nombre,
              cantidad: item.cantidad,
              precioUnitario: item.precio,
              total: item.precio * item.cantidad
            })),
            total: this.cartItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0),
            fecha: new Date(),
            estado: 'pagada'
          };

          const response = await fetch('http://localhost:3000/api/facturas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(factura)
          });

          if (!response.ok) {
            throw new Error('Error al guardar la factura');
          }

          const data = await response.json();
          this.facturaId = data._id;
          console.log('Factura guardada:', data);
        } catch (error) {
          console.error('Error al guardar factura:', error);
          alert('Error al guardar la factura en la base de datos');
        }
      },

      async generarFacturaPDF() {
        if (!this.facturaId) {
          alert("No se ha encontrado la factura.");
          return;
        }

        try {
          // Obtener factura de la BD
          const response = await fetch(`http://localhost:3000/api/facturas/${this.facturaId}`);
          
          if (!response.ok) {
            throw new Error('Error al obtener la factura');
          }

          const factura = await response.json();

          const doc = new jsPDF();

          doc.addImage(logo, 'SVG', 10, 10, 20, 20);

          doc.setFontSize(18);
          doc.text("Factura de Compra", 60, 20);

          doc.setFontSize(10);
          doc.text(`Nº Factura: ${factura._id}`, 14, 40);
          doc.text(`Fecha: ${new Date(factura.fecha).toLocaleDateString('es-ES')}`, 14, 45);

          doc.setFontSize(9);
          doc.text("Razón Social: Regalos Teis", 110, 50);
          doc.text("Dirección: Avenida Galicia 101, Vigo - 36216", 110, 55);
          doc.text("Tlfo: 986 666 333 - Email: regalos@example.com", 110, 60);

          const headers = [["ID", "Producto", "Cantidad", "Precio Unitario", "Total"]];
          const data = factura.items.map(item => [
            item.productoId,
            item.nombre,
            item.cantidad,
            `€${item.precioUnitario.toFixed(2)}`,
            `€${item.total.toFixed(2)}`
          ]);

          doc.autoTable({
            startY: 80,
            head: headers,
            body: data,
            columnStyles: {
              0: { halign: "center" },
              1: { halign: "center" },
              2: { halign: "center" },
              3: { halign: "right" },
              4: { halign: "right" },
            },
            theme: "striped",
          });

          const totalText = `Total: €${factura.total.toFixed(2)}`;
          const pageWidth = doc.internal.pageSize.width;
          const totalWidth = doc.getTextWidth(totalText);
          const positionX = pageWidth - totalWidth - 23;
          
          doc.setFont("helvetica", "bold");
          doc.setFontSize(12);
          doc.text(totalText, positionX, doc.lastAutoTable.finalY + 10);

          doc.save(`factura_${factura._id}.pdf`);

        } catch (error) {
          console.error('Error al generar PDF:', error);
          alert('Error al generar el PDF de la factura');
        }
      }
    },

    beforeUnmount() {
      const cartStore = useCestaStore();
      cartStore.clearCesta();
    }
  }
</script>

<style scoped>
.success-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-card {
  border: 1px solid #e6e9f0;
  border-radius: 12px;
  padding: 2.5rem 2rem;
  max-width: 420px;
  width: 100%;
  background-color: #fff;
  text-align: center;
}

.icon-wrapper {
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.title {
  margin-bottom: 0.75rem;
}

.message {
  margin-bottom: 2rem;
  color: #6c757d;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
</style>
