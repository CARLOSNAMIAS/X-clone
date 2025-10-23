/**
 * @file script.js
 * @description Script principal para el clon de Twitter (X).
 * Este archivo maneja toda la interactividad de la interfaz de usuario, incluyendo:
 * - Lógica de la pantalla de carga (splash screen).
 * - Cambio entre modo claro y oscuro.
 * - Renderizado dinámico de tweets desde una base de datos simulada.
 * - Interacciones del usuario (Me gusta, scroll infinito, menús).
 * - Comportamiento responsivo y animaciones de la interfaz.
 * - Gestión del menú lateral (off-canvas) y el botón de acción flotante.
 */

// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DEL SPLASH SCREEN ---
    // Oculta la pantalla de carga después de 2 segundos
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('splash-hidden');
        }, 2000); // Tiempo en milisegundos
    }

    // --- LÓGICA DEL INTERRUPTOR DE TEMA (MODO CLARO/OSCURO) ---
    const themeToggleButton = document.querySelector('[title="Cambiar a modo oscuro"]');
    const body = document.body;

    if (themeToggleButton) {
        const themeIcon = themeToggleButton.querySelector('i');
        const themeColorMeta = document.getElementById('theme-color-meta');

        /**
         * Aplica el tema visual (claro u oscuro) a la aplicación.
         * Modifica la clase del body, cambia el ícono del botón y guarda la preferencia en localStorage.
         * @param {string} theme - El tema a aplicar ('light' o 'dark').
         */
        const applyTheme = (theme) => {
            if (theme === 'light') {
                body.classList.add('light-mode');
                if (themeIcon) themeIcon.classList.replace('bi-moon-stars', 'bi-sun-fill');
                if (themeColorMeta) themeColorMeta.setAttribute('content', '#FFFFFF');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-mode');
                if (themeIcon) themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars');
                if (themeColorMeta) themeColorMeta.setAttribute('content', '#15202B');
                localStorage.setItem('theme', 'dark');
            }
        };

        /**
         * Determina el tema inicial a aplicar, respetando el siguiente orden de prioridad:
         * 1. Preferencia guardada explícitamente por el usuario en localStorage.
         * 2. Preferencia de color del sistema operativo del usuario (prefers-color-scheme).
         * 3. Tema claro como opción por defecto.
         * @returns {string} El tema a aplicar ('light' o 'dark').
         */
        const getInitialTheme = () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme; // Prioridad 1: Tema guardado
            }
            // Prioridad 2: Preferencia del sistema
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark';
            }
            return 'light'; // Prioridad 3: Por defecto
        };

        // Aplica el tema inicial al cargar la página.
        applyTheme(getInitialTheme());

        // Añade un listener al botón para alternar entre los temas cuando se hace clic.
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }

    // --- BASE DE DATOS SIMULADA ---

    /**
     * @const {Array<object>} tweetsData
     * @description Base de datos simulada en formato de array de objetos.
     * Cada objeto representa un tweet con su contenido, autor, metadatos e interacciones.
     * Esta estructura permite una gestión centralizada y facilita el renderizado dinámico del feed.
     */
    const tweetsData = [
        {
            user: "Lauti",
            username: "@lautidev_",
            time: "· 22h",
            content: "Que les parece este bonito lugar para vacacionar? 😍✈️🌍 #TravelGoals",
            image: "img/vacaciones.jpg",
            avatar: "https://i.pravatar.cc/40?u=lautidev_",
            verified: true,
            actions: {
                comments: 96,
                retweets: 11,
                likes: 800,
                views: "91.2K"
            },
            isLiked: false
        },

        {
            user: "Rush",
            username: "@RushColombia",
            time: "",
            content: "El planeta se está calentando, pero tú puedes ayudar a enfriarlo. ♻️🌍 #ActúaAhora",
            image: "img/pexels-pixabay-41953.jpg",
            avatar: "https://i.pravatar.cc/40?u=RushBetColombia",
            verified: true,
            actions: {
                comments: 234,
                retweets: 45,
                likes: 1200, // 1.2K
                views: "45.8K"
            },
            isLiked: false // Este tweet no tiene "me gusta"
        },
        {
            user: "Tech News",
            username: "@technews",
            time: "· 5h",
            content: "Los teclados mecánicos están en tendencia. ¿Cuál es tu switch favorito? 🎮⌨️",
            avatar: "https://i.pravatar.cc/40?u=technews",
            verified: true,
            actions: {
                comments: 234,
                retweets: 45,
                likes: 1200, // 1.2K
                views: "45.8K"
            },
            isLiked: true // Este tweet ya tiene "me gusta"
        },
        {
            user: "DevLife",
            username: "@devlife",
            time: "· 8h",
            content: "Trabajar remoto tiene sus beneficios, pero a veces extraño la oficina. ¿Ustedes qué prefieren? 💻🏠",
            avatar: "https://i.pravatar.cc/40?u=devlife",
            verified: true,
            actions: {
                comments: 156,
                retweets: 23,
                likes: 678,
                views: "28.5K"
            },
            isLiked: false
        },
        // Agrega más tweets aquí...
        {
            user: "Andres ",
            username: "@naturelover",
            time: "· 1h",
            content: "Roma es una ciudad llena de historia y belleza. Cada rincón cuenta una historia diferente. 🇮🇹🌟 #Travel #History",
            image: "img/roma.jpg",
            avatar: "https://i.pravatar.cc/40?u=naturelover",
            verified: false,
            actions: {
                comments: 45,
                retweets: 10,
                likes: 300,
                views: "12.3K"
            },
            isLiked: false
        },

        {
            user: "Roger",
            username: "@RogerF",
            time: "5h",
            content: "¡Ave verde especie en peligro de extinción! 🦜🌿 Protejamos su hábitat y aseguremos un futuro para estas hermosas criaturas. #Conservación #Naturaleza",
            image: "img/ave.jpg",
            avatar: "https://i.pravatar.cc/43?u=adcompany",
            verified: true,
            actions: {
                comments: 100,
                retweets: 32,
                likes: 90,
                views: "1K"
            },
            isLiked: false,
            isAd: false // Marca este tweet como un anuncio
        },

        // Agrega más tweets aquí...

        {
            user: "Carlos ",
            username: "@userr",
            time: "· 1h",
            content: "La naturaleza nos regala paisajes impresionantes. 🌄🍃 #Aventura #Exploración",
            image: "img/nature.jpg",
            avatar: "https://i.pravatar.cc/22?u=userr",
            verified: false,
            actions: {
                comments: 45,
                retweets: 10,
                likes: 30,
                views: "1.3K"
            },
            isLiked: true,
            isAd: false // Marca este tweet como un anuncio
        },


        // Agrega más tweets aquí...
         {
            user: "Carlos ",
            username: "@carlos_13",
            time: "· 1h",
            content: "La pelicula de Star Wars es un clásico que nunca pasa de moda. ¡Que la fuerza te acompañe! 🌌✨ #StarWars #Cine",
            image: "img/startw.jpg",
            avatar: "https://i.pravatar.cc/55?u=carlos_13",
            verified: false,
            actions: {
                comments: 45,
                retweets: 10,
                likes: 300,
                views: "12.3K"
            },
            isLiked: false,
            isAd: false // Marca este tweet como un anuncio
        },


        // Agrega más tweets aquí...
          {
            user: "jose ",
            username: "@jose_13",
            time: "· 3h",
            content: "Los barcos son una maravilla de la ingeniería y la aventura. Navegar por el océano es una experiencia única. #Viaje #Aventura",
            image: "img/barcos.jpg",
            avatar: "https://i.pravatar.cc/12?u=jose_13",
            verified: false,
            actions: {
                comments: 45,
                retweets: 10,
                likes: 320,
                views: "12.3K"
            },
            isLiked: true,
            isAd: false // Marca este tweet como un anuncio

        }





    ];


    // --- RENDERIZADO DINÁMICO ---

    const feed = document.getElementById('feed');

    /**
     * Genera y renderiza todos los tweets en el feed a partir de la base de datos simulada.
     * Limpia el contenido actual del feed y luego añade cada tweet nuevo.
     */
    function renderTweets() {
        feed.innerHTML = ''; // Limpia el contenido actual del feed
        tweetsData.forEach(tweetData => {
            const tweetElement = createTweetElement(tweetData);
            feed.appendChild(tweetElement);
        });
    }

    /**
     * Crea un elemento de tweet (un <article> HTML) a partir de un objeto de datos.
     * @param {object} tweetData - El objeto que contiene toda la información del tweet (usuario, contenido, imagen, etc.).
     * @returns {HTMLElement} El elemento del tweet listo para ser insertado en el DOM.
     */
    function createTweetElement(tweetData) {
        const article = document.createElement('article');
        article.className = `tweet ${tweetData.isAd ? 'ad' : ''}`;

        // Genera el HTML de las acciones solo si no es un anuncio
        const actionsHTML = !tweetData.isAd ? `
            <div class="tweet-actions">
                <button class="action-btn" aria-label="Comentar"><i class="bi bi-chat"></i><span>${tweetData.actions.comments}</span></button>
                <button class="action-btn" aria-label="Retwittear"><i class="bi bi-arrow-repeat"></i><span>${tweetData.actions.retweets}</span></button>
                <button class="action-btn ${tweetData.isLiked ? 'liked' : ''}" aria-label="Me gusta">
                    <i class="bi ${tweetData.isLiked ? 'bi-heart-fill' : 'bi-heart'}"></i>
                    <span>${formatLikes(tweetData.actions.likes)}</span>
                </button>
                <button class="action-btn" aria-label="Ver estadísticas"><i class="bi bi-bar-chart"></i><span>${tweetData.actions.views}</span></button>
                <button class="action-btn" aria-label="Guardar"><i class="bi bi-bookmark"></i></button>
                <button class="action-btn" aria-label="Compartir"><i class="bi bi-share"></i></button>
            </div>
        ` : '';

        article.innerHTML = `
            <header class="tweet-header">
                <div class="tweet-avatar">
                    <img src="${tweetData.avatar}" alt="Avatar de ${tweetData.user}">
                </div>
                <div class="tweet-info">
                    <div class="tweet-header-row">
                        <div>
                            <div class="tweet-user">
                                <span class="tweet-name">${tweetData.user}</span>
                                ${tweetData.verified ? '<i class="bi bi-patch-check-fill verified"></i>' : ''}
                                <span class="tweet-username">${tweetData.username}</span>
                                <span class="tweet-time">${tweetData.time}</span>
                            </div>
                        </div>
                        <i class="bi bi-three-dots tweet-menu"></i>
                    </div>
                    <p class="tweet-content">
                        ${tweetData.content}
                    </p>
                    ${tweetData.image ? `<img src="${tweetData.image}" class="tweet-image" alt="Imagen del tweet de ${tweetData.user}">` : ''}
                </div>
            </header>
            ${actionsHTML}
        `;
        return article;
    }


    // --- INTERACTIVIDAD DE LA INTERFAZ (ESTÁTICA) ---

    // Añade un listener a cada pestaña para cambiar la clase 'active' al hacer clic.
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Añade un listener a cada ítem de la navegación inferior para cambiar la clase 'active'.
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- LÓGICA DEL BOTÓN FLOTANTE Y OVERLAY ---
    const composeBtn = document.getElementById('composeBtn');
    const floatingContainer = document.querySelector('.floating-container');
    const overlay = document.getElementById('overlay');

    /**
     * Cierra el menú de acción flotante y desactiva el overlay.
     */
    function closeMenu() {
        floatingContainer.classList.remove('open');
        overlay.classList.remove('active');
    }

    // Listener para el botón principal de componer: abre/cierra el menú de acciones y el overlay.
    composeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el clic se propague al overlay.
        floatingContainer.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    // --- LÓGICA DEL MENÚ LATERAL (OFF-CANVAS) ---
    const sidebar = document.querySelector('.sidebar');
    const profilePicTrigger = document.querySelector('.header .profile-pic');

    /**
     * Muestra el menú lateral (sidebar) y activa el overlay.
     */
    const openSidebar = () => {
        if (sidebar) sidebar.classList.add('show');
        if (overlay) overlay.classList.add('active');
    };

    /**
     * Oculta el menú lateral (sidebar).
     * El overlay se oculta en un listener separado.
     */
    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('show');
    };

    // Listener en la foto de perfil del encabezado para abrir el menú lateral.
    if (profilePicTrigger) {
        profilePicTrigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Previene que se cierren otros menús.
            openSidebar();
        });
    }

    // Listener unificado para el overlay: cierra todos los menús abiertos.
    overlay.addEventListener('click', () => {
        closeMenu();      // Cierra el menú del botón flotante.
        closeSidebar();   // Cierra el menú lateral.
    });

    // --- LÓGICA DE DESLIZAMIENTO (SWIPE) PARA CERRAR SIDEBAR ---
    let isDragging = false;
    let startX = 0;
    let currentTranslateX = 0;

    if (sidebar) {
        sidebar.addEventListener('touchstart', (e) => {
            if (sidebar.classList.contains('show')) {
                isDragging = true;
                startX = e.touches[0].clientX;
                // Desactiva la transición durante el arrastre para un seguimiento 1:1
                sidebar.style.transition = 'none'; 
            }
        });

        sidebar.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const currentX = e.touches[0].clientX;
            const diffX = currentX - startX;

            // Solo permite deslizar hacia la izquierda (para cerrar)
            if (diffX < 0) {
                currentTranslateX = diffX;
                sidebar.style.transform = `translateX(${currentTranslateX}px)`;
            }
        });

        sidebar.addEventListener('touchend', () => {
            if (!isDragging) return;

            isDragging = false;
            // Reactiva la transición para la animación de cierre o retorno
            sidebar.style.transition = 'transform 0.3s ease-in-out';

            const sidebarWidth = sidebar.offsetWidth;
            const swipeThreshold = sidebarWidth * 0.4; // Umbral de deslizamiento

            // Limpia el transform en línea para que las clases de CSS tomen el control
            sidebar.style.transform = '';

            // Si se deslizó más del umbral, cierra el menú
            if (currentTranslateX < -swipeThreshold) {
                closeSidebar();
                if (overlay) overlay.classList.remove('active');
            } 
            // Si no se deslizó lo suficiente, la clase .show sigue presente
            // y el CSS lo animará de vuelta a translateX(0) automáticamente.

            // Limpia las variables
            currentTranslateX = 0;
            startX = 0;
        });
    }

    // --- LÓGICA DEL BOTÓN "POSTED" (DEMO-CONTAINER) ---
    const demoContainer = document.querySelector('.demo-container');

    if (demoContainer) {
        // Muestra u oculta el botón de "nuevos posts" según la posición del scroll.
        window.addEventListener('scroll', () => {
            if (window.scrollY > 3000) {
                demoContainer.classList.add('visible');
            } else {
                demoContainer.classList.remove('visible');
            }
        });

        // Al hacer clic en el botón, se desplaza suavemente al inicio de la página.
        demoContainer.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /**
     * Placeholder para manejar las acciones de los botones del menú flotante (video, audio, imagen).
     * @param {string} action - La acción seleccionada (ej. 'video', 'audio', 'image').
     */
    window.handleAction = function(action) {
        console.log(`Acción seleccionada: ${action}`);
        closeMenu(); // Cierra el menú después de seleccionar una acción.
        alert(`Funcionalidad para "${action}" no implementada.`);
    }

    // --- LÓGICA PARA OCULTAR/MOSTRAR ELEMENTOS SEGÚN LA DIRECCIÓN DEL SCROLL ---
    const header = document.querySelector('.header');
    const tabsContainer = document.querySelector('.tabs');
    const bottomNav = document.querySelector('.bottom-nav'); // Elemento del footer
    let lastScrollTop = 0; // Guarda la última posición del scroll para detectar la dirección.

    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scroll hacia abajo: oculta elementos para dar más espacio al contenido.
            if (header) header.classList.add('is-hidden');
            if (tabsContainer) tabsContainer.classList.add('is-hidden');
            if (bottomNav) bottomNav.classList.add('is-hidden'); // Oculta el footer
            floatingContainer.classList.add('hidden');

        } else {
            // Scroll hacia arriba: muestra los elementos de navegación de nuevo.
            if (header) header.classList.remove('is-hidden');
            if (tabsContainer) tabsContainer.classList.remove('is-hidden');
            if (bottomNav) bottomNav.classList.remove('is-hidden'); // Muestra el footer
            floatingContainer.classList.remove('hidden');
        }
        
        // Cierra el menú flotante si está abierto mientras se hace scroll para evitar solapamientos.
        if (floatingContainer.classList.contains('open')) {
            floatingContainer.classList.remove('open');
            overlay.classList.remove('active');
        }

        // Actualiza la última posición del scroll.
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Maneja el caso de llegar al tope en iOS.
    });

    // --- INTERACTIVIDAD DEL FEED (DINÁMICA CON DELEGACIÓN DE EVENTOS) ---

    // Se añade un único listener al contenedor del feed para manejar todos los clics internos.
    // Esto es más eficiente que añadir un listener a cada tweet.
    feed.addEventListener('click', (e) => {
        const target = e.target;

        // Busca si el clic fue en un botón de "Me gusta" o en uno de sus hijos.
        const likeBtn = target.closest('.action-btn[aria-label="Me gusta"]');
        if (likeBtn) {
            e.stopPropagation(); // Evita que el evento se propague al tweet padre.
            handleLike(likeBtn);
            return; // Termina la ejecución para no procesar otros clics.
        }

        // Busca si el clic fue en un tweet, pero no en un botón de acción.
        const tweetElement = target.closest('.tweet');
        if (tweetElement && !target.closest('.action-btn') && !target.closest('.tweet-menu')) {
            console.log('Navegando al detalle del tweet...');
            // Aquí iría la lógica para mostrar el detalle del tweet (no implementada).
        }
    });

    /**
     * Gestiona la lógica del botón "Me gusta": cambia el estilo y actualiza el contador.
     * @param {HTMLElement} likeBtn - El elemento del botón que recibió el clic.
     */
    function handleLike(likeBtn) {
        const icon = likeBtn.querySelector('i');
        const count = likeBtn.querySelector('span');
        let currentLikes = parseLikes(count.textContent);

        likeBtn.classList.toggle('liked');

        if (likeBtn.classList.contains('liked')) {
            // Si ahora tiene "Me gusta"
            icon.classList.replace('bi-heart', 'bi-heart-fill');
            currentLikes++;
        } else {
            // Si se quitó el "Me gusta"
            icon.classList.replace('bi-heart-fill', 'bi-heart');
            currentLikes--;
        }
        count.textContent = formatLikes(currentLikes);
    }

    // --- FUNCIONES UTILITARIAS ---

    /**
     * Formatea un número para mostrarlo de forma abreviada (ej. 1200 -> "1.2K").
     * @param {number} num - El número a formatear.
     * @returns {string} El número formateado como texto.
     */
    function formatLikes(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + 'K';
        }
        return num.toString();
    }

    /**
     * Convierte el texto de likes (ej. "1.2K") de nuevo a un número.
     * @param {string} text - El texto a convertir (ej. "1.2K", "500").
     * @returns {number} El número de likes.
     */
    function parseLikes(text) {
        if (text.includes('K')) {
            return parseFloat(text.replace('K', '')) * 1000;
        }
        return parseInt(text) || 0;
    }

    // --- INICIALIZACIÓN Y SCROLL INFINITO ---
    let isLoading = false; // Bandera para evitar cargas múltiples y simultáneas.

    /**
     * Simula la carga de más tweets y los añade al final del feed.
     */
    function appendTweets() {
        tweetsData.forEach(tweetData => {
            const tweetElement = createTweetElement(tweetData);
            feed.appendChild(tweetElement);
        });
    }

    // Listener para el scroll infinito.
    window.addEventListener('scroll', () => {
        // Comprueba si el usuario ha llegado cerca del final de la página y no hay una carga en curso.
        if (!isLoading && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
            isLoading = true; // Activa la bandera para bloquear nuevas cargas.

            // Simula un retraso de red antes de cargar nuevo contenido.
            setTimeout(() => {
                appendTweets(); // Añade los nuevos tweets al DOM.
                isLoading = false; // Desactiva la bandera para permitir futuras cargas.
            }, 500); 
        }
    });

    // Carga inicial de los tweets al abrir la aplicación.
    renderTweets();

});