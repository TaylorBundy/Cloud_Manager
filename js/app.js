// const tokken =
// "5f11dae8fe0e965c756f86c19b02a7c129d609f245245c6c3be4e35ff08f5e76100a7b6b9b0b123eeb2c2620cea03f3ecc3212c834c6d4ac07edaae38c1c0983";
//"8456f6c5673fd7aff3888a48aca2c1c6b3fdc24fbbe931ecdd59077a3933a955d4f2c4e0f0e0b13fedb5af0bd61968ca7d7a81c9b4500a73fd68be38be05040a";
let tokken;
const NDUS = "Y2LRyrnteHui8ZhW2X2gzKRCEeyhICEYkF8LsqET";
const btnCargar = document.querySelector(".bToken");
const radiocheck = document.querySelectorAll(".check");
let nCloud;
const NUBES = {
  drive: {
    name: "Google Drive",

    auth_url: "https://accounts.google.com/o/oauth2/v2/auth",

    client_id: "TU_CLIENT_ID",

    scope: "https://www.googleapis.com/auth/drive",

    redirect_uri: "https://tuweb.com/callback",
  },

  dropbox: {
    name: "Dropbox",

    auth_url: "https://www.dropbox.com/oauth2/authorize",

    client_id: "TU_CLIENT_ID",

    scope: "",

    redirect_uri: "https://tuweb.com/callback",
  },

  onedrive: {
    name: "OneDrive",

    auth_url: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",

    client_id: "TU_CLIENT_ID",

    scope: "files.readwrite",

    redirect_uri: "https://tuweb.com/callback",
  },

  mediafire: {
    name: "MediaFire",

    auth_url: "https://www.mediafire.com/api/oauth/authorize.php",

    client_id: "TU_CLIENT_ID",

    scope: "",

    redirect_uri: "https://tuweb.com/callback",
  },
};

function conectarNube(config) {
  const params = new URLSearchParams({
    client_id: config.client_id,
    redirect_uri: config.redirect_uri,
    response_type: "token",
    scope: config.scope,
  });

  const url = config.auth_url + "?" + params.toString();

  window.location.href = url;
}

function conectar(nombre) {
  const config = NUBES[nombre];

  conectarNube(config);
}

const clouds = [
  "Google Drive",
  "Dropbox",
  "Mega",
  "MediaFire",
  "OneDrive",
  "TeraBox",
];

const cont = document.getElementById("clouds");

clouds.forEach((c) => {
  const div = document.createElement("div");
  const check = document.createElement("input");
  check.className = `check`;
  check.id = `check-${c}`;
  check.type = "checkbox";

  div.className = "card";

  div.innerHTML = `

<h2>${c}</h2>


<button id="btn">

Conectar

</button>

`;

  cont.appendChild(div);
  div.appendChild(check);
});

function connect(name) {
  alert("Conectar con " + name);
}

document.querySelectorAll(".check").forEach((check) => {
  check.addEventListener("change", () => {
    // si este fue activado
    if (check.checked) {
      // desactivar los demás
      document.querySelectorAll(".check").forEach((otro) => {
        if (otro !== check) {
          otro.checked = false;
        }
      });
    }
  });
  check.addEventListener("click", async (e) => {
    if (check.id === "check-TeraBox") {
      const isToken = localStorage.getItem("tbToken");
      console.log(check.id);
      nCloud = check.id;
      sInput.value = isToken;
    } else if (check.id === "check-MediaFire") {
      nCloud = check.id;
    }
  });
});

// document.querySelectorAll(".check").forEach((radio) => {
//   //radio.addEventListener("click", function () {
//   radio.addEventListener("click", async (e) => {
//     if (radio.id === "check-TeraBox") {
//       console.log(radio.id);
//       nCloud = radio.id;
//     } else if (radio.id === "check-MediaFire") {
//       nCloud = radio.id;
//     }
//   });
// });

document.querySelectorAll("#btn").forEach((button) => {
  button.addEventListener("click", function () {
    cargarArchivos(tokken);
    // console.log(this.id);
  });
});

// async function infoUsuario2(session_token) {
//   const url =
//     "https://www.mediafire.com/api/1.5/user/get_info.php" +
//     "?session_token=" +
//     tokken +
//     "&response_format=json";

//   const res = await fetch(url);

//   const data = await res.json();

//   // console.log(data);
// }

// async function infoUsuario(session_token) {
//   const url =
//     "https://www.mediafire.com/application/get_session_token.php" +
//     "&response_format=json";

//   const res = await fetch(url);

//   const data = await res.json();

//   // console.log(data);
// }

// async function listarArchivos2(session_token) {
//   const url =
//     "https://www.mediafire.com/api/1.5/folder/get_content.php" +
//     "?session_token=" +
//     tokken +
//     "&folder_key=myfiles" +
//     "&response_format=json";

//   const res = await fetch(url);

//   const data = await res.json();

//   //console.log(data.response.folder_content.files);
//   // console.log(data.response.folder_content.folders[3]);
// }

async function listarArchivos(folder_key) {
  const token = localStorage.getItem("mediafire_token");

  const url =
    "https://www.mediafire.com/api/1.5/folder/get_content.php" +
    "?session_token=" +
    tokken +
    "&folder_key=" +
    folder_key +
    "&response_format=json";

  const res = await fetch(url);

  const data = await res.json();
  //console.log(data);
  //console.log(data.response.folder_content.folders.folderkey);

  const archivos =
    data.response.folder_content.files ||
    data.response.folder_content.folders ||
    [];

  const tbody = document.querySelector("#tablaArchivos tbody");

  tbody.innerHTML = "";

  archivos.forEach((file) => {
    const tr = document.createElement("tr");
    // console.log(file.files);

    tr.innerHTML = `
<td>📄 ${file.filename}</td>
<td>${formatearTamano(file.size)}</td>
<td>${file.filetype}</td>
<td>
<a href="${file.links.normal_download}" target="_blank">
Descargar
</a>
</td>
`;

    tbody.appendChild(tr);
  });
}

//listarArchivos(tokken);

function formatearTamano(bytes) {
  const sizes = ["B", "KB", "MB", "GB"];

  if (bytes == 0) return "0 B";

  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}

function mostrarArchivosMediafire(data) {
  const tbody = document.querySelector("#tablaArchivos tbody");

  tbody.innerHTML = "";

  const archivos = data.response.folder_content.folders;

  archivos.forEach((folders) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `

<td> <a href="https://app.mediafire.com/folder/${folders.folderkey}" target="_blank"> ${folders.name}</td>
<td> ${folders.folderkey}</td>

<!-- <td>${formatearTamano(name)}</td> -->

<!-- <td>${name}</td> -->

<td>
<a href="${name}" target="_blank">
Descargar
</a>
</td>

`;

    tbody.appendChild(tr);
  });
}

async function cargarArchivos(token) {
  const url =
    "https://www.mediafire.com/api/1.5/folder/get_content.php" +
    "?session_token=" +
    token +
    "&folder_key=myfiles" +
    "&response_format=json";

  const res = await fetch(url);

  const data = await res.json();
  let carpetas = data.response.folder_content.folders;
  carpetas.forEach((carpeta) => {
    // console.log(carpeta.name);
  });
  //console.log(data.response.folder_content.folders);

  mostrarArchivosMediafire(data);
}

// async function listarCarpetas(folder_key) {
//   const token = localStorage.getItem("mediafire_token");

//   const url =
//     "https://www.mediafire.com/api/1.5/folder/get_content.php" +
//     "?session_token=" +
//     tokken +
//     "&folder_key=" +
//     folder_key +
//     "&response_format=json";

//   const res = await fetch(url);

//   const data = await res.json();

//   const carpetas = data.response.folder_content.folders;

//   carpetas.forEach((carpeta) => {
//     // console.log("📁", carpeta.name);
//   });
// }

//listarCarpetas("myfiles");

// function crearNodo(carpeta) {
//   const details = document.createElement("details");

//   const summary = document.createElement("summary");

//   summary.textContent = "📁 " + carpeta.name;

//   details.appendChild(summary);

//   summary.onclick = () => cargarSubcarpetas(carpeta.folderkey, details);

//   return details;
// }

//const token = localStorage.getItem("mediafire_token");

// async function cargarCarpetas(folder_key, parentElement) {
//   const url =
//     "https://www.mediafire.com/api/1.5/folder/get_content.php" +
//     "?session_token=" +
//     tokken +
//     "&folder_key=" +
//     folder_key +
//     "&response_format=json";

//   const res = await fetch(url);

//   const data = await res.json();

//   const carpetas = data.response.folder_content.folders;

//   carpetas.forEach((carpeta) => {
//     const nodo = document.createElement("div");
//     nodo.className = "node folder";

//     nodo.innerHTML = "📁 " + carpeta.name;

//     const hijos = document.createElement("div");
//     hijos.className = "children";

//     nodo.appendChild(hijos);

//     nodo.onclick = async (e) => {
//       e.stopPropagation();

//       if (!nodo.classList.contains("open")) {
//         nodo.classList.add("open");

//         if (hijos.childElementCount === 0) {
//           await cargarCarpetas(carpeta.folderkey, hijos);
//         }
//       } else {
//         nodo.classList.remove("open");
//       }
//     };

//     parentElement.appendChild(nodo);
//   });
// }

const tree = document.getElementById("treeview");

//cargarCarpetas("myfiles", tree);

//const token = localStorage.getItem("mediafire_token")

async function cargarSubcarpetas(folder_key, container, onError) {
  const url =
    "https://www.mediafire.com/api/1.5/folder/get_content.php" +
    "?session_token=" +
    tokken +
    "&folder_key=" +
    folder_key +
    "&response_format=json";

  async function fetchSeguro(urls) {
    try {
      const res = await fetch(urls);

      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }

      return await res.json();
    } catch (e) {
      console.error("Error:", e);

      return null; // o throw e si prefieres
    }
  }

  // try {
  //   const res = await fetch(url);
  //   if (!res.ok) {
  //     throw new Error("HTTP " + res.status);
  //   }

  //   return await res.json();
  // } catch (e) {
  //   console.error(e);
  // }

  //const data = await res.json();
  const data = await fetchSeguro(url);
  if (!data) {
    console.log("no se pudo acceder");
    window.open("https://www.mediafire.com", "mf", "width=500,height=500");
  } else {
    //console.log(data);
  }

  const carpetas = data.response.folder_content.folders || [];
  const esUltimoNivel = carpetas.length === 0;

  carpetas.forEach((carpeta) => {
    const nodo = document.createElement("div");
    nodo.className = "tree-node";

    const carpetaDiv = document.createElement("div");
    carpetaDiv.className = "folder";
    carpetaDiv.textContent = "📁 " + carpeta.name;

    const hijos = document.createElement("div");
    hijos.className = "children";

    nodo.appendChild(carpetaDiv);
    nodo.appendChild(hijos);

    carpetaDiv.onclick = async (e) => {
      e.preventDefault(); // evita que navegue
      e.stopPropagation();

      if (nodo.classList.contains("open")) {
        nodo.classList.remove("open");
      } else {
        nodo.classList.add("open");

        if (hijos.childElementCount === 0) {
          await cargarSubcarpetas(carpeta.folderkey, hijos);
          //listarArchivos(carpeta.folderkey);
        }
      }
    };

    container.appendChild(nodo);
  });
  if (esUltimoNivel) {
    const link = document.createElement("a");

    link.href = "https://www.mediafire.com/folder/" + folder_key;
    link.target = "_blank";
    link.textContent = "🔗 Abrir carpeta";

    container.appendChild(link);
  }
}

async function archivos(dir = "/") {
  try {
    const url = "https://www.terabox.com/api/list";

    const params = new URLSearchParams({
      app_id: "250528",
      jsToken: tokken,
      dir: dir,
      page: 1,
      num: 100,
    });

    const res = await fetch(`${url}?${params.toString()}`, {
      method: "GET",
      headers: {
        Cookie: `NDUS=${NDUS}`,
        "User-Agent": "Mozilla/5.0",
      },
    });

    const data = await res.json();

    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
  }
}

const sInput = document.querySelector(".sToken");

document.querySelector(".bToken").addEventListener("click", function () {
  //iniciarMonitoreoClipboard();

  if (nCloud == "check-TeraBox") {
    treeview.innerHTML = "";
    if (sInput.value) {
      tokken = sInput.value;
      cargarCarpeta("/", tree);
      localStorage.setItem("tbToken", tokken);
    }
  } else {
    if (sInput.value) {
      tokken = sInput.value;
      cargarSubcarpetas("myfiles", tree);
      localStorage.setItem("mfToken", tokken);
    } else {
      //window.open("https://www.mediafire.com", "mf", "width=500,height=500");
      mostrarModalConexion();
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const isToken = localStorage.getItem("mfToken");
  //iniciarMonitoreoClipboard();
  if (isToken) {
    sInput.value = isToken;
    setTimeout(() => {
      //btnCargar.click();
    }, 2000);
  } else {
    //window.open("https://www.mediafire.com", "mf", "width=500,height=500");
    mostrarModalConexion();
  }
});

function mostrarModalConexion() {
  const overlay = document.createElement("div");
  overlay.style = `
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,0.6);
display:flex;
justify-content:center;
align-items:center;
z-index:9999;
`;

  const box = document.createElement("div");
  box.style = `
background:white;
padding:20px;
border-radius:10px;
width:90%;
max-width:400px;
text-align:center;
`;

  const title = document.createElement("h3");
  title.textContent = "Conectar MediaFire";

  const text = document.createElement("p");
  text.textContent =
    "Inicia sesión en MediaFire y obtendremos el token automáticamente.";

  // botón abrir
  const btnOpen = document.createElement("button");
  btnOpen.textContent = "🔗 Abrir MediaFire";

  btnOpen.onclick = () => {
    const popup = window.open(
      "https://www.mediafire.com",
      "mf",
      "width=800,height=600",
    );

    // acá después conectas con tu lógica de token
    //conectarConPopup(popup)
  };

  // botón cerrar
  const btnClose = document.createElement("button");
  btnClose.textContent = "Cancelar";
  btnClose.style.marginTop = "10px";

  btnClose.onclick = () => document.body.removeChild(overlay);

  box.appendChild(title);
  box.appendChild(text);
  box.appendChild(btnOpen);
  box.appendChild(document.createElement("br"));
  box.appendChild(btnClose);

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// async function pegarDesdeClipboard() {
//   //const input = document.getElementById("miInput")

//   try {
//     if (navigator.clipboard) {
//       const texto = await navigator.clipboard.readText();
//       //input.value = texto
//       sInput.value = texto;
//     } else {
//       alert("Clipboard no soportado");
//     }
//   } catch (err) {
//     console.error(err);
//     alert("No se pudo leer el portapapeles");
//   }
// }

let intervaloClipboard = null;

async function iniciarMonitoreoClipboard() {
  try {
    // primer acceso (requiere interacción del usuario)
    await navigator.clipboard.readText();

    intervaloClipboard = setInterval(async () => {
      try {
        const texto = await navigator.clipboard.readText();

        if (texto) {
          //console.log("Clipboard:", texto);

          // 👉 acción
          manejarClipboard(texto);
        }
      } catch (e) {
        console.error("Sin permiso:", e);
      }
    }, 3000); // cada 3 segundos
  } catch (e) {
    alert("Debes permitir acceso al portapapeles");
  }
}

function detenerMonitoreoClipboard() {
  if (intervaloClipboard) {
    clearInterval(intervaloClipboard);
    intervaloClipboard = null;
    //console.log("⛔ Monitoreo detenido");
  }
}

function manejarClipboard(texto) {
  //console.log("Procesando:", texto);
  sInput.value = texto;
  detenerMonitoreoClipboard();

  // ejemplo: guardar token
  //localStorage.setItem("mediafire_token", texto)
}

async function cargar() {
  const res = await fetch("http://127.0.0.1:5000/archivos");
  const data = await res.json();
  console.log(data);

  const lista = document.getElementById("lista");

  data.list.forEach((file) => {
    const div = document.createElement("div");

    div.innerHTML = `
            <b>${file.server_filename}</b>
            <br>
            Tamaño: ${file.size}
            <hr>
        `;

    lista.appendChild(div);
  });
}
//cargar();

const tbody = document.querySelector("#tablaArchivos tbody");

//btnCargar.addEventListener("click", cargarArchivos);

async function cargarArchivos() {
  try {
    const res = await fetch("http://127.0.0.1:5000/archivos");

    const data = await res.json();

    console.log(data);

    tbody.innerHTML = "";

    data.list.forEach((archivo) => {
      const tr = document.createElement("tr");

      // Nombre
      const tdNombre = document.createElement("td");
      tdNombre.textContent = archivo.server_filename || "-";

      // FolderKey / fs_id
      const tdFolder = document.createElement("td");
      tdFolder.textContent = archivo.fs_id || "-";

      // Tamaño
      const tdSize = document.createElement("td");
      tdSize.textContent = formatBytes(archivo.size || 0);

      // Tipo
      const tdTipo = document.createElement("td");

      if (archivo.isdir == 1) {
        tdTipo.textContent = "Carpeta";
      } else {
        tdTipo.textContent = "Archivo";
      }

      // Descargar
      const tdDownload = document.createElement("td");

      const btn = document.createElement("button");
      btn.textContent = "Descargar";

      btn.addEventListener("click", () => {
        console.log("Descargar:", archivo);

        // abrir link si existe
        if (archivo.dlink) {
          window.open(archivo.dlink, "_blank");
        }
      });

      tdDownload.appendChild(btn);

      // agregar columnas
      tr.appendChild(tdNombre);
      tr.appendChild(tdFolder);
      tr.appendChild(tdSize);
      tr.appendChild(tdTipo);
      tr.appendChild(tdDownload);

      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function cargarCarpeta2(dir, container) {
  try {
    const res = await fetch(
      `http://127.0.0.1:5000/archivos?dir=${encodeURIComponent(dir)}`,
    );

    const data = await res.json();

    data.list.forEach((item) => {
      console.log(item);
      // CONTENEDOR
      const nodo = document.createElement("div");
      nodo.className = "tree-node";

      const carpetaDiv = document.createElement("div");
      carpetaDiv.className = "folder";
      carpetaDiv.textContent = "📁 " + item.server_filename;

      const hijos = document.createElement("div");
      hijos.className = "children";

      nodo.appendChild(carpetaDiv);
      nodo.appendChild(hijos);

      carpetaDiv.onclick = async (e) => {
        e.preventDefault(); // evita que navegue
        e.stopPropagation();
        if (nodo.classList.contains("open")) {
          nodo.classList.remove("open");
        } else {
          nodo.classList.add("open");

          if (hijos.childElementCount === 0) {
            await cargarCarpeta(item.fs_id, hijos);
            //listarArchivos(carpeta.folderkey);
          }
        }
      };

      // CARPETA
      if (item.isdir == 1) {
        //div.className = "folder";
        nodo.textContent = "📁 " + item.server_filename;

        // hijos
        const children = document.createElement("div");
        children.className = "children";

        let cargado = false;
        carpetaDiv.onclick = async (e) => {
          e.preventDefault(); // evita que navegue
          e.stopPropagation();
          if (nodo.classList.contains("open")) {
            nodo.classList.remove("open");
          } else {
            nodo.classList.add("open");

            if (hijos.childElementCount === 0) {
              await cargarCarpeta(item.fs_id, hijos);
              //listarArchivos(carpeta.folderkey);
            }
          }
        };

        // carpetaDiv.addEventListener("click", async (e) => {
        //   e.stopPropagation();

        //   // cargar solo una vez
        //   if (!cargado) {
        //     await cargarCarpeta(item.path, children);

        //     cargado = true;
        //   }

        //   children.style.display =
        //     children.style.display === "none" ? "block" : "none";
        // });

        container.appendChild(nodo);
        //container.appendChild(children);
      }

      // ARCHIVO
      else {
        nodo.className = "file";

        nodo.innerHTML = `
          📄 ${item.server_filename}
        `;

        nodo.addEventListener("click", () => {
          console.log(item);
        });

        container.appendChild(nodo);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

async function cargarCarpeta(dir, container) {
  try {
    const res2 = await fetch(`${archivos(dir)}`);
    const res = await fetch(
      `http://127.0.0.1:5000/archivos?dir=${encodeURIComponent(dir)}`,
    );

    const data = await res.json();
    const data2 = await res2.json();
    //console.log(data);
    console.log(data2);

    data.list.forEach((item) => {
      //console.log(item);
      //console.log(item.server);
      // NODO
      const nodo = document.createElement("div");
      nodo.className = "tree-node";

      // =========================
      // CARPETAS
      // =========================
      if (item.isdir == 1) {
        const carpetaDiv = document.createElement("div");
        carpetaDiv.className = "folder";
        carpetaDiv.textContent = "📁 " + item.server_filename;

        const hijos = document.createElement("div");
        hijos.className = "children";

        let cargado = false;

        carpetaDiv.addEventListener("click", async (e) => {
          e.stopPropagation();

          // toggle
          hijos.style.display =
            hijos.style.display === "block" ? "none" : "block";

          // cargar una sola vez
          if (!cargado) {
            const nuevaRuta =
              dir === "/"
                ? `/${item.server_filename}`
                : `${dir}/${item.server_filename}`;
            //console.log(nuevaRuta);

            await cargarCarpeta(nuevaRuta, hijos);
            //await cargarCarpeta(item.path, hijos);

            cargado = true;
          }
        });

        nodo.appendChild(carpetaDiv);
        nodo.appendChild(hijos);

        container.appendChild(nodo);
      }

      // =========================
      // ARCHIVOS
      // =========================
      else {
        const archivoDiv = document.createElement("div");

        archivoDiv.className = "file";

        archivoDiv.textContent = "📄 " + item.server_filename;

        archivoDiv.addEventListener("click", () => {
          console.log(item);
        });

        nodo.appendChild(archivoDiv);

        container.appendChild(nodo);
      }
    });
  } catch (error) {
    console.error(error);
  }
}
