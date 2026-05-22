document.addEventListener('DOMContentLoaded', async () => {
    // 1. Leer el ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    // Redirigir si alguien entra a orderDetails.html sin un ID válido
    if (!orderId) {
        alert("Pedido no especificado.");
        window.location.href = 'userPage.html';
        return;
    }

    // 2. Traer los datos desde tu endpoint Node.js (El que usa la nueva consulta SQL)
    try {
        const response = await fetch(`/api/user-page/order-info/${orderId}`);
        const result = await response.json();
        //console.log("Datos del pedido:", result);

        if (result.success) {
            renderOrderDetails(result.data);
        } else {
            alert("No se pudo cargar el pedido.");
        }
    } catch (error) {
        //console.error("Error cargando detalles:", error);
    }
});

function renderOrderDetails(order) {
    // 1. Llenar la cabecera
    document.getElementById('ui-order-id').textContent = order.id_pedido;
    document.getElementById('ui-status').textContent = order.estado_pedido;
    document.getElementById('ui-total').textContent = parseFloat(order.total).toFixed(2);
    document.getElementById('ui-address').textContent = order.direccion_envio;
    document.getElementById('ui-notes').textContent = order.detalle_string_pedido || 'Sin notas.';

    // Formatear la fecha
    const fecha = new Date(order.fecha_pedido);
    document.getElementById('ui-date').textContent = fecha.toLocaleDateString();

    // 2. Limpiar e inyectar la lista de productos
    const container = document.getElementById('product-list-container');
    container.innerHTML = ''; // Limpiar el texto "Cargando..."

    order.productos.forEach(prod => {
        const productHTML = `
            <div style="display: flex; gap: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                <img src="${prod.imagen || 'placeholder.jpg'}" alt="Producto ${prod.id_producto}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                
                <div style="display: flex; flex-direction: column; justify-content: center;">
                    <h4 style="margin: 0; color: #333;">Producto ID: ${prod.id_producto}</h4>
                    <p style="margin: 5px 0 0; color: #666;">
                        Cantidad: <strong>${prod.cantidad}</strong> x $${parseFloat(prod.precio_unitario).toFixed(2)}
                    </p>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
}