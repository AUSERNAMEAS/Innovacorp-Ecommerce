document.getElementById('register-form').addEventListener('submit', async function(e) {
    // 1. DETENER EL ENVÍO AUTOMÁTICO DE HTML
    e.preventDefault();

    // 2. Obtener los valores que escribió el usuario
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const phone = document.getElementById('reg-phone').value;

    // ==========================================
    // 3. TUS CONDICIONES (VALIDACIONES) AQUÍ
    // ==========================================
    
    // Condición de ejemplo: Contraseña muy corta
    if (password.length < 8) {
        await Swal.fire(
            'Contraseña Incorrecta',
            'Por seguridad, la contraseña debe tener al menos 8 caracteres.',
            'error'
        );
        return; // El 'return' cancela todo y el formulario NO se envía
    }

    // Condición de ejemplo: Teléfono no válido
    if (phone.length !== 10) {
        await Swal.fire(
            'Teléfono Incorrecto',
            'El número de teléfono debe tener exactamente 10 dígitos.',
            'error'
        );
        return;
    }

    // ==========================================
    // 4. sent to the api
    // ==========================================
    try {
        // Usamos Fetch para enviar los datos a tu backend sin recargar la página
        const response = await fetch('/api/createUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // Empaquetamos los datos en formato JSON
            body: JSON.stringify({ 
                name: name, 
                email: email, 
                password: password, 
                phone: phone 
            })
        });

        const result = await response.json();

        // 5. Manejar la respuesta del servidor
        if (response.ok) { // o if(result.success) dependiendo de cómo armaste tu backend
            await Swal.fire(
                '¡Cuenta Creada!',
                'Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.',
                'success'
            );
            // Limpiamos el formulario
            document.getElementById('register-form').reset();
            // Lo mandamos directo a la vista de Iniciar Sesión
            showLogin(); 
        } else {
            await Swal.fire(
                'Error al Crear Cuenta',
                result.message || 'Ocurrió un error al crear tu cuenta. Por favor, intenta nuevamente.',
                'error'
            );
        }

    } catch (error) {
        console.error("Error de conexión:", error);
        await Swal.fire(
            'Error de Conexión',
            'Ocurrió un error al conectar con el servidor.',
            'error'
        );
    }
});


document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const  response = await fetch('/api/search-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ loginEmail: email, loginPassword: password })
    });

    const result = await response.json();
    console.log("Respuesta del servidor:", result);
    if (!result.success) 
        {
        await Swal.fire(
            'Error al Iniciar Sesión',
            result.message || 'Ocurrió un error al iniciar sesión. Por favor, intenta nuevamente.',
            'error'
        );
    } 
    else 
        {
        await Swal.fire(
            '¡Bienvenido!',
            'Has iniciado sesión exitosamente.',
            'success'
        );
        window.location.href = result.redirectUrl; // Redirige a la URL proporcionada por el backend


}});
