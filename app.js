// 🔥 IMPORTS FIREBASE (SOLO CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔧 CONFIGURACIÓN FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyC2QOb0ssPqIa8_OVoVeKYNUqiq3dSIqw0",
    authDomain: "biseladores.firebaseapp.com",
    projectId: "biseladores",
    storageBucket: "biseladores.appspot.com",
    messagingSenderId: "1011105303379",
    appId: "1:1011105303379:web:5dd572907bcdb6704f2fa6",
    measurementId: "G-1SRTL3R1B7"
};

// 🚀 INICIALIZAR FIREBASE
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 📌 REFERENCIAS HTML
const nombres = document.getElementById("nombres");
const apellidos = document.getElementById("apellidos");
const cedula = document.getElementById("cedula");
const tipoAsignacion = document.getElementById("tipoAsignacion");
const ubicacion = document.getElementById("ubicacion");
const buscarNombre = document.getElementById("buscarNombre");
const buscarCodigo = document.getElementById("buscarCodigo");

// 🔢 GENERAR CÓDIGO INCREMENTAL DESDE 101
async function generarCodigo() {
    const q = query(
        collection(db, "biseladores"),
        orderBy("codigo", "desc"),
        limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return 101;
    return snapshot.docs[0].data().codigo + 1;
}

// 📝 REGISTRAR BISELADOR
document.getElementById("formBiselador").addEventListener("submit", async (e) => {
    e.preventDefault();

    const codigo = await generarCodigo();

    await addDoc(collection(db, "biseladores"), {
        nombres: nombres.value,
        apellidos: apellidos.value,
        cedula: cedula.value,
        tipoAsignacion: tipoAsignacion.value,
        ubicacion: ubicacion.value,
        codigo: codigo
    });

    alert("Biselador registrado con código: " + codigo);
    e.target.reset();
});

// 🔍 BUSCAR BISELADORES
async function buscar() {
    const resultados = document.getElementById("resultados");
    resultados.innerHTML = "";

    const snapshot = await getDocs(collection(db, "biseladores"));

    snapshot.forEach(doc => {
        const b = doc.data();

        if (
            (buscarNombre.value &&
                (b.nombres.toLowerCase().includes(buscarNombre.value.toLowerCase()) ||
                 b.apellidos.toLowerCase().includes(buscarNombre.value.toLowerCase())))
            ||
            (buscarCodigo.value && b.codigo == buscarCodigo.value)
        ) {
            resultados.innerHTML += `
                <p>
                    <strong>${b.nombres} ${b.apellidos}</strong><br>
                    Código: ${b.codigo}<br>
                    Cédula: ${b.cedula}<br>
                    Asignación: ${b.tipoAsignacion}<br>
                    Ubicación: ${b.ubicacion}
                </p>
                <hr>
            `;
        }
    });
}

window.buscar = buscar;

// 📥 CARGA MASIVA DE BISELADORES
async function cargarBiseladoresIniciales() {
    const biseladores = [
        { cedula: "29436084", codigo: 101, ubicacion: "LABORATORIO", nombres: "ALBA LILIANA", apellidos: "CARO BUENO" },
        { cedula: "1000791028", codigo: 102, ubicacion: "LABORATORIO", nombres: "JEIMMY LORENA", apellidos: "CAMACHO CALDERON" },
        { cedula: "19328378", codigo: 103, ubicacion: "LABORATORIO", nombres: "ALBERTO", apellidos: "ROJAS HERNANDEZ" },
        { cedula: "1000454321", codigo: 104, ubicacion: "LABORATORIO", nombres: "CAROL YESENIA", apellidos: "VELASQUEZ CAMARGO" },
        { cedula: "11386766", codigo: 105, ubicacion: "LABORATORIO", nombres: "CIRO", apellidos: "APONTE BURGOS" },
        { cedula: "1001049967", codigo: 106, ubicacion: "LABORATORIO", nombres: "DAVID SANTIAGO", apellidos: "ALBARRACÍN VELÁSQUEZ" },
        { cedula: "1033763684", codigo: 107, ubicacion: "LABORATORIO", nombres: "DIANA KATHERINE", apellidos: "MUNCA SANABRIA" },
        { cedula: "1089720346", codigo: 108, ubicacion: "LABORATORIO", nombres: "DIEGO ALEJANDRO", apellidos: "PINO CARDONA" },
        { cedula: "52730022", codigo: 109, ubicacion: "LABORATORIO", nombres: "ADRIANA ALEXANDRA", apellidos: "ACHURY SOLANO" },
        { cedula: "1019602635", codigo: 111, ubicacion: "LABORATORIO", nombres: "ANDRES FELIPE", apellidos: "PEDRAZA CALDERON" },
        { cedula: "52309151", codigo: 112, ubicacion: "LABORATORIO", nombres: "GLORIA MERCEDES", apellidos: "CARO MARTÍNEZ" },
        { cedula: "80032131", codigo: 113, ubicacion: "LABORATORIO", nombres: "HECTOR MAURICIO", apellidos: "LÓPEZ MARTÍNEZ" },
        { cedula: "1023969381", codigo: 114, ubicacion: "LABORATORIO", nombres: "JAROL STIBEN", apellidos: "COY FRANCO" },
        { cedula: "1024536159", codigo: 115, ubicacion: "LABORATORIO", nombres: "JHON ANDERSON", apellidos: "NÚÑEZ ANAYA" },
        { cedula: "1005932450", codigo: 116, ubicacion: "LABORATORIO", nombres: "JORGE ALBERTO", apellidos: "PEREZ CORTES" },
        { cedula: "1022341657", codigo: 117, ubicacion: "LABORATORIO", nombres: "LINA CONSTANZA", apellidos: "PALACIO ROMERO" },
        { cedula: "65777424", codigo: 118, ubicacion: "LABORATORIO", nombres: "MAGNOLIA", apellidos: "ORJUELA FLOREZ" },
        { cedula: "33676784", codigo: 119, ubicacion: "LABORATORIO", nombres: "YANSY OLIVIA", apellidos: "ROBLES POVEDA" },
        { cedula: "1012363426", codigo: 120, ubicacion: "LABORATORIO", nombres: "YINA LIZETH", apellidos: "CONTRERAS MONGUI" },

        { cedula: "80139596", codigo: 123, ubicacion: "CENTRO", nombres: "JUAN CARLOS", apellidos: "BALLEN MAYORGA" },
        { cedula: "79970214", codigo: 124, ubicacion: "CHAPINERO", nombres: "LUIS GERMAN", apellidos: "PARDO MARTINEZ" },
        { cedula: "79666408", codigo: 125, ubicacion: "OLAYA", nombres: "NELSON ENRIQUE", apellidos: "VILLAMIL PACHÓN" },
        { cedula: "1023924433", codigo: 126, ubicacion: "CENTRO", nombres: "PAOLA ALEJANDRA", apellidos: "NARANJO GALINDO" },
        { cedula: "1031173400", codigo: 127, ubicacion: "OLAYA", nombres: "BRAYAN SEBASTIAN", apellidos: "RAMOS SARMIENTO" },
        { cedula: "1033697034", codigo: 128, ubicacion: "CHAPINERO", nombres: "EDWIN FERNANDO", apellidos: "NIETO SANTANILLA" },
        { cedula: "43845722", codigo: 129, ubicacion: "MEDELLIN", nombres: "LUZ MARÍA", apellidos: "MONTOYA URRUBLA" },
        { cedula: "1060647949", codigo: 130, ubicacion: "PEREIRA", nombres: "CAROLINA", apellidos: "CASTRO VALENCIA" },
        { cedula: "42143970", codigo: 131, ubicacion: "PEREIRA", nombres: "NATALIA", apellidos: "GRAJALES MORALES" },
        { cedula: "1049482302", codigo: 132, ubicacion: "BARRANQUILLA", nombres: "ALEX FERNANDO", apellidos: "VERGARA MARIOTIS" },
        { cedula: "1053828065", codigo: 133, ubicacion: "MANIZALES", nombres: "EDWIN DE JESÚS", apellidos: "SANTAFE AGUDELO" },
        { cedula: "1111542405", codigo: 134, ubicacion: "CALI", nombres: "ALEJANDRO", apellidos: "ORTEGA RIVAS" },
        { cedula: "79335083", codigo: 135, ubicacion: "CALI", nombres: "DIEGO", apellidos: "PRADA FLAUTERO" },
        { cedula: "76331583", codigo: 136, ubicacion: "POPAYÁN", nombres: "LEYDER", apellidos: "GUEVARA CAMPO" },
        { cedula: "1061755170", codigo: 137, ubicacion: "POPAYÁN", nombres: "JONATHAN ELVIS", apellidos: "OROZCO GUEVARA" },
        { cedula: "1097392241", codigo: 138, ubicacion: "ARMENIA", nombres: "HOOVERNEY", apellidos: "VELEZ BEDOYA" },
        { cedula: "1003250211", codigo: 139, ubicacion: "TUNJA", nombres: "MARLON", apellidos: "ARANA LOBO" },
        { cedula: "1057578368", codigo: 140, ubicacion: "DUITAMA", nombres: "CARLOS ORLANDO", apellidos: "SANDOVAL DAVILA" },
        { cedula: "1085323137", codigo: 141, ubicacion: "PASTO", nombres: "BAYRON ANDRES", apellidos: "CABRERA" },
        { cedula: "87063198", codigo: 142, ubicacion: "PASTO", nombres: "DORIAN DE JESUS", apellidos: "OREJUELA SANTANA" },
        { cedula: "1116552547", codigo: 143, ubicacion: "YOPAL", nombres: "JOHAN ANDREY", apellidos: "GALAN" },
        { cedula: "86064380", codigo: 144, ubicacion: "VILLAVICENCIO", nombres: "DEIBY JAVIER", apellidos: "RODRIGUEZ TORRES" },
        { cedula: "1075297983", codigo: 145, ubicacion: "NEIVA", nombres: "ANYI DANIELA", apellidos: "PRIETO CUELLAR" }
    ];

    for (const b of biseladores) {
        await addDoc(collection(db, "biseladores"), {
            nombres: b.nombres,
            apellidos: b.apellidos,
            cedula: b.cedula,
            tipoAsignacion: "Laboratorio",
            ubicacion: b.ubicacion,
            codigo: b.codigo
        });
    }

    alert("✅ Carga masiva completada");
}

window.cargarBiseladoresIniciales = cargarBiseladoresIniciales;

