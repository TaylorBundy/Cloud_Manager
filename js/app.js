// const tokken =
// "5f11dae8fe0e965c756f86c19b02a7c129d609f245245c6c3be4e35ff08f5e76100a7b6b9b0b123eeb2c2620cea03f3ecc3212c834c6d4ac07edaae38c1c0983";
//"8456f6c5673fd7aff3888a48aca2c1c6b3fdc24fbbe931ecdd59077a3933a955d4f2c4e0f0e0b13fedb5af0bd61968ca7d7a81c9b4500a73fd68be38be05040a";
let tokken;
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

const clouds = ["Google Drive", "Dropbox", "Mega", "MediaFire", "OneDrive"];

const cont = document.getElementById("clouds");

clouds.forEach((c) => {
  const div = document.createElement("div");

  div.className = "card";

  div.innerHTML = `

<h2>${c}</h2>


<button id="btn">

Conectar

</button>

`;

  cont.appendChild(div);
});

function connect(name) {
  alert("Conectar con " + name);
}

document.querySelectorAll("#btn").forEach((button) => {
  button.addEventListener("click", function () {
    cargarArchivos(tokken);
    console.log(this.id);
  });
});

async function infoUsuario2(session_token) {
  const url =
    "https://www.mediafire.com/api/1.5/user/get_info.php" +
    "?session_token=" +
    tokken +
    "&response_format=json";

  const res = await fetch(url);

  const data = await res.json();

  console.log(data);
}

async function infoUsuario(session_token) {
  const url =
    "https://www.mediafire.com/application/get_session_token.php" +
    "&response_format=json";

  const res = await fetch(url);

  const data = await res.json();

  console.log(data);
}

// async function obtenerSessionToken() {
//   try {
//     const res = await fetch(
//       "https://www.mediafire.com/application/get_session_token.php",
//       {
//         method: "POST",
//         credentials: "include",
//       },
//     );

//     const data = await res.json();
//     console.log(data);

//     const token = data.response.session_token;

//     // guardar token
//     localStorage.setItem("mediafire_token", token);

//     console.log("Session Token:", token);

//     return token;
//   } catch (error) {
//     console.error("Error obteniendo token:", error);
//   }
// }

//infoUsuario(tokken);
// async function iniciar() {
//   let token = localStorage.getItem("mediafire_token");

//   if (!token) {
//     token = await obtenerSessionToken();
//   }

//   console.log("Token listo:", token);
// }

// iniciar();

async function listarArchivos2(session_token) {
  const url =
    "https://www.mediafire.com/api/1.5/folder/get_content.php" +
    "?session_token=" +
    tokken +
    "&folder_key=myfiles" +
    "&response_format=json";

  const res = await fetch(url);

  const data = await res.json();

  //console.log(data.response.folder_content.files);
  console.log(data.response.folder_content.folders[3]);
}

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
  //console.log(data.response.folder_content.folders.folderkey);

  const archivos =
    data.response.folder_content.files ||
    data.response.folder_content.folders ||
    [];

  const tbody = document.querySelector("#tablaArchivos tbody");

  tbody.innerHTML = "";

  archivos.forEach((file) => {
    const tr = document.createElement("tr");
    console.log(file.files);

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
    console.log(carpeta.name);
  });
  //console.log(data.response.folder_content.folders);

  mostrarArchivosMediafire(data);
}

async function listarCarpetas(folder_key) {
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

  const carpetas = data.response.folder_content.folders;

  carpetas.forEach((carpeta) => {
    console.log("📁", carpeta.name);
  });
}

//listarCarpetas("myfiles");

function crearNodo(carpeta) {
  const details = document.createElement("details");

  const summary = document.createElement("summary");

  summary.textContent = "📁 " + carpeta.name;

  details.appendChild(summary);

  summary.onclick = () => cargarSubcarpetas(carpeta.folderkey, details);

  return details;
}

//const token = localStorage.getItem("mediafire_token");

async function cargarCarpetas(folder_key, parentElement) {
  const url =
    "https://www.mediafire.com/api/1.5/folder/get_content.php" +
    "?session_token=" +
    tokken +
    "&folder_key=" +
    folder_key +
    "&response_format=json";

  const res = await fetch(url);

  const data = await res.json();

  const carpetas = data.response.folder_content.folders;

  carpetas.forEach((carpeta) => {
    const nodo = document.createElement("div");
    nodo.className = "node folder";

    nodo.innerHTML = "📁 " + carpeta.name;

    const hijos = document.createElement("div");
    hijos.className = "children";

    nodo.appendChild(hijos);

    nodo.onclick = async (e) => {
      e.stopPropagation();

      if (!nodo.classList.contains("open")) {
        nodo.classList.add("open");

        if (hijos.childElementCount === 0) {
          await cargarCarpetas(carpeta.folderkey, hijos);
        }
      } else {
        nodo.classList.remove("open");
      }
    };

    parentElement.appendChild(nodo);
  });
}

const tree = document.getElementById("treeview");

//cargarCarpetas("myfiles", tree);

//const token = localStorage.getItem("mediafire_token")

async function cargarSubcarpetas(folder_key, container) {
  const url =
    "https://www.mediafire.com/api/1.5/folder/get_content.php" +
    "?session_token=" +
    tokken +
    "&folder_key=" +
    folder_key +
    "&response_format=json";

  const res = await fetch(url);

  const data = await res.json();

  const carpetas = data.response.folder_content.folders || [];

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
      e.stopPropagation();

      if (nodo.classList.contains("open")) {
        nodo.classList.remove("open");
      } else {
        nodo.classList.add("open");

        if (hijos.childElementCount === 0) {
          await cargarSubcarpetas(carpeta.folderkey, hijos);
          listarArchivos(carpeta.folderkey);
          //console.log(hijos);
        }
      }
    };

    container.appendChild(nodo);
  });
}

const sInput = document.querySelector(".sToken");

document.querySelector(".bToken").addEventListener("click", function () {
  //cargarSubcarpetas("myfiles", tree);
  console.log(sInput.value);
  if (sInput.value) {
    tokken = sInput.value;
    cargarSubcarpetas("myfiles", tree);
    localStorage.setItem("mfToken", tokken);
  }
  //tokken = document.querySelector(".sToken").ariaValueMax;
  //cargarArchivos(tokken);
  //console.log(this.id);
});

document.addEventListener("DOMContentLoaded", () => {
  const isToken = localStorage.getItem("mfToken");
  if (isToken) {
    console.log(isToken);
    sInput.value = isToken;
  } else {
    window.open(
      "https://www.mediafire.com/application/get_session_token.php",
      "mf",
      "width=500,height=500",
    );
  }
});

//cargarSubcarpetas("myfiles", tree);

// window.open(
//   "https://www.mediafire.com/application/get_session_token.php",
//   (target = "_blank"),
// );

// window.open(
//   "https://www.mediafire.com/application/get_session_token.php",
//   "mf",
//   "width=500,height=500",
// );

// async function obtenerSessionToken() {
//   const res = await fetch("http://127.0.0.1:5000/mediafire/token");

//   const data = await res.json();

//   console.log(data);
// }

// obtenerSessionToken();
