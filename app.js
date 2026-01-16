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

// 📝 REGISTRAR BISELADOR (SIN CÉDULAS REPETIDAS)
document.getElementById("formBiselador").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cedulaValor = cedula.value.trim();

    // 🔍 Verificar si ya existe esa cédula
    const existe = await db
        .collection("biseladores")
        .where("cedula", "==", cedulaValor)
        .get();

    if (!existe.empty) {
        alert("⚠️ Esta cédula ya está registrada.");
        return;
    }

    const codigo = await generarCodigo();

    await db.collection("biseladores").add({
        nombres: nombres.value.trim(),
        apellidos: apellidos.value.trim(),
        cedula: cedulaValor,
        tipoAsignacion: "Laboratorio",
        ubicacion: ubicacion.value,
        codigo: codigo
    });

    alert("✅ Biselador registrado con código: " + codigo);
    e.target.reset();
});

// 🔍 BUSCAR BISELADORES
async function buscar() {
    const resultados = document.getElementById("resultados");
    resultados.innerHTML = "";

    const snapshot = await db.collection("biseladores").get();

    snapshot.forEach(doc => {
        const b = doc.data();

        const coincideNombre =
            buscarNombre.value &&
            (b.nombres.toLowerCase().includes(buscarNombre.value.toLowerCase()) ||
             b.apellidos.toLowerCase().includes(buscarNombre.value.toLowerCase()));

        const coincideCodigo =
            buscarCodigo.value && b.codigo == buscarCodigo.value;

        if (coincideNombre || coincideCodigo) {
            resultados.innerHTML += `
                <p>
                    <strong>${b.nombres} ${b.apellidos}</strong><br>
                    Código: ${b.codigo}<br>
                    Cédula: ${b.cedula}<br>
                    Ubicación: ${b.ubicacion}
                </p>
                <hr>
            `;
        }
    });
}

// 📋 MOSTRAR TODOS
async function mostrarTodos() {
    const resultados = document.getElementById("resultados");
    resultados.innerHTML = "";

    const snapshot = await db.collection("biseladores").orderBy("codigo").get();

    snapshot.forEach(doc => {
        const b = doc.data();
        resultados.innerHTML += `
            <p>
                <strong>${b.nombres} ${b.apellidos}</strong><br>
                Código: ${b.codigo}<br>
                Cédula: ${b.cedula}<br>
                Ubicación: ${b.ubicacion}
            </p>
            <hr>
        `;
    });
}

// 📤 EXPORTAR A CSV
async function exportar() {
    const snapshot = await db.collection("biseladores").orderBy("codigo").get();

    let csv = "Código,Nombres,Apellidos,Cédula,Ubicación\n";

    snapshot.forEach(doc => {
        const b = doc.data();
        csv += `${b.codigo},${b.nombres},${b.apellidos},${b.cedula},${b.ubicacion}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "biseladores.csv");
    link.click();
}

// 🌐 HACER FUNCIONES GLOBALES
window.buscar = buscar;
window.mostrarTodos = mostrarTodos;
window.exportar = exportar;

