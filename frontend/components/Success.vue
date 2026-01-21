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

      <p class="mb-3">Descargue su factura en formato PDF:</p>
      <button @click="generarFacturaPDF" class="btn btn-primary mb-4">
        <i class="bi bi-file-earmark-pdf"></i> Descargar Factura
      </button>

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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useCestaStore } from "@/store/cesta";
import logo from "@/assets/logoCochesTeis.png";

export default {
  data() {
    return {
      cartItems: [],
      totalPrice: 0,
      facturaId: null,
      isUnmounting: false,
    };
  },

  mounted() {
    // Recuperar items guardados antes del pago
    const savedItems = sessionStorage.getItem("cartItemsForInvoice");

    if (savedItems) {
      this.cartItems = JSON.parse(savedItems);
      this.totalPrice = this.cartItems.reduce(
        (acc, item) => acc + item.precio * item.cantidad,
        0,
      );

      // Guardar factura al montar el componente
      this.guardarFactura();

      // Limpiar sessionStorage después de usar
      sessionStorage.removeItem("cartItemsForInvoice");
    } else {
      console.error("No se encontraron items guardados del carrito");
    }
  },

  methods: {
    async guardarFactura() {
      try {
        if (!this.cartItems || this.cartItems.length === 0) {
          console.error("No hay items en el carrito para guardar");
          return;
        }

        const factura = {
          items: this.cartItems.map((item) => ({
            productoId: item._id || item.id || "N/A",
            nombre: item.nombre,
            cantidad: item.cantidad,
            precioUnitario: item.precio,
            total: item.precio * item.cantidad,
          })),
          total: this.cartItems.reduce(
            (acc, item) => acc + item.precio * item.cantidad,
            0,
          ),
          fecha: new Date(),
          estado: "pagada",
        };

        const response = await fetch("http://localhost:5000/api/facturas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(factura),
        });

        if (!response.ok) {
          throw new Error("Error al guardar la factura");
        }

        const data = await response.json();
        this.facturaId = data._id;
        console.log("Factura guardada con ID:", this.facturaId);
      } catch (error) {
        if (this.isUnmounting) return; // No procesar errores si el componente se está desmontando
        console.error("Error al guardar factura:", error);
        alert("Error al guardar la factura en la base de datos");
      }
    },

    async generarFacturaPDF() {
      console.log("Intentando generar PDF. ID de factura:", this.facturaId);

      if (!this.facturaId) {
        alert(
          "No se ha encontrado la factura. Por favor, intenta recargar la página.",
        );
        return;
      }

      try {
        console.log("Solicitando factura con ID:", this.facturaId);
        // Obtener factura de la BD
        const response = await fetch(
          `http://localhost:5000/api/facturas/${this.facturaId}`,
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error al obtener factura:", errorText);
          throw new Error("Error al obtener la factura");
        }

        const factura = await response.json();
        console.log("Factura obtenida para PDF:", factura);
        console.log("Items de la factura:", factura.items);

        const doc = new jsPDF();

        // Agregar logo (con manejo de error)
        try {
          doc.addImage(logo, "PNG", 10, 10, 20, 20);
        } catch (logoError) {
          console.warn("Error al cargar logo, continuando sin él:", logoError);
        }

        doc.setFontSize(18);
        doc.text("Factura de Compra", 60, 20);

        doc.setFontSize(10);
        doc.text(`Nº Factura: ${factura._id}`, 14, 40);
        doc.text(
          `Fecha: ${new Date(factura.fecha).toLocaleDateString("es-ES")}`,
          14,
          45,
        );

        doc.setFontSize(9);
        doc.text("Razón Social: Regalos Teis", 110, 50);
        doc.text("Dirección: Avenida Galicia 101, Vigo - 36216", 110, 55);
        doc.text("Tlfo: 986 666 333 - Email: regalos@example.com", 110, 60);

        const headers = [
          ["ID", "Producto", "Cantidad", "Precio Unitario", "Total"],
        ];

        console.log("Mapeando items para tabla...");
        const data = factura.items.map((item) => [
          item.productoId,
          item.nombre,
          item.cantidad,
          `€${item.precioUnitario.toFixed(2)}`,
          `€${item.total.toFixed(2)}`,
        ]);
        console.log("Datos de tabla:", data);

        autoTable(doc, {
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

        // Verificar que autoTable se ejecutó correctamente
        const finalY = doc.lastAutoTable?.finalY || 150;
        doc.text(totalText, positionX, finalY + 10);

        console.log("Guardando PDF...");
        doc.save(`factura_${factura._id}.pdf`);
        console.log("PDF generado correctamente");
      } catch (error) {
        console.error("Error al generar PDF:", error);
        alert("Error al generar el PDF de la factura");
      }
    },
  },

  beforeUnmount() {
    this.isUnmounting = true;
    const cartStore = useCestaStore();
    cartStore.clearCesta();
  },
};
</script>

<style scoped>
.success-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background-color: #f8f9fa;
}

.success-card {
  border: 1px solid #e6e9f0;
  border-radius: 12px;
  padding: 3rem 2.5rem;
  max-width: 500px;
  width: 100%;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
