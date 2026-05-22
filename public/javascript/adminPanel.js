//adminPanel.js
document.addEventListener("DOMContentLoaded", () => {
  // Selecciona todos los botones que se usaran como guardar o los de stock
  const stockButtons = document.querySelectorAll(".stock-btn");
  const saveStockBtn = document.getElementById("save-stock-btn");
  const productStockTableBody = document.querySelector(
    "#product-stock-table tbody",
  );

  async function loadDashboard() {
    try {
      const response = await fetch("/api/admin-panel");
      const result = await response.json();
        if (!result.success) {
            console.error("Error en la API:", result.message);
            return;
        }
      //const result = await response.json();


      const data = result.data;

      const dashboardContainer = document.getElementById("dashboard");

      dashboardContainer.innerHTML = `
            <div class="card">
                <h2>Total de Pedidos</h2>
                <p class="big-number">${data.totalOrders}</p>
                <p>Órdenes totales en la base de datos</p>
            </div>

            <div class="card">
                <h2>Ventas del Mes</h2>
                <p class="big-number">$${data.monthlySales.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p>Monto de ventas actual</p>
            </div>

            <div class="card">
                <h2>Solicitudes Pendientes</h2>
                <p class="big-number">${data.pendingRequests}</p>
                <p>Pedidos listos para ser empacados</p>
            </div>

            <div class="card full-width">
    <h2>Calendario de Envíos Importantes</h2>
    <p>Ultimos 5 Pedidos</p>
    
    <div class="shipment-timeline">
        ${
            data.recentShipments.slice(0, 5).map((pedido) => {
        // Convertimos la fecha del query
        const fecha = new Date(pedido.fecha_pedido);
        
        // Lógica para marcar si es un pedido de días anteriores
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const esAtrasado = fecha < hoy;

        return `
            <div class="calendar-event-card ${esAtrasado ? 'atrasado' : ''}">
                <div class="event-date-badge">
                    <span class="mth">${fecha.toLocaleString('es-MX', { month: 'short' }).toUpperCase()}</span>
                    <span class="day">${fecha.getDate()}</span>
                </div>
                <div class="event-details">
                    <div class="event-header">
                        <strong>Pedido #${pedido.id_pedido}</strong>
                        <span class="event-time">${pedido.estado_pedido}</span>
                    </div>
                    <p class="event-customer">Estado actual del registro</p>
                    <div class="event-footer">
                        <span class="event-total">Ref: ${pedido.id_pedido}</span>
                    </div>
                </div>
            </div>
        `;
    }).join("")
        }
    </div>
</div>
        `;
                                //<a href="ordersDetails.html?id=${pedido.id_pedido}" class="event-link">Ver Detalles</a>

    } catch (error) {
      console.error("Error al cargar el panel de administración:", error);
    }
  }

    async function deleteOrder(id) {
      const confirmacion = await Swal.fire({
        title: '¿Borrar pedido?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    });
    if(!confirmacion.isConfirmed) return;
    try {
        const res = await fetch(`/api/admin-panel/delete-order/${id}`, { method: 'DELETE' });
        const result = await res.json();
        if(result.success) {
          await Swal.fire('Pedido Eliminado', result.message, 'success');
        }
        else await Swal.fire('Error', result.message, 'error');
    } catch (error) {
        console.error("Error deleting order:", error);
        await Swal.fire('Error', 'Error al eliminar el pedido', 'error');
    }
}
window.deleteOrder = deleteOrder; // to be able to use it globally in the html


  async function loadTable() {
    const response = await fetch("/api/admin-panel", {
        headers: { 'Accept': 'application/json' } 
    });
    const result = await response.json();
    console.log(result);

    if (!result.success) return;

    const data = result.data;
    window.ordersData = data.recentOrders; // saved the data to use it later in the modals

    // llenar tabla pedidos
    const tableBody = document.getElementById("ordersTableBody");

    if (data.recentOrders.length === 0) {
      tableBody.innerHTML = `
        <tr>
            <td colspan="6">No hay pedidos recientes registrados en la base de datos.</td>
        </tr>
    `;
    return;
    } 

    // Remove duplicate orders in table (keep only one row per order)
  const uniqueOrders = [];
  const seenIds = [];
  data.recentOrders.forEach(order => 
    {
      // if theres a new id we gonna add it to unique orders
      //include return true or false if the value checked is in
    if (!seenIds.includes(order.id_pedido)) 
      {
      uniqueOrders.push(order);
      seenIds.push(order.id_pedido);
      }
  });
    
      tableBody.innerHTML = uniqueOrders
        .map(
          (pedido) => `
        <tr>
            <td>#${pedido.id_pedido}</td>
            <td>${pedido.cliente}</td>
            <td>${pedido.fecha_pedido}</td>
            <td>$${parseFloat(pedido.total).toFixed(2)}</td>
            <td>
                <select class="order-status-select" data-id="${pedido.id_pedido}">
                    <option value="Pendiente" ${pedido.estado_pedido === "Pendiente" ? "selected" : ""}>Pendiente</option>
                    <option value="Enviado" ${pedido.estado_pedido === "Enviado" ? "selected" : ""}>Enviado</option>
                    <option value="Completado" ${pedido.estado_pedido === "Completado" ? "selected" : ""}>Completado</option>
                    <option value="Cancelado" ${pedido.estado_pedido === "Cancelado" ? "selected" : ""}>Cancelado</option>
                </select>
            </td>
            <td>
          <button class="view-order-btn" data-id="${pedido.id_pedido}">
            Ver
          </button>
        </td>
          <td>
          <button class="btn-delete" onclick="deleteOrder(${pedido.id_pedido})">🗑️</button>
          </td>
        </tr>
    `,
        )
        .join("");
    
  }

  async function getPendingCustomRequests() {
    const response = await fetch("/api/admin-panel");
    const result = await response.json();
    const customList = document.getElementById("customRequestsList");

    if (result.success && result.data.pendingCustomRequests.length === 0) {
      customList.innerHTML = `
        <li>No hay solicitudes de personalización pendientes.</li>
    `;
    } else {
      customList.innerHTML = result.data.pendingCustomRequests
        .map((solicitud) => {

        if (solicitud.estado === "Aceptada") {
          //console.log("Solicitud ya aceptada:", solicitud);

          return `
          <li
            data-email="${solicitud.correo}"
            data-phone="${solicitud.telefono}"
            data-status="${solicitud.estado}"
          >
            <strong>ID: ${solicitud.id_solicitud}</strong>
            (Fecha: ${solicitud.fecha_solicitud})
            ${solicitud.tipo_producto}:
            ${solicitud.instrucciones}

            <button class="view-custom-btn approved" data-id="${solicitud.id_solicitud}" data-status="${solicitud.estado}">
              Aprobado
            </button>

            <span style="margin-left:10px;">
              <a href="https://mail.google.com/mail/?view=cm&to=${solicitud.correo}" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" width="20">
              </a>

              <a href="https://wa.me/${solicitud.telefono}" target="_blank">
                <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" width="20">
              </a>
            </span>

            <button class="btn-delete" onclick="deleteCustomRequest(${solicitud.id_solicitud})" title="Eliminar Solicitud">
                🗑️
            </button>

          </li>
          `;

        } 
        else if(solicitud.estado === "Rechazada"){
          return ``; // no se muestra en la lista
        }
        
        else {

          return `
          <li
            data-email="${solicitud.correo}"
            data-phone="${solicitud.telefono}"
          >
            <strong>ID: ${solicitud.id_solicitud}</strong>
            (Fecha: ${solicitud.fecha_solicitud})
            ${solicitud.tipo_producto}:
            ${solicitud.instrucciones}

            <button class="view-custom-btn" data-id="${solicitud.id_solicitud}">
              Ver / Aprobar
            </button>

            <button class="btn-delete" onclick="deleteCustomRequest(${solicitud.id_solicitud})" title="Eliminar Solicitud">
                🗑️
            </button>

          </li>
          `;

        }
          
         
        })
        .join("");
        
    }
  }


  async function loadStockTable() {
    const response = await fetch('/api/admin-panel', {
      headers: { 'Accept': 'application/json' }
    });
    const result = await response.json();

    if (!result.success) return;

    const tbody = document.getElementById('productStockBody');

    tbody.innerHTML = result.data.stockProducts.map(producto =>{
      const isInactive = producto.estado_producto === 'inactivo';
      return(
      `
        <tr data-product-id="${producto.id_producto}"class="${isInactive ? 'inactive-product' : ''}">
            <td>${producto.id_producto}</td>
            <td>${producto.nombre}</td>
            <td>$${parseFloat(producto.precio_unitario).toFixed(2)}</td>
            <td class="stock-value" id="stock-${producto.id_producto}">
                ${producto.stock}
            </td>
            <td>
                <button class="stock-btn decrease-stock"
                    data-action="decrease"
                    data-id="${producto.id_producto}"${isInactive ? 'disabled' : ''}>-</button>

                <button class="stock-btn increase-stock"
                    data-action="increase"
                    data-id="${producto.id_producto}" ${isInactive ? 'disabled' : ''}>+</button>
            </td>
            <td>
            
            <button class="btn-edit-icon" onclick="openEditModal(${JSON.stringify(producto).replace(/"/g, '&quot;')})" title="Editar Detalles">
                ✏️
            </button>

            <button class="btn-delete-icon" 
                onclick="${isInactive ? 'reactivateProduct' : 'deleteProduct'}(${producto.id_producto})" 
                title="${isInactive ? 'Reactivar Producto' : 'Desactivar Producto'}"
                style="${isInactive ? 'color: #28a745;' : ''}">
                ${isInactive ? '🔄' : '🗑️'}
            </button>
        </td>
        </tr>
    `)}).join('');
    //used regec to avoid conflic whit th equotes
}

  async function deleteProduct(id) {
        const confirmation = await Swal.fire({
            title: '¿Desactivar producto?',
            text: "El producto se desactivará y no será visible en la tienda.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmation.isConfirmed) {
            const res = await fetch(`/api/admin-panel/delete-product/${id}`, {
                method: 'PUT', // put to change the state
                headers: { 'Content-Type': 'application/json' }
            });
            if (res.ok){
              Swal.fire('Producto Desactivado', 'El producto ha sido desactivado y ya no es visible en la tienda.', 'success');
            } location.reload();
        }
    }
window.deleteProduct = deleteProduct; // to be able to use it globally in the html

async function reactivateProduct(id) {
  const confirmacion = await Swal.fire({
        title: '¿Reactivar producto?',
        text: "El producto volverá a estar visible en la tienda.",
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, reactivar',
        cancelButtonText: 'Cancelar'
    });
    if (confirmacion.isConfirmed) {
        const res = await fetch(`/api/admin-panel/reactivate-product/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }

        });
        if (res.ok) {
            await Swal.fire('Producto Reactivado', 'El producto ha sido reactivado y ahora es visible en la tienda.', 'success');
            location.reload();
        }
    }
}
window.reactivateProduct = reactivateProduct;

// public/javascript/adminPanel.js

async function deleteCustomRequest(id) {
  const confirmation = await Swal.fire({
    title: '¿Eliminar solicitud?',
    text: "Esta acción no se puede deshacer.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (!confirmation.isConfirmed) return;

    try {
        const response = await fetch(`/api/admin-panel/delete-custom-request/${id}`, {
            method: 'PUT'
        }); //

        const result = await response.json(); //
        if (result.success) {
            await Swal.fire('Solicitud Eliminada', result.message, 'success');
            window.location.reload(); //
        }
    } catch (error) {
        console.error("Error al eliminar la solicitud:", error); //
    }
}

window.deleteCustomRequest = deleteCustomRequest; // Hacerla global para el onclick



async function loadPage(){
     loadStockTable();
     loadDashboard();
     loadTable();
     getPendingCustomRequests();
}
loadPage();

//this saves the stock changes in the database, we need to create a new route and controller for this in the backend
 document.addEventListener("click", (event) => {

  if (!event.target.classList.contains("stock-btn")) return;

  const productId = event.target.getAttribute("data-id");
  const action = event.target.getAttribute("data-action");

  const stockElement = document.getElementById(`stock-${productId}`);

  let currentStock = parseInt(stockElement.textContent);

  if (action === "increase") {
    currentStock++;
  } 
  else if (action === "decrease" && currentStock > 0) {
    currentStock--;
  }

  stockElement.textContent = currentStock;

});
  const saveOrdersBtn = document.getElementById("save-orders-btn");

  saveOrdersBtn.addEventListener("click", async () => {
    const orderUpdates = [];
    const selects = document.querySelectorAll(".order-status-select");

    selects.forEach((select) => {
      orderUpdates.push({
        id_pedido: select.getAttribute("data-id"),
        nuevo_estado: select.value,
      });
    });

    saveOrdersBtn.textContent = "Actualizando...";
    saveOrdersBtn.disabled = true;

    try {
      // Crearemos este nuevo archivo en el backend
      const response = await fetch("/api/admin-panel/update-order-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderUpdates),
      });

      const result = await response.json();

      if (result.success) {
        await Swal.fire('Estados de Pedidos Actualizados', result.message, 'success');
        window.location.reload();
      } else {
        await Swal.fire('Error', "Error: " + result.message, 'error');
      }
    } catch (error) {
      await Swal.fire('Error', "Error de conexión al intentar actualizar los pedidos.", 'error');
    } finally {
      saveOrdersBtn.textContent = "Actualizar Estados de Pedidos";
      saveOrdersBtn.disabled = false;
    }
  });

  // 2. Guardar cambios de stock en el servidor
  saveStockBtn.addEventListener("click", async () => {
    // 1. Recopilar todos los datos de stock de la tabla
    const stockUpdates = [];
    const rows = productStockTableBody.querySelectorAll("tr");

    rows.forEach((row) => {
      const productId = row.getAttribute("data-product-id");
      const stockValue = row.querySelector(".stock-value").textContent;

      stockUpdates.push({
        id: productId,
        stock: parseInt(stockValue), // Aseguramos que sea un número entero
      });
    }); //aqui sekeccionamos todas las filas de la tabla y obtenemos el id y el stock actual,por que esa parte es una tabla

    saveStockBtn.textContent = "Guardando...";
    saveStockBtn.disabled = true;

    // 2. Enviar los datos al script de backend
    try {
      const response = await fetch("/api/admin-panel/update-stock", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stockUpdates), // Enviamos el array completo de cambios
      });

      const result = await response.json();

      if (result.success) {
        await Swal.fire('Stock Actualizado', result.message, 'success');
      } else {
        await Swal.fire('Error', `Error al guardar: ${result.message}`, 'error');
      }
    } catch (error) {
      await Swal.fire('Error', "Error de conexión con el servidor al intentar guardar el stock.", 'error');
    } finally {
      saveStockBtn.textContent = "Guardar Cambios de Stock";
      saveStockBtn.disabled = false;
      window.location.reload();
    }
  });

  //para agregar un nuevo producto
  const addProductForm = document.getElementById("add-product-form");
  const btnAddProduct = document.getElementById("btn-add-product");

  btnAddProduct.addEventListener("click", async (e) => {
    e.preventDefault();

    //  checks if the form is correct
    if (!addProductForm.checkValidity()) {
      addProductForm.reportValidity();
      return; 
    }

    // 2.get all the data we need
    //We use formData to handle th file upload bruh
      const formData = new FormData();

    formData.append("nombre", document.getElementById("new-name").value);
    formData.append("precio", document.getElementById("new-price").value);
    formData.append("stock", document.getElementById("new-stock").value);
    formData.append("categoria", document.getElementById("new-category").value);
    formData.append("descripcion", document.getElementById("new-description").value);
    formData.append("peso_kg", document.getElementById("new-weight").value);

    const file = document.getElementById("new-image").files[0];
    formData.append("imagen", file);


    btnAddProduct.textContent = "Añadiendo...";
    btnAddProduct.disabled = true;

    // we sent the data to the backend, we need to create a new route and controller for this, we will use the same model that we created for the products
    try {
      const response = await fetch("/api/admin-panel/add-product", {
        method: "POST",
        body:formData 
      });

      const result = await response.json();

      if (result.success) {
        await Swal.fire('Producto Añadido', result.message, 'success');
        addProductForm.reset(); // Limpia el formulario
        // Recarga la página para que el nuevo producto aparezca en la tabla de stock
        window.location.reload();
      } else {
        // Muestra el mensaje de error del servidor (incluye errores SQL)
        await Swal.fire('Error', `Error al añadir el producto: ${result.message}`, 'error');
      }
    } catch (error) {
      await Swal.fire('Error', "Error de conexión al servidor al añadir producto.", 'error');
    } finally {
      btnAddProduct.textContent = "Añadir Producto"; // Restaura el texto del botón
      btnAddProduct.disabled = false;
    }
  });

  document.addEventListener("click", async function (e) {
    if (e.target.classList.contains("view-custom-btn")) {
      const id = e.target.getAttribute("data-id");
      const solicitudItem = e.target.parentElement;
      const status = solicitudItem.getAttribute("data-status");

      const approveBtn = document.getElementById("approveBtn");

      if (status === "Aceptada") {
        approveBtn.disabled = true;
        approveBtn.textContent = "Ya aprobado";
      } else {
        approveBtn.disabled = false;
        approveBtn.textContent = "Aprobar";
      }

      try {
        const response = await fetch(
          `/api/admin-panel/customImage/get-image/${id}`,
        );
        const result = await response.json();
        console.log(result);

        if (!result.success) {
          await Swal.fire('Error', "No se pudo cargar la imagen", 'error');
          return;
        }

        const jsonDisenio = result.data.json_disenio;

        // set the image source to the one we got from the server
        const img = document.getElementById("previewImage");
        img.src = jsonDisenio;

        // saves the id of the custom request in the approve button for later use when approving the request
        document.getElementById("approveBtn").setAttribute("data-id", id);

        //  shows the modal
        document.getElementById("customModal").style.display = "block";
      } catch (error) {
        console.error("Error cargando imagen:", error);
      }
    }
  });

  document.getElementById("closeModal").onclick = function () {
    document.getElementById("customModal").style.display = "none";
  };

  window.onclick = function (event) {
    const modal = document.getElementById("customModal");
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  document.getElementById("approveBtn").addEventListener("click", async function () {

  const requestId = this.getAttribute("data-id");
  console.log("Aprobar solicitud con ID:", requestId);
  // we sent this to updat the status order to accepted
  try{
    const response = await fetch(`/api/admin-panel/accept-custom-order/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        //body: JSON.stringify(stockUpdates), // Enviamos el array completo de cambios
      });

      const result = await response.json();
      console.log(result);
  }
  catch(error){
    console.error("Error al aprobar la solicitud:", error);
  }
  

  // close the modal
  document.getElementById("customModal").style.display = "none";
  

  // refersh the page
  window.location.reload();
  // finds the corresponding solicitud item in the list using the requestId
  //const solicitudItem = document.querySelector(`button[data-id="${requestId}"]`).parentElement;
  // we update the status so u cant apprve it againo
  //solicitudItem.setAttribute("data-status", "Aceptada");
  // user data (should come from the backend)
  const correoCliente = solicitudItem.getAttribute("data-email");
  const telefonoCliente = solicitudItem.getAttribute("data-phone");

  // add contact icons with links to email and whatsapp using the user data, we will need to add the email and phone number as data attributes in the backend when rendering the pending requests list
  solicitudItem.innerHTML += `
    <span style="margin-left:10px;">
      <a href="mailto:${correoCliente}" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" width="20">
      </a>

      <a href="https://wa.me/${telefonoCliente}" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" width="20">
      </a>
    </span>
  `;
});

//section navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');

    function showSection(id) {
        // 1. Limpiar estado previo: Ocultar todas las secciones
        sections.forEach(s => s.classList.remove('active'));
        
        // 2. Limpiar estado de los botones del menú
        navLinks.forEach(l => l.classList.remove('active-link'));

        // 3. Activar la sección correspondiente
        const target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
            // Forzar el scroll al inicio de la página para que no se quede "abajo"
            window.scrollTo(0, 0); 
        }

        // 4. Marcar el botón del menú como activo
        const activeLink = document.querySelector(`nav a[href="#${id}"]`);
        if (activeLink) {
            activeLink.classList.add('active-link');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Detiene el comportamiento de scroll automático del navegador
            const id = link.getAttribute('href').substring(1);
            showSection(id);
            window.location.hash = id; // Actualiza la URL sin saltar
        });
    });

    // Iniciar en Dashboard o en el hash actual si existe
    const initialId = window.location.hash.substring(1) || 'dashboard';
    showSection(initialId);
}

// Llama a esta función al final de tu DOMContentLoaded
setupNavigation();


//open modal to show details of the order
document.addEventListener("click", async function(e){

  if(!e.target.classList.contains("view-order-btn")) return;

  const orderId = e.target.getAttribute("data-id");


  const modalTitle = document.getElementById("orderTitle");
  const list = document.getElementById("orderProducts");
  const extraInfo = document.getElementById("orderExtraInfo");
  // 1. Mostrar el modal inmediatamente en estado de "Carga"
    modalTitle.textContent = "Cargando Pedido #" + orderId + "...";
    list.innerHTML = "<li>Cargando datos...</li>";

  try{
    const response = await fetch(`/api/user-page/order-info/${orderId}`);
    const result = await response.json();
    if (result.success && result.data) {
            const order = result.data;

            // 3.title
            modalTitle.textContent = "Detalles del Pedido #" + order.id_pedido;

            // 4. allproducts
            list.innerHTML = order.productos.map(p => `
                <li>Producto ID: ${p.id_producto} - Cantidad: ${p.cantidad}</li>
            `).join("");

            // 5. Pintar la descripción y el envío (La nueva funcionalidad)
            if(extraInfo) {
                extraInfo.innerHTML = `
                    <hr>
                    <p><strong>📍 Dirección de Envío:</strong> ${order.direccion_envio}</p>
                    <p><strong>📝 Notas / Descripción:</strong> ${order.detalle_string_pedido}</p>
                `;
            }
        } else {
            modalTitle.textContent = "Error al cargar pedido";
            list.innerHTML = `<li>${result.message || 'No se encontró información'}</li>`;
        }

  }catch(error){
    console.error("Error al cargar detalles del pedido:", error);
  }

  
  //shoes the modal
  document.getElementById("orderModal").style.display = "block";

});


// Función para abrir el modal y cargar los datos actuales
window.openEditModal = function(prod) {
    document.getElementById('edit-id').value = prod.id_producto;
    document.getElementById('edit-name').value = prod.nombre;
    document.getElementById('edit-price').value = prod.precio_unitario;
    document.getElementById('edit-category').value = prod.categoria || ""; // Ajusta según tu columna en la DB
    document.getElementById('edit-weight').value = prod.peso || "";
    document.getElementById('edit-description').value = prod.descripcion || "";
    
    document.getElementById('editProductModal').style.display = 'block';
};

// Evento para enviar la edición
document.getElementById('edit-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-id').value;
    
    const updatedData = {
        nombre: document.getElementById('edit-name').value,
        precio: document.getElementById('edit-price').value,
        categoria: document.getElementById('edit-category').value,
        peso: document.getElementById('edit-weight').value,
        descripcion: document.getElementById('edit-description').value
    };

    try {
        const res = await fetch(`/api/admin-panel/update-product/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        const result = await res.json();
        if (result.success) {
            await Swal.fire('Producto Actualizado', result.message, 'success');
            location.reload();
        }
    } catch (error) {
        console.error("Error al actualizar:", error);
    }
});

window.closeEditModal = function() {
    const modal = document.getElementById('editProductModal');
    if (modal) {
        modal.style.display = 'none';
    }
};

// closes detail order modal
document.getElementById("closeOrderModal").addEventListener("click", function(){
  document.getElementById("orderModal").style.display = "none";
});



// Lógica para mostrar/ocultar historial
  const toggleHistoryBtn = document.getElementById('toggle-history-btn');
  const historyContainer = document.getElementById('full-history-container');
  const btnSearchHistory = document.getElementById('btn-search-history');
  
  toggleHistoryBtn.addEventListener('click', () => {
      if (historyContainer.style.display === 'none') {
          historyContainer.style.display = 'block';
          toggleHistoryBtn.textContent = 'Ocultar historial';
      } else {
          historyContainer.style.display = 'none';
          toggleHistoryBtn.textContent = 'Ver historial completo';
      }
  });


  // Lógica para buscar en el historial
  btnSearchHistory.addEventListener('click', async () => {
      const searchEmail = document.getElementById('search-email').value;
      
      const tbody = document.getElementById('fullHistoryTableBody');
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Buscando...</td></tr>';

      try {
          // Usamos query params para mandar la fecha y nombre al backend
          const response = await fetch(`/api/admin-panel/filteredOrders/${searchEmail}`);
          const result = await response.json();

          if (result.success && result.data.length > 0) {
              tbody.innerHTML = result.data.map(pedido => `
                  <tr>
                      <td>#${pedido.id_pedido}</td>
                      <td>${pedido.correo}</td>
                      <td>${pedido.fecha_pedido}</td>
                      <td>$${parseFloat(pedido.total).toFixed(2)}</td>
                      <td>${pedido.estado_pedido}</td>
                      <td>${pedido.detalle_string_pedido}</td>

                  </tr>
              `).join('');
          } else {
              tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No se encontraron pedidos con ese email.</td></tr>';
          }
      } catch (error) {
          console.error("Error buscando historial:", error);
          tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Error de conexión.</td></tr>';
      }
  });

document.querySelector(".logOut-button").addEventListener("click", async function(){
  // Clear the token from localStorage
  window.location.href = "/api/delete-user-session";
})

})