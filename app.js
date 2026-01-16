// 🔥 CONFIGURACIÓN FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyC2QOb0ssPqIa8_OVoVeKYNUqiq3dSIqw0",
    authDomain: "biseladores.firebaseapp.com",
    projectId: "biseladores",
    storageBucket: "biseladores.appspot.com",
    messagingSenderId: "1011105303379",
    appId: "1:1011105303379:web:5dd572907bcdb6704f2fa6"
};

// 🔥 INICIALIZAR FIREBASE
firebase.initializeApp(firebaseConfig);

// 🔥 INICIALIZAR FIRESTORE
const db = firebase.firestore();

// 📌 REFERENCIAS HTML
const nombres = document.getElementById("nombres");
const apellidos = document.getElementById("apellidos");
const cedula = document.getElementById("cedula");
const ubicacion = document.getElementById("ubicacion");
const buscarNombre = document.getElementById("buscarNombre");
const buscarCodigo = document.getElementById("buscarCodigo");
const resultados = document.getElementById("resultados");
const btnMostrar = document.querySelector('button[onclick="mostrarTodos()"]');

let listaVisible = false;

// 🔢 GENERAR CÓDIGO INCREMENTAL
async function generarCodigo() {
    const snapshot = await db
        .collection("biseladores")
        .orderBy("codigo", "desc")
        .limit(1)
        .get();

    if (snapshot.empty) return 101;
    return snapshot.docs[0].data().codigo + 1;
}

// 📝 REGISTRAR BISELADOR
document.getElementById("formBiselador").addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigo = await generarCodigo();

    await db.collection("biseladores").add({
        nombres: nombres.value,
        apellidos: apellidos.value,
        cedula: cedula.value,
        tipoAsignacion: "Laboratorio",
        ubicacion: ubicacion.value,
        codigo: codigo
    });

    alert("✅ Biselador registrado con código: " + codigo);
    e.target.reset();
});

// 🔍 BUSCAR
async function buscar() {
    resultados.innerHTML = "<p>🔎 Buscando...</p>";
    listaVisible = false;
    btnMostrar.textContent = "Mostrar lista completa";

    const nombre = buscarNombre.value.trim().toLowerCase();
    const codigo = buscarCodigo.value.trim();

    if (!nombre && !codigo) {
        resultados.innerHTML = "<p>⚠️ Escribe un nombre o un código para buscar.</p>";
        return;
    }

    const snapshot = await db.collection("biseladores").get();
    resultados.innerHTML = "";

    let encontrados = 0;

    snapshot.forEach(doc => {
        const b = doc.data();

        const coincideNombre =
            nombre &&
            (b.nombres.toLowerCase().includes(nombre) ||
             b.apellidos.toLowerCase().includes(nombre));

        const coincideCodigo =
            codigo && b.codigo == codigo;

        if (coincideNombre || coincideCodigo) {
            mostrarResultado(b);
            encontrados++;
        }
    });

    if (encontrados === 0) {
        resultados.innerHTML = "<p>❌ No se encontraron resultados.</p>";
    }
}

window.buscar = buscar;

// 📋 MOSTRAR / OCULTAR LISTA COMPLETA
async function mostrarTodos() {
    if (listaVisible) {
        resultados.innerHTML = "";
        listaVisible = false;
        btnMostrar.textContent = "Mostrar lista completa";
        return;
    }

    resultados.innerHTML = "<p>📋 Cargando lista completa...</p>";
    const snapshot = await db.collection("biseladores").orderBy("codigo").get();
    resultados.innerHTML = "";

    snapshot.forEach(doc => {
        mostrarResultado(doc.data());
    });

    listaVisible = true;
    btnMostrar.textContent = "Ocultar lista completa";
}

window.mostrarTodos = mostrarTodos;

// 🖨️ MOSTRAR RESULTADO EN PANTALLA
function mostrarResultado(b) {
    resultados.innerHTML += `
        <div class="resultado">
            <strong>${b.nombres} ${b.apellidos}</strong><br>
            Código: ${b.codigo}<br>
            Cédula: ${b.cedula}<br>
            Ubicación: ${b.ubicacion}
        </div>
        <hr>
    `;
}

// 📤 EXPORTAR A CSV
async function exportar() {
    const snapshot = await db.collection("biseladores").orderBy("codigo").get();

    let csv = "Nombres,Apellidos,Cédula,Código,Ubicación\n";

    snapshot.forEach(doc => {
        const b = doc.data();
        csv += `"${b.nombres}","${b.apellidos}","${b.cedula}","${b.codigo}","${b.ubicacion}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "biseladores.csv";
    link.click();
}

window.exportar = exportar;

