/*!
* Start Bootstrap - Freelancer v7.0.7 (https://startbootstrap.com/theme/freelancer)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-freelancer/blob/master/LICENSE)
*/
//
// Scripts
// 

const translations = {
    ca: {
        about_txt: "Sobre #ZombUIB"
        , about_txt1: `#ZombUIB és un joc de trets en primera persona on el jugador s'enfronta a hordes de zombis organitzats en rondes. L'objectiu és sobreviure el màxim temps possible`
        , about_txt2: `Aquest joc ha estat desenvolupat com a treball de fi de grau d'enginyeria informàtica per: Xavier Vives Marcus`
        , socials_txt: `Xarxes Socials`
        , play_txt: `Juga ara!`
        , tutorial_title_txt: `Com accedir al joc`
        , tutorial_txt: `Per començar a jugar, premeu el botó "Juga ara!" o aneu a zombis.ltim.uib.es/game`
        , okay_txt: `D'acord`
        , okay_txt2: `D'acord`
        , okay_txt3: `D'acord`
        , okay_txt4: `D'acord`
        , okay_txt5: `D'acord`
        , okay_txt6: `D'acord`
        , tutorial_title_txt2: `Com accedir al mode de Realitat Virtual`
        , tutorial_txt2: `Premeu el botó de RV situat al cantó inferior dret`
        , tutorial_title_txt3: `Controls`
        , tutorial_txt3: `Si féu servir teclat i ratolí, us podeu moure emprant W,A,S,D i interactuar fent click. Si féu servir comandament (ja sigui de RV o de consola), us podeu moure emprant els joystick i interactuar amb els disparadors`
        , tutorial_title_txt4: `Iniciar el joc`
        , tutorial_txt4: `Una vegada estigueu dins el joc, introduïu un nom o àlies, seleccioneu una de les 4 classes jugables (interactuar amb el botó vermell). Un cop estigueu llests, premeu el botó blau per començar el joc.`
        , tutorial_title_txt5: `El joc`
        , tutorial_txt5: `Una vegada us trobeu dins el laberint, us començaran a aparéixer zombis organtizats en rondes. Fins que no mateu tots els d'una ronda no en tornen a aparéixer. L'objectiu és sobreviure el màxim temps possible.`
        , tutorial_title_txt6: `Després del joc`
        , tutorial_txt6: `Una vegada us eliminin, anireu al vestíbul. Per jugar una altre vegada premeu el botó lila.`

    },
    es: {
        about_txt: "Acerca de #ZombUIB"
        , about_txt1: `#ZombUIB es un juego de disparos en primera persona donde el jugador se enfrenta a hordas de zombis organizados en rondas. El objetivo es sobrevivir el máximo tiempo posible`
        , about_txt2: `Este juego ha sido desarrollado como trabajo de fin de grado de ingeniería informática por: Xavier Vives Marcus`
        , socials_txt: `Redes Sociales`
        , play_txt: `Juega ahora!`
        , tutorial_title_txt: `Cómo acceder al juego`
        , tutorial_txt: `Para empezar a jugar, pulse el botón "Juega ahora" o diríjase a zombis.ltim.uib.es/game`
        , okay_txt: `Vale`
        , okay_txt2: `Vale`
        , okay_txt3: `Vale`
        , okay_txt4: `Vale`
        , okay_txt5: `Vale`
        , okay_txt6: `Vale`
        , tutorial_title_txt2: `Cómo acceder al modo de Realidad Virtual`
        , tutorial_txt2: `Pulse el botón de RV situado en la esquina inferior derecha`
        , tutorial_title_txt3: `Controles`
        , tutorial_txt3: `Si usted usa teclado y ratón, puede moverse usando W,A,S,D i interactuar haciendo click. Si usa un mando (ya sea de RV o de consola), puede moverse usando los joysticks i interactuar con los gatillos.`
        , tutorial_title_txt4: `Iniciar el joc`
        , tutorial_txt4: `Una vez esté dentro del juego, introduzca un nombre o alias, seleccione una de las 4 clases jugables (interactuar con los botones rojos). Una vez esté listo, interactúe con el botón azul para empezar el juego.`
        , tutorial_title_txt5: `El juego`
        , tutorial_txt5: `Una vez esté en el laberinto, empezarán a aparecer zombis organitzados en rondas. No aparecerán más zombis hasta que se eliminen todos los zombis de una ronda. El objetivo es sobrevivir el máximo tiempo posible.`
        , tutorial_title_txt6: `Después del juego`
        , tutorial_txt6: `Una vez se os eliminen, irá al vestíbulo. Para jugar otra vez presione el botón lila.`
    },
    en: {
        about_txt: "About #ZombUIB"
        , about_txt1: `#ZombUIB is a first person shooter game where the player faces hordes of zombies organized in rounds. The main goal is to survive as long as possible.`
        , about_txt2: `This game has been developed as a final degree project in computer engineering by: Xavier Vives Marcus`
        , socials_txt: `Socials`
        , play_txt: `Play now!`
        , tutorial_title_txt: `How to access the game`
        , tutorial_txt: `Press "Play now!" to start playing or head over to zombis.ltim.uib.es/game`
        , okay_txt: `Okay`
        , okay_txt2: `Okay`
        , okay_txt3: `Okay`
        , okay_txt4: `Okay`
        , okay_txt5: `Okay`
        , okay_txt6: `Okay`
        , tutorial_title_txt2: `Click on the RV button on the bottom right corner.`
        , tutorial_title_txt3: `Controls`
        , tutorial_txt3: `If keyboard & mouse is used as input devices, you may use W,A,S,D to move arround and interact by clicking. If a controller is used(both VR controller and console controllers), you may use the joysticks to move and interact by pressing the triggers.`
        , tutorial_title_txt4: `Start game`
        , tutorial_txt4: `Once you are in the game, input a name or alias, Select one of 4 playable loadouts (interact with the red buttons). Once you are ready, press the blue button to start the game.`
        , tutorial_title_txt5: `The game`
        , tutorial_txt5: `Once you are inside the maze, zombies will start to appear organized in rounds. They don't respawn until you kill everyone in a round. The goal is to survive as long as possible.`
        , tutorial_title_txt6: `After the game`
        , tutorial_txt6: `Once you are eliminated, you will go to the lobby. To play again press the purple button.`

    }
};

window.addEventListener('DOMContentLoaded', event => {
    const languageSelector = document.getElementById('language-selector');

    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        updateText(selectedLanguage);
    });


    function updateText(language) {
        const translation = translations[language];
        const keys = Object.keys(translation);
        keys.forEach(element => {
            console.log(element)
            document.getElementById(element).textContent = '';
            if (element == 'play_txt') {
                var play_icon = document.createElement('i');
                play_icon.setAttribute('class', 'fas fa-play');
                document.getElementById(element).appendChild(play_icon);
            } else if (element.startsWith('okay_txt')) {
                var cross_icon = document.createElement('i');
                cross_icon.setAttribute('class', 'fas fa-xmark fa-fw');
                document.getElementById(element).appendChild(cross_icon);
            }
            document.getElementById(element).appendChild(document.createTextNode(translation[element]));

        });


    }

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
