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

    // --- BASE DE DATOS SIMULADA ---

    /**
     * Array de objetos que contiene la información de cada tweet.
     * Esta estructura permite gestionar los datos de forma centralizada y dinámica.
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
        }


    ];


    // --- RENDERIZADO DINÁMICO ---

    const feed = document.getElementById('feed');

    /**
     * Genera y renderiza los tweets en el feed a partir de los datos.
     */
    function renderTweets() {
        feed.innerHTML = ''; // Limpia el contenido actual del feed
        tweetsData.forEach(tweetData => {
            const tweetElement = createTweetElement(tweetData);
            feed.appendChild(tweetElement);
        });
    }

    /**
     * Crea un elemento de tweet (artículo HTML) a partir de un objeto de datos.
     * @param {object} tweetData - El objeto con la información del tweet.
     * @returns {HTMLElement} El elemento del tweet listo para ser añadido al DOM.
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

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const composeBtn = document.getElementById('composeBtn');
    const floatingContainer = document.querySelector('.floating-container');
    const overlay = document.getElementById('overlay');

    function closeMenu() {
        floatingContainer.classList.remove('open');
        overlay.classList.remove('active');
    }

    composeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el clic se propague al overlay si estuviera activo
        floatingContainer.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    // --- LÓGICA DEL MENÚ LATERAL (OFF-CANVAS) ---
    const sidebar = document.querySelector('.sidebar');
    const profilePicTrigger = document.querySelector('.header .profile-pic');

    const openSidebar = () => {
        if (sidebar) sidebar.classList.add('show');
        if (overlay) overlay.classList.add('active');
    };

    const closeSidebar = () => {
        if (sidebar) sidebar.classList.remove('show');
    };

    if (profilePicTrigger) {
        profilePicTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            openSidebar();
        });
    }

    // Listener unificado para el overlay
    overlay.addEventListener('click', () => {
        closeMenu(); // Cierra el menú del botón flotante
        closeSidebar(); // Cierra el menú lateral
        // La función closeMenu ya se encarga de ocultar el overlay
    });

    /**
     * Placeholder para manejar las acciones de los botones (video, audio, imagen).
     * @param {string} action - La acción a realizar.
     */
    window.handleAction = function(action) {
        console.log(`Acción seleccionada: ${action}`);
        closeMenu(); // Cierra el menú después de seleccionar una acción
        // Aquí se podría implementar la lógica para cada botón
        alert(`Funcionalidad para "${action}" no implementada.`);
    }



    // --- LÓGICA PARA OCULTAR BOTÓN FLOTANTE EN SCROLL ---
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        // Cierra el menú si está abierto
        floatingContainer.classList.remove('open');
        // Oculta el contenedor
        floatingContainer.classList.add('hidden');

        // Limpia el timeout anterior
        clearTimeout(scrollTimeout);

        // Muestra el contenedor después de que el scroll se detenga
        scrollTimeout = setTimeout(() => {
            floatingContainer.classList.remove('hidden');
        }, 250); // 250ms de espera
    });



    // --- INTERACTIVIDAD DEL FEED (DINÁMICA CON DELEGACIÓN DE EVENTOS) ---

    feed.addEventListener('click', (e) => {
        const target = e.target;

        // Delegación para el botón "Me gusta"
        const likeBtn = target.closest('.action-btn[aria-label="Me gusta"]');
        if (likeBtn) {
            e.stopPropagation();
            handleLike(likeBtn);
            return; // Detiene la ejecución para no activar el clic del tweet
        }

        // Delegación para el clic en un tweet
        const tweetElement = target.closest('.tweet');
        if (tweetElement && !target.closest('.action-btn') && !target.closest('.tweet-menu')) {
            console.log('Navegando al detalle del tweet...');
            // Lógica para mostrar el detalle del tweet
        }
    });

    /**
     * Gestiona la lógica del botón "Me gusta".
     * @param {HTMLElement} likeBtn - El botón que recibió el clic.
     */
    function handleLike(likeBtn) {
        const icon = likeBtn.querySelector('i');
        const count = likeBtn.querySelector('span');
        let currentLikes = parseLikes(count.textContent);

        likeBtn.classList.toggle('liked');

        if (likeBtn.classList.contains('liked')) {
            icon.classList.replace('bi-heart', 'bi-heart-fill');
            currentLikes++;
        } else {
            icon.classList.replace('bi-heart-fill', 'bi-heart');
            currentLikes--;
        }
        count.textContent = formatLikes(currentLikes);
    }


    // --- FUNCIONES UTILITARIAS ---

    /**
     * Formatea un número para mostrarlo abreviado (ej. 1.2K).
     * @param {number} num - El número a formatear.
     * @returns {string} El número formateado.
     */
    function formatLikes(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + 'K';
        }
        return num.toString();
    }

    /**
     * Convierte el texto de likes (ej. "1.2K") a un número.
     * @param {string} text - El texto a convertir.
     * @returns {number} El número de likes.
     */
    function parseLikes(text) {
        if (text.includes('K')) {
            return parseFloat(text.replace('K', '')) * 1000;
        }
        return parseInt(text) || 0;
    }

    // --- INICIALIZACIÓN Y SCROLL INFINITO ---
    let isLoading = false; // Bandera para evitar cargas múltiples

    /**
     * Añade más tweets al final del feed.
     */
    function appendTweets() {
        tweetsData.forEach(tweetData => {
            const tweetElement = createTweetElement(tweetData);
            feed.appendChild(tweetElement);
        });
    }

    // Event listener para el scroll infinito
    window.addEventListener('scroll', () => {
        // Comprueba si el usuario ha llegado cerca del final de la página
        // y no hay una carga en curso.
        if (!isLoading && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 200) {
            isLoading = true; // Activa la bandera

            // Simula un pequeño retraso de carga (como si viniera de una red)
            setTimeout(() => {
                appendTweets(); // Añade los nuevos tweets
                isLoading = false; // Desactiva la bandera
            }, 500); // 500ms de retraso
        }
    });

    // Carga inicial de los tweets
    renderTweets();

});