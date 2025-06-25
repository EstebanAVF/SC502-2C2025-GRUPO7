document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('loginFormActual');
    const registerForm = document.getElementById('registerFormActual');

    // Referencias a elementos de la barra de navegación para instancialos en este .js
    // estos elementos viene del Html
    const loginButtonContainer = document.getElementById('loginButtonContainer');
    const userProfileContainer = document.getElementById('userProfileContainer');
    const nombreUsuarioDisplay = document.getElementById('nombreUsuarioDisplay');
    const logoutButton = document.getElementById('logoutButton');

    // URL base para los scripts PHP
    const BASE_URL = 'http://localhost/Proyecto/';

    // Funcion para actualizar la informacion de la barra de navegacion
    function updateNavbarUI(loggedIn = false, nombreUsuario = '') {
        // Comprueba si el usuario ha iniciado sesion.
        if (loggedIn) {
            // Oculta el contenedor del boton Iniciar Sesion
            loginButtonContainer.classList.add('d-none');
            // Muestra el contenedor del perfil del usuario quitando la clase que lo oculta.
            userProfileContainer.classList.remove('d-none');
            // Pone el nombre del usuario
            nombreUsuarioDisplay.textContent = nombreUsuario;
        } else {
            // Lo mismo pero al reves
            loginButtonContainer.classList.remove('d-none');
            userProfileContainer.classList.add('d-none');
            nombreUsuarioDisplay.textContent = 'Usuario';
            localStorage.removeItem('nombreUsuario');
        }
    }

    // Cargar el estado de la sesion al inicio
    // Revisa si hay un nombre de usuario guardado en la memoria del navegador.
    const storednombreUsuario = localStorage.getItem('nombreUsuario');
    // si esta el nombre de usuario
    if (storednombreUsuario) {
        // actualiza la barra de navegacion
        updateNavbarUI(true, storednombreUsuario);
    } else {
        updateNavbarUI(false);
    }

    // Manejar el envio del formulario de Login
    if (loginForm) { // Verifica si el elemento existe
        // Añade un "escuchador" que se activa cuando el usuario envíe el formulario.
        // 'async' permite usar 'await' para esperar respuestas de la red.
        loginForm.addEventListener('submit', async (event) => { 
            // Evita que el formulario recargue la página
            event.preventDefault();
            // Se ontienen los datos
            const email = document.getElementById('emailInput').value;
            const password = document.getElementById('passwordInput').value;

            try {
                 // Envía los datos al servidor login.php y espera la respuesta.
                const response = await fetch(BASE_URL + 'login.php', {
                    method: 'POST',
                    headers: {
                        // Avisa al servidor que los datos enviados estan en formato JSON.
                        'Content-Type': 'application/json'
                    },
                    // Convierte el objeto JavaScript con email/password a texto JSON.
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                // Si la respuesta del servidor fue exitosa
                if (response.ok && data.success) {
                    // Se muestra el mensaje de EXITO -------------- este mensaje se puede mejorar en diseño
                    alert(data.message);
                     // Obtiene una referencia al modal ventana flotante de login 
                    const loginModalInstance = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                    // Si el modal existe, lo oculta.
                    if (loginModalInstance) {
                        loginModalInstance.hide();
                    }
                    // Guarda el nombre del usuario en el navegador para recordarlo en futuras visitas.
                    localStorage.setItem('nombreUsuario', data.user.nombre);
                    // llama a la funcion para actualizar la barra de nav
                    updateNavbarUI(true, data.user.nombre);
                } else {
                    alert('Error al iniciar sesión: ' + (data.message || 'Credenciales inválidas.'));
                }
            } catch (error) {
                console.error('Error de red o del servidor:', error);
                alert('Ocurrió un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
            }
        });
    }

    // Manejar el envío del formulario de Registro
    if (registerForm) { // Verifica si el elemento existe
        registerForm.addEventListener('submit', async (event) => { 
            event.preventDefault();
             // Recopilación de datos del formulario 
            const nombre = document.getElementById('registerNombreInput').value;
            const apellido = document.getElementById('registerApellidoInput').value;
            const email = document.getElementById('registerEmailInput').value;
            const password = document.getElementById('registerPasswordInput').value;
            const confirmPassword = document.getElementById('confirmPasswordInput').value;
            // Para los checkboxes, se usa .checked para saber si esta marcado devuelve true o false.
            const termsCheck = document.getElementById('termsCheck').checked;

            // --- Validaciones del lado del cliente antes de enviar al servidor
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden.');
                return;
            }
            if (!termsCheck) {
                alert('Debes aceptar los Términos y Condiciones.');
                return;
            }

            try {
                // Realiza una petición asíncrona a registro (registro.php).
                const response = await fetch(BASE_URL + 'registro.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre, apellido, email, password })
                });

                const data = await response.json();
                // Si la peticion fue exitosa el servidor confirma que el registro fue correcto...
                if (response.ok && data.success) {
                    // Se muestra el mensaje de EXITO -------------- este mensaje se puede mejorar en diseño
                    alert(data.message);
                     // Obtiene una referencia al modal (ventana emergente) de registro
                    const registerModalInstance = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                    // Si la referencia al modal existe, lo oculta.
                    if (registerModalInstance) {
                        registerModalInstance.hide();
                    }
                } else {
                    alert('Error al registrar: ' + (data.message || 'Hubo un problema con el registro.'));
                }
            } catch (error) {
                console.error('Error de red o del servidor:', error);
                alert('Ocurrió un error al intentar registrarte. Por favor, inténtalo de nuevo más tarde.');
            }
        });
    }

    // Manejar el botón de Cerrar Sesión
    if (logoutButton) {
        // Añade un "escuchador" que se activa cuando el usuario hace clic en el boton.
        logoutButton.addEventListener('click', async (event) => {
            event.preventDefault();

            try {
                // Realiza una peticion al servidor logout.php para destruir la sesion del lado del servidor.
                const response = await fetch(BASE_URL + 'logout.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                // espera y convierte la respuesta del servidor
                const data = await response.json();
                // Si la peticion  y el cierre de sesion en el servidor fueron exitosos
                if (response.ok && data.success) {
                    alert(data.message);
                    // se llama a la funcion principal para reiniciar el estado de sesión cerrada.
                    // Esto ocultara el perfil, mostrara el botón de login y limpiara el localStorage.
                    updateNavbarUI(false);
                } else {
                    alert('Error al cerrar sesión: ' + (data.message || 'No se pudo cerrar la sesión.'));
                }
            } catch (error) {
                console.error('Error de red o del servidor al cerrar sesión:', error);
                alert('Ocurrió un error al intentar cerrar sesión. Por favor, inténtalo de nuevo más tarde.');
            }
        });
    }

    // Manejar el botón de Configuraciones
    // Esto es una prevista para luego haceruso de configuraciones
    const settingsButton = document.getElementById('settingsButton');
    if (settingsButton) {
        settingsButton.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Haz clic en Configuraciones. Aquí iría la lógica para mostrar la página o modal de configuraciones.');
        });
    }
});