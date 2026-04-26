document.addEventListener('DOMContentLoaded', () => {
    loadUserAccount();
    //checkout.js
    const cardOption = document.getElementById('card-option');
    const cardDetails = document.getElementById('card-details');
    const payBtn = document.getElementById("pay-btn");
    const checkoutForm = document.getElementById("checkout-form");
    const paypalOption = document.getElementById('paypal-option');
    const paypalContainer = document.getElementById('paypal-button-container');
    // logic to show and hide paypal button
    
   
    // 1. Obtener carrito guardado
    const carritoString = sessionStorage.getItem('carritoTemporal');
    const carrito = JSON.parse(carritoString || '[]');
    //console.log("Carrito cargado:", carrito);
    const descripcionPedido = carrito.map(item => {
    // Si tiene talla la ponemos, si no, lo dejamos normal
    const detalleTalla = item.talla ? ` (Talla: ${item.talla})` : '';
    return `${item.quantity}x ${item.nombre}${detalleTalla}`;
}).join(', ');

console.log("Descripción del pedido:", descripcionPedido);


    

    //  PAYPAL BUTTON
    paypal.Buttons({

        // here we use the sdk to create the order,we sent  an object 
        createOrder: function (data, actions) {

            const { totalPagar } = calculateTotal(carrito);

            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: totalPagar
                    }
                }],
                // feature to not ask for shipping
                application_context: {
            shipping_preference: "NO_SHIPPING"
        }
            });
        },

        // 🧠 On payment success
        onApprove: async function (data, actions) {
            //actions are pre built function by paypak
            /*
            const details = await actions.order.capture();
            console.log("Pago aprobado:", details);*/
            console.log("Pago aprobado por usuario. ID de PayPal:", data.orderID);

            const datosEnvio = getShippingData();
            const { totalPagar, costoEnvio } = calculateTotal(carrito);

            const datosPedido = {
                carrito,
                datos_envio: datosEnvio,
                metodo_pago: 'paypal',
                total_final: totalPagar,
                costo_envio: costoEnvio,
                descripcion: descripcionPedido,
                paypal_id: data.orderID
            };

            try {
                const response = await fetch('http://localhost:3000/api/create-new-order', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosPedido)
                });

                const result = await response.json();

                if (result.success) {
                    console.log("Pedido creado con éxito:", result);
                    alert('Pago exitoso y pedido creado');
                    sessionStorage.removeItem('carritoTemporal');
                    window.location.href = '/html/FakeShop.html';
                } else {
                    alert(`Error: ${result.message}`);
                }

            } catch (error) {
                alert('Error de conexión con el servidor');
            }
        },

        onCancel: function () {
            alert('Pago cancelado');
        },

        onError: function (err) {
            console.error(err);
            alert('Error en PayPal');
        }

    }).render('#paypal-button-container');

        paypalContainer.style.display = 'block';

});

// this should be on a utils folder ngl

function calculateTotal(carrito) {
    let subtotal = carrito.reduce((acc, item) =>
        acc + parseFloat(item.precio_unitario) * item.quantity, 0);

    const costoEnvio = subtotal > 0 ? 80 : 0;
    const totalPagar = (subtotal + costoEnvio).toFixed(2);

    return {
        totalPagar,
        costoEnvio: costoEnvio.toFixed(2)
    };
}

function getShippingData() {
    return {
        nombre: document.getElementById('name').value,
        apellido: document.getElementById('lastname').value,
        direccion: document.getElementById('address').value,
        ciudad: document.getElementById('city').value,
        telefono: document.getElementById('phone').value
    };
}




async function loadUserAccount() 
{
    try
    {
        //we gonna fetch the session to use to build the cointainer
        const response = await fetch('http://localhost:3000/api/main-page');
        const result = await response.json();
        console.log('User account data:', result);
        

    }
    catch (error)
    {
        console.error('Error fetching user account data:', error);
    }

}
