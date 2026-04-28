
async function loadUserAccount() 
{
    try
    {
        //we gonna fetch the session to use to build the cointainer
        const response = await fetch('http://localhost:3000/api/user-page/basic-info');
        const result = await response.json();
        console.log('User basic info:', result);
        const containerDataUser=document.querySelector('.container');

        // we gonna add the user data to the container
        containerDataUser.innerHTML=`
        <section class="account-card">
            <h2>Bienvenido</h2>
            <p><strong>Email: ${result.correo}</strong></p>
            <p><strong>Teléfono:</strong> <span id="displayPhone">${result.telefono}</span></p>
            <button class="btn-iniciarSesion" onclick="openEditModal()">Editar perfil</button>
            </section>

    <div class="tabs-container" style="margin-top: 30px;">
            
            <div class="tabs-header">
                <button class="tab-link active" onclick="openTab(event, 'tabNormales')">Mis Pedidos Normales</button>
                <button class="tab-link" onclick="openTab(event, 'tabPersonalizados')">Solicitudes Personalizadas</button>
            </div>

            <div id="tabNormales" class="tab-content" style="display: block;">
                <section class="account-card">
                    <div class="userOrders"></div>
                </section>
            </div>

            <div id="tabPersonalizados" class="tab-content" style="display: none;">
                <section class="account-card">
                    <div class="customRequests"></div>
                </section>
            </div>

        </div>

        <div id="editProfileModal" class="modal" style="display: none;">
            <div class="modal-content" style="max-width: 400px;">
                <span class="close-btn" onclick="closeEditModal()">&times;</span>
                <h2>Editar Perfil</h2>
                <p>Actualiza tus datos de contacto.</p>
                
                <div style="margin-top: 15px;">
                    <label for="inputNewPhone" style="display: block; margin-bottom: 5px;"><strong>Teléfono:</strong></label>
                    <input type="tel" id="inputNewPhone" value="${result.telefono !== 'No registrado' ? result.telefono : ''}" placeholder="Ej: 8182838485" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc;">
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button class="btn-iniciarSesion" style="background-color: #666;" onclick="closeEditModal()">Cancelar</button>
                    <button class="btn-iniciarSesion" onclick="saveNewPhone()">Guardar Cambios</button>
                </div>
            </div>
        </div>
        `;

        window.onclick = function(event) {
            const modal = document.getElementById('editProfileModal');
            if (event.target === modal) {
                closeEditModal();
            }
        }

    }
    catch (error)
    {
        console.error('Error fetching user account data:', error);
    }

}

function openTab(evt, tabName) {
    //we hide all the órders
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    // the same hide the header of the tabs
    const tabLinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // 3. we target the tab we clicked and show it,also added the active class to the button
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function openEditModal() {
    // Usamos 'flex' en lugar de 'block' para que el contenido se centre bien en pantalla
    document.getElementById('editProfileModal').style.display = 'flex'; 
}

function closeEditModal() {
    document.getElementById('editProfileModal').style.display = 'none';
}

async function saveNewPhone() {
    const newPhone = document.getElementById('inputNewPhone').value;

    if (!newPhone) {
        alert("Por favor ingresa un número válido");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/user-page/update-phone', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ telefono: newPhone })
        });

        const data = await response.json();
        
        if (data.success) {
            document.getElementById('displayPhone').innerText = newPhone;
            closeEditModal(); // Cerramos el modal automáticamente al tener éxito
            alert("Teléfono actualizado correctamente");
        } else {
            alert("Error al actualizar: " + data.message);
        }
    } catch (error) {
        console.error('Error actualizando teléfono:', error);
    }
}

async function loadOrders()
{
    //we fetch the orders of the user to load them in html
    const response = await fetch('http://localhost:3000/api/user-page', {
    method: 'GET',
    credentials: 'include' // sent cookies with the request
  });
    const result = await response.json();
    const ordersContainer = document.querySelector('.userOrders');
    for (const order of result)
        {
            ordersContainer.innerHTML += `
            <div class="order-item">
                <p><strong>Pedido #${order.id_pedido}</strong></p>
                <p>Fecha: ${new Date(order.fecha_envio).toLocaleDateString()}</p>
                <p>Total: $${order.suma_total}</p>
                <p>Estado: ${order.estado_pedido}</p>

                 <div class="order-button">
                    <a href="ordersDetails.html?id=${order.id_pedido}" class="btn-ver-detalles">Ver Detalles</a>
                </div>
            </div>
            `;
        }
    console.log('User orders data:', result);

}

async function showImageCustomRequest(id_solicitud)
{
    try
    {
        const image = await fetch(`/api/custom-request/get-image/1004`)
        const result = await image.json();
        const imageContainer = document.querySelector('.imagePreview');
        imageContainer.src = result.json_disenio;
    }
    catch (error)    {
        console.error('Error fetching custom request image:', error);
    }
}

async function loadCustomRequests() {
    try {
        const response = await fetch('http://localhost:3000/api/user-page/custom-requests', {
            method: 'GET',
            credentials: 'include'
        });

        const result = await response.json();
        const container = document.querySelector('.customRequests');

        if (result.length === 0) {
            container.innerHTML = `<p>No tienes solicitudes personalizadas.</p>`;
            return;
        }

        container.innerHTML = result.map(req => `
            <div class="custom-card">
                <p><strong>Solicitud #${req.id_solicitud}</strong></p>
                <p>Fecha: ${req.fecha_solicitud}</p>
                <p>Producto: ${req.tipo_producto}</p>
                <p>Estado: ${req.estado}</p>
                <p class="instructions">${req.instrucciones}</p>

                ${
                    req.json_disenio
                    ? `<button onclick='showCustomDesign(${JSON.stringify(req.json_disenio)})'>
                        Ver diseño
                       </button>`
                    : ''
                }
            </div>
        `).join('');

    } catch (error) {
        console.error('Error:', error);
    }
}

function showCustomDesign(imageJson) {

    // crear fondo
    const modal = document.createElement('div');
    modal.classList.add('modal');

    // contenido
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <img src="${imageJson}" alt="Diseño personalizado">
        </div>
    `;

    // agregar al body
    document.body.appendChild(modal);

    // cerrar con X
    modal.querySelector('.close-btn').onclick = () => modal.remove();

    // cerrar haciendo click afuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserAccount();
    loadOrders();
    loadCustomRequests();
    const leaveAccountButton = document.getElementById('logOutUser');
    leaveAccountButton.addEventListener('click', () => 
        {
            window.location.href = '../html/FakeShop.html';
        })
});