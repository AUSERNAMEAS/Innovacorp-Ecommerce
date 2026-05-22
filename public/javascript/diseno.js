
// Arreglo de productos con sus detalles
let allProducts = [];
  
// selecciona los elementos del html
const productGrid = document.getElementById('product-grid');
const loadMoreBtn = document.getElementById('load-more-btn');
const cartItemsDiv = document.getElementById('cart-items');
const cartSubtotalSpan = document.getElementById('cart-subtotal');
const cartShippingSpan = document.getElementById('cart-shipping');
const cartTotalSpan = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const cartPanel = document.getElementById('cart'); // El <section id="cart">
const cartIcon = document.getElementById('cart-icon'); 
const closeCartBtn = document.getElementById('close-cart');
const cartCountSpan = document.getElementById('cart-count'); // El span dentro del ícono del carrito

let cart = [];
let productsShown = 3;

/**
 * Renderiza los productos con selector de tallas
 */

function goToProduct(id){
    window.location.href = `../html/product.html?id=${id}`;
} 
// we use the same function to render the products but now we add a parameter to filter the products by category
function renderProducts(filteredProducts = allProducts) {
    if (!productGrid) {
        console.error('No se encontró el contenedor #product-grid');
        return;
    }
    productGrid.innerHTML = '';
    for (let i = 0; i < filteredProducts.length; i++) {
        if (filteredProducts[i]) {
            const product = filteredProducts[i];
            const productCard = document.createElement('div');
            const isInactive = product.estado_producto && product.estado_producto.trim().toLowerCase() === 'inactivo';
            let sizeHTML = ``;
            productCard.className = 'product-card';
            productCard.onclick = () => goToProduct(product.id_producto);

            // 2. Apply css if the product is inactive or the stock is 0
        if (isInactive || product.stock === 0   ) {
            productCard.classList.add('is-disabled');
        }

        // only be able to click if the product is active
        productCard.onclick = () => {
            if (!isInactive) goToProduct(product.id_producto);
        };

            if(product.categoria === 'camisa' || product.categoria === 'sueter')
            {
                sizeHTML = `
                <div style="margin-bottom:10px;">
                    <label>Talla: </label>
                    <select id="talla-${product.id_producto}"  onclick="event.stopPropagation()" ${isInactive ? 'disabled' : ''}>
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>
                `;
            }
            productCard.innerHTML = `
                <h3>${product.nombre}</h3>
                <img src="/${product.imagen}" alt="${product.nombre}">
                <p>$${product.precio_unitario.toFixed(2)} MXN</p>
                ${sizeHTML}

                <button 
                onclick="event.stopPropagation(); prepararCompra(${product.id_producto})" 
                ${isInactive ? 'disabled style="background-color: #666; cursor: not-allowed;"' : ''}>
                ${isInactive ? 'No Disponible' : 'Agregar al Carrito'}
            </button>

                
            `;
            productGrid.appendChild(productCard);
        }
    }
}

// Función intermedia para capturar la talla seleccionada
function prepararCompra(productId) {
    const select = document.getElementById(`talla-${productId}`);
    const tallaSeleccionada = select ? select.value : '';
    addToCart(productId, tallaSeleccionada);
}

/**
 * Modificación de addToCart con TALLA y LÍMITE DE 10
 */
function addToCart(productId, talla) {
    const productToAdd = allProducts.find(p => p.id_producto === productId);

     // Total de este producto en el carrito, sumando todas las tallas
    const totalEnCarrito = cart
        .filter(item => item.id_producto === productId)
        .reduce((sum, item) => sum + item.quantity, 0);

    if (totalEnCarrito >= productToAdd.stock) {
        Swal.fire({
            icon: 'warning',
            title: 'Stock Insuficiente',
            text: `Solo hay ${productToAdd.stock} unidades disponibles en total.`
        });
        return;
    }

    const existingItem = cart.find(item => item.id_producto === productId && item.talla === talla);
    //console.log('Producto a agregar:', productToAdd);
    if (existingItem) 
    {
         existingItem.quantity++;
    } 
    else 
    {
        cart.push({ ...productToAdd, quantity: 1, talla: talla });
    }
    // this change the alert to show the size if it exists
    if (talla) 
    {
        Swal.fire({
        icon: 'success',
        title: '¡Agregado!',
        text: talla ? `${productToAdd.nombre} (Talla ${talla}) agregado al carrito.` : `${productToAdd.nombre} agregado al carrito.`,
        timer: 1500, // Closes after 1.5 seconds
        showConfirmButton: false,
        position: 'top-end',
        toast: true
    });
    } else 
    {
        Swal.fire({
        icon: 'success',
        title: '¡Agregado!',
        text: `${productToAdd.nombre} agregado al carrito.`,
        timer: 1500, // Closes after 1.5 seconds
        showConfirmButton: false,
        position: 'top-end',
        toast: true
    });
    }
    renderCart();
}

async function getFinalImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const baseImg = new Image();
    const designImg = document.getElementById('drag-design');

    // Referencias HTML
    const previewContainer = document.getElementById('preview-container');
    const dropZone = document.getElementById('drop-zone');

    return new Promise((resolve) => {
        baseImg.onload = () => {
            // 1. Configurar canvas al tamaño real del archivo (ej: 2000px)
            canvas.width = baseImg.width;
            canvas.height = baseImg.height;

            // Dibujar playera
            ctx.drawImage(baseImg, 0, 0);

            if (designImg) {
                // 2. ESCALA REAL (Ancho Canvas / Ancho Visual de la playera)
                const scale = canvas.width / previewContainer.offsetWidth;

                // 3. MEDIDAS VISUALES (Píxeles CSS en pantalla)
                // Usamos offsetLeft/Top porque miden relativo al padre que tenga 'relative'.
                // visualX/Y será la posición del diseño RELATIVA al drop-zone.
                const visualX = designImg.offsetLeft; 
                const visualY = designImg.offsetTop;
                const visualWidth = designImg.offsetWidth;
                const visualHeight = designImg.offsetHeight;

                // visualZoneX/Y es dónde empieza el cuadro punteado relativo a la playera completa.
                const visualZoneX = dropZone.offsetLeft;
                const visualZoneY = dropZone.offsetTop;

                // 4. POSICIÓN TOTAL VISUAL (Diseño + Zona) RELATIVA A LA PLAYERA
                const totalVisualX = visualZoneX + visualX;
                const totalVisualY = visualZoneY + visualY;

                // 5. TRADUCCIÓN A COORDENADAS DE CANVAS REALES
                const finalX = totalVisualX * scale;
                const finalY = totalVisualY * scale;
                const drawWidth = visualWidth * scale;
                const drawHeight = visualHeight * scale;

                // 6. DIBUJAR DEFINITIVO
                ctx.drawImage(designImg, finalX, finalY, drawWidth, drawHeight);
            }

            resolve(canvas.toDataURL('image/png'));
        };
        
        baseImg.src = "/img/logo/playeraBlanca.png"; // Ruta del archivo real
    });
}
/**
 * Lógica de ARRASTRAR Y SOLTAR (Drag & Drop) para personalización
 */
const dropZone = document.getElementById('drop-zone');
const customImageInput = document.getElementById('custom-image');
let imageBase64 = "";

if (customImageInput) {
    customImageInput.addEventListener('change', function(e) {
        const reader = new FileReader();
        reader.onload = function(event) {
            imageBase64 = event.target.result;
            dropZone.innerHTML = `<img src="${imageBase64}" id="drag-design" draggable="true" style="max-width:100px; cursor:move;">`;
            const dragImg = document.getElementById('drag-design');
            dragImg.addEventListener('dragstart', (ev) => {
                ev.dataTransfer.setData("text", ev.target.id);
            });
        };
        const file = e.target.files[0];

        // Prevent error if no file is selected
        if (!file) {
            console.warn("No file selected");
            return;
        }

        reader.readAsDataURL(file);
            });
        }

if (dropZone) {
    dropZone.addEventListener('dragover', (e) => e.preventDefault());
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
    const data = e.dataTransfer.getData("text");
    const img = document.getElementById(data);
    if (!img) return;

    // 1. Obtenemos las coordenadas del Drop Zone en la pantalla
    const zoneRect = dropZone.getBoundingClientRect();

    // 2. Calculamos dónde cayó el mouse respecto a la esquina del DROP ZONE
    let exactX = e.clientX - zoneRect.left;
    let exactY = e.clientY - zoneRect.top;

    // 3. Posicionamiento ABSOLUTO dentro del Drop Zone
    img.style.position = 'absolute';
    
    // Centramos el diseño en el cursor. Importante usar clientWidth/Height del diseño visual.
    // Esto lo posiciona en píxeles CSS dentro del drop-zone.
    img.style.left = (exactX - (img.clientWidth / 2)) + 'px';
    img.style.top = (exactY - (img.clientHeight / 2)) + 'px';
    });
}
async function enviarSolicitud(e) {
    e.preventDefault();
    //here we get all the data from the form like usual lol
    const personalizedBtn = document.getElementById("btn-personalized");
    const productType = document.getElementById('product-type').value;
    const customImageInput = document.getElementById('custom-image');
    const instructions = document.getElementById('instructions').value;

    const imageFileName = customImageInput.files.length > 0 ? customImageInput.files[0].name : '';
    // 🔥 Generate the final combined image (t-shirt + design)
    const finalImage = await getFinalImage();

    //here we form an bject to send it as json
    //and now we use the finalImage(canvas)
    const requestData = {
        productType: productType,
        instructions: instructions,
        imageFileName: imageFileName,
        imageBase64: finalImage
    };
    console.log('Request Data:', requestData);

    personalizedBtn.textContent = 'Enviando...';
    personalizedBtn.disabled = true;

    try {
        
        const response = await fetch('/api/custom-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();
        //if the response is success we will clear the fields
        if (result.success) 
        {
            Swal.fire('¡Éxito!', result.message, 'success');
            document.getElementById('product-type').value = '';
            document.getElementById('instructions').value = '';
            customImageInput.value = null;
        }
        else
        {
            Swal.fire('Error', 'Error al enviar la solicitud de personalización: ' + result.message, 'error');
        }
        }  
        catch (error) 
        {
            console.log(error)
        } 
        finally 
        {
            personalizedBtn.textContent = 'Enviar Solicitud de Personalización';
            personalizedBtn.disabled = false;
        }
}

async function fetchProducts(){
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        console.log("RAW RESPONSE:", allProducts);
        renderProducts();
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id_producto !== productId);
    renderCart();
}


function renderCart() {
    // if the cart is empty itll show a message
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Tu carrito está vacío.</p>';
        cartSubtotalSpan.textContent = '$0.00 MXN';
        cartShippingSpan.textContent = '$0.00 MXN';
        cartTotalSpan.textContent = '$0.00 MXN';
        checkoutBtn.style.display = 'none';
        if (cartCountSpan) cartCountSpan.textContent = '0'; 
        return;
    }

    checkoutBtn.style.display = 'block';

    let subtotal = 0;
    let totalItems = 0;
    cartItemsDiv.innerHTML = '';
    //itll make a new div for each element in the cart,
    cart.forEach(item => {
        console.log('Renderizando item del carrito:', item);
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <span>${item.nombre} ${item.talla ? `(Talla ${item.talla})` : ''}</span>
            <img src="/${item.imagen}" alt="${item.nombre}" style="width:50px; height:auto;">
            <div class="cart-quantity">
                <button onclick="decreaseQuantity(${item.id_producto})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${item.id_producto})">+</button>
            </div>
            <span>$${(item.precio_unitario * item.quantity).toFixed(2)} MXN</span>
        `;
        cartItemsDiv.appendChild(itemDiv);
        subtotal += item.precio_unitario * item.quantity;
        totalItems += item.quantity;
    });

    // Update the cart count
    if (cartCountSpan) {
        cartCountSpan.textContent = totalItems;
    }

    // if theres no product in the cart shipping is 0
    let shipping;
    if(subtotal>=599){
        shipping= 0;
    }
    else{
        shipping = 99;
    }

    const total = subtotal + shipping;

    cartSubtotalSpan.textContent = `$${subtotal.toFixed(2)} MXN`;
    cartShippingSpan.textContent = `$${shipping.toFixed(2)} MXN`;
    cartTotalSpan.textContent = `$${total.toFixed(2)} MXN`;
}

// Abrir el carrito
if (cartIcon) {
    cartIcon.onclick = () => {
        cartPanel.classList.add('active');
    };
}

// Cerrar el carrito
if (closeCartBtn) {
    closeCartBtn.onclick = () => {
        cartPanel.classList.remove('active');
    };
}

//add an item to the cart if it already exists just increases the quantity
function increaseQuantity(productId) {
    const item = cart.find(arrayProduct => arrayProduct.id_producto === productId);
    console.log('Producto a aumentar cantidad:', item);
    if(item.quantity < item.stock) 
    {
    
        item.quantity++;
        renderCart();
    
    }
    else{
        Swal.fire({
            icon: 'info',
            title: 'Límite alcanzado',
            text: `Solo puedes agregar un máximo de ${item.stock} por producto/talla.`
        });
    }
}

//remove an item from the cart if quantity is 1 else just decreases the quantity
function decreaseQuantity(productId) {
    const item = cart.find(arrayProduct => arrayProduct.id_producto === productId);
    //if its true just decreases
    if (item && item.quantity > 1) {
        item.quantity--;
        renderCart();
    } 
    
        //second case if its 1 just removes it from the cart
    else if (item && item.quantity === 1) {
        removeFromCart(productId);
    }
}
//very
async function verifyUserSession() {
    // we select the span where we will show the user session info and 
    // we make a fetch request to the main page route to verify if the user session exists
    const userSessionDiv = document.querySelector('.userSession');
    const response = await fetch('/api/main-page',{ credentials: "include" });
    const result = await response.json();
    console.log('User session verification result:', result);
    //if the user is logged in we show his email and a logout link
    if(result.logged) 
    {
        userSessionDiv.innerHTML = `
        <span >👋 Hola ${result.user.email}</span>
        <button class="btn-iniciarSesion" id="btnCheckYourAccount">Mi Cuenta</button>
        <button class="btn-iniciarSesion" id="btnLogout">Cerrar sesión</button>
        
        `
        // we add event listeners to the buttons we just created
        // this is done to avoid adding event listeners to elements that dont exist yet
        // we add the event listener to the account button
        const accountBtn = document.getElementById('btnCheckYourAccount');
        accountBtn.addEventListener('click', () => {
            window.location.href = '../html/userAccount.html';
        });
        // we add the event listener to the logout button
        const logoutBtn = document.getElementById('btnLogout');

        logoutBtn.addEventListener('click', () => {
            window.location.href = '/api/delete-user-session';
        })

        //<a href="/html/Useraccount.html" class="btnCheckYourAccount">Mi cuenta</a>
        //<a href="http://localhost:3000/api/delete-user-session" style="margin-left:12px;">Cerrar sesión</a>
    }
    else{
        userSessionDiv.innerHTML = `
        <button class="btn-iniciarSesion" id="btnlogIn">Iniciar sesión</button>
        `;
        //<a href="login.html" style="margin-left:12px;">Iniciar sesión</a>

        // here we add the event listener to the login button
        //the same as before
         const logIn = document.getElementById('btnlogIn');
         logIn.addEventListener('click', () => {
            window.location.href = 'login.html';
        })

    }
}


checkoutBtn.addEventListener('click', async () => {
    const result = await fetch('/api/main-page',{ credentials: "include" });
    const sessionData = await result.json();
    if(!sessionData.logged) {
        Swal.fire({
            icon: 'info',
            title: 'Sesión no iniciada',
            text: 'Por favor, inicia sesión para continuar con el proceso de compra.'
        });
        return;
    }
    sessionStorage.setItem('carritoTemporal', JSON.stringify(cart));
    window.location.href = '../html/checkout.html';
});

document.getElementById('category-filter').addEventListener('change', (e) => {
    const selectedCategory = e.target.value.toLowerCase();
    const productGrid = document.getElementById('product-grid');
    
    // 1. Limpiar el contenedor
    productGrid.innerHTML = '';

    // 2. Filtrar el array
    const filteredProducts = selectedCategory === 'all' 
        ? allProducts 
        : allProducts.filter(p => p.categoria.toLowerCase() === selectedCategory);

    // 3. Volver a renderizar (usa la misma lógica que ya tienes para pintar las tarjetas)
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No se encontraron productos en esta categoría.</p>';
    } else {
        renderProducts(filteredProducts);
        }
});

document.addEventListener('DOMContentLoaded', () => {
    //when we load the page we fetch the products and render them
    fetchProducts();
    renderCart();
    document.getElementById("btn-personalized").addEventListener('click',(event)=>{
        //alert('su solicitud ha sido enviada');
        enviarSolicitud(event);
    })

    verifyUserSession();

    // this is the button we added to the user account page to log out
    //it does the same as the link but as a button


});
