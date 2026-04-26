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
    
    // Lógica para mostrar u ocultar detalles de tarjeta
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (cardOption.checked) {
                cardDetails.style.display = 'block';
                cardDetails.querySelectorAll('input').forEach(input => input.required = true);
            } 
            else if (paypalOption.checked) 
                {
                cardDetails.style.display = 'none';
                paypalContainer.style.display = 'block';
                payBtn.style.display = 'none'; // ❗ hide normal button

            }
        });
    });

    // 1. Obtener carrito guardado
    const carritoString = sessionStorage.getItem('carritoTemporal');
    const carrito = JSON.parse(carritoString || '[]');

    // 2. Click del botón de pago (función principal)
    payBtn.addEventListener('click', async (e) => {
        e.preventDefault(); 
        if (!checkoutForm.checkValidity() || carrito.length === 0) {
            checkoutForm.reportValidity();
            if(carrito.length === 0) alert('Su carrito está vacío, no se puede pagar.');
            return;
        }

        // 3. Recolectar datos
        const datosEnvio = {
            nombre: document.getElementById('name').value,
            apellido: document.getElementById('lastname').value,
            direccion: document.getElementById('address').value,
            ciudad: document.getElementById('city').value,
            telefono: document.getElementById('phone').value
        };

        const metodoPago = document.querySelector('input[name="payment-method"]:checked').value;
        let subtotal = carrito.reduce((acc, item) => acc + parseFloat(item.precio_unitario) * item.quantity, 0);
        const costoEnvio = subtotal > 0 ? 80 : 0; 
        const totalPagar = subtotal + costoEnvio; 

        const datosPedido = {
            carrito: carrito,
            datos_envio: datosEnvio,
            metodo_pago: metodoPago,
            total_final: totalPagar.toFixed(2),
            costo_envio: costoEnvio.toFixed(2)
        };
        
        payBtn.textContent = 'Procesando...';
        payBtn.disabled = true;

        // 4. Enviar datos al PHP
        try {
            const response = await fetch('http://localhost:3000/api/create-new-order', {
                method: 'POST',
                credentials: 'include', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosPedido) 
            });

            const result = await response.json();
            console.log('Respuesta del servidor:', result);

            if (result.success) {
                alert(` ${result.message}`);
                sessionStorage.removeItem('carritoTemporal'); 
                window.location.href = '/html/FakeShop.html'; 
            } else {
                alert(`Error al procesar el pedido: ${result.message}`);
            }

        } catch (error) {
            alert('Error de conexión con el servidor.');
        } finally {
            payBtn.textContent = 'Realizar Pago';
            payBtn.disabled = false;
        }
    });

    if (cardOption.checked) {
        cardDetails.style.display = 'block';
    }

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

            const details = await actions.order.capture();
            console.log("Pago aprobado:", details);

            const datosEnvio = getShippingData();
            const { totalPagar, costoEnvio } = calculateTotal(carrito);

            const datosPedido = {
                carrito,
                datos_envio: datosEnvio,
                metodo_pago: 'paypal',
                total_final: totalPagar,
                costo_envio: costoEnvio,
                paypal_id: details.id
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
                    alert('Pago completado ✅');
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

    // Default state
    if (cardOption.checked) {
        cardDetails.style.display = 'block';
        paypalContainer.style.display = 'none';
    }
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
