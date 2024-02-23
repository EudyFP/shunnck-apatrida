document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url;
    console.log("URL de la pestaña actual:", url);

    // Verificar si la URL está en una pantalla protegida
    if (esPantallaProtegida(url)) {
      console.log("La extensión no se abrirá en una pantalla protegida.");
      return;
    }

    const urlAPI =
      "https://shunnck.intsplay.com/at/api.php?link=" + encodeURIComponent(url);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", urlAPI);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const respuesta = JSON.parse(xhr.responseText);
        console.log("JSON resultante de la acción:", respuesta); // Console log del JSON resultante
        mostrarMensaje(respuesta);
      } else {
        console.error("Error al llamar al API:", xhr.status);
      }
    };
    xhr.send();
  });

  // Función para manejar la interacción con el input
  function manejarInput(event) {
    const mensaje = event.target.value;
    const url =
      "https://shunnck.intsplay.com/at/add.php?link=" +
      encodeURIComponent(window.location.href) +
      "&msj=" +
      encodeURIComponent(mensaje);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = function () {
      if (xhr.status === 200) {
        const respuesta = JSON.parse(xhr.responseText);
        console.log("JSON resultante de la acción:", respuesta); // Console log del JSON resultante
        // Cerrar la ventana del navegador después de enviar la solicitud al API
        window.close();
      } else {
        console.error("Error al llamar al API:", xhr.status);
      }
    };
    xhr.send();
  }

  // Agregar evento para escuchar cuando se escribe en el input
  const input = document.querySelector("input[type='text']");
  if (input) {
    input.addEventListener("input", manejarInput);
  }
});

/* aqui se cierra */

function esPantallaProtegida(url) {
  // Lista de esquemas de URL de navegadores que indican una pantalla protegida
  const esquemasProtegidos = [
    "chrome://",
    "chrome-extension://",
    "moz-extension://", // Firefox
    "safari-extension://", // Safari
    "opera-extension://", // Opera
    "ms-browser-extension://", // Microsoft Edge
    // Agrega otros esquemas según sea necesario
  ];

  // Verifica si la URL contiene algún esquema protegido
  for (let i = 0; i < esquemasProtegidos.length; i++) {
    if (url.includes(esquemasProtegidos[i])) {
      return true;
    }
  }

  return false;
}

function mostrarMensaje(respuesta) {
  const marco = document.querySelector(".marco");
  if (Array.isArray(respuesta) && respuesta.length > 0) {
    const mensaje = respuesta[0].msj;
    marco.innerHTML = `<p><b>Shunnck found:</b></p>
                            <p class="mensaje">${mensaje}</p>
                            <button id="copyButton" title="Copy">Copy</button>`;

    // Agregar evento al botón de copiar
    const copyButton = document.getElementById("copyButton");
    copyButton.addEventListener("click", function () {
      // Crear un elemento de texto temporal
      let tempInput = document.createElement("input");
      tempInput.value = mensaje;
      document.body.appendChild(tempInput);
      // Seleccionar y copiar el texto
      tempInput.select();
      document.execCommand("copy");
      // Eliminar el elemento temporal
      document.body.removeChild(tempInput);
    });
  } else {
    marco.innerHTML = `<h1><b>Oh!</b></h1><p>There's not an At. You can create one <a href="https://shunnck.intsplay.com/at/">here<a>!</p>`;
  }
}
