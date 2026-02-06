// script.js mejorado
let userData = {
    name: "",
    phone: "",
    role: "",
    maestro: "",
    isSetupComplete: false
};

const BOOKS_DATA = [
    { id: 1, title: 'Libro 1: Fundamentos', chapters: 5, status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: La Oración', chapters: 4, status: 'bloqueado', color: 'bg-gray-400' },
    // Agregaremos los 6 libros aquí
];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

function goToProfile() {
    showView('view-profile-setup');
}

function setProfileRole(role) {
    userData.role = role;
    // Estética de botones
    document.getElementById('btn-role-alumno').className = role === 'alumno' ? 'p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl font-bold' : 'p-4 border-2 border-gray-100 rounded-2xl font-bold';
    document.getElementById('btn-role-maestro').className = role === 'maestro' ? 'p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl font-bold' : 'p-4 border-2 border-gray-100 rounded-2xl font-bold';
    
    // Mostrar campos extra
    document.getElementById('setup-alumno-extra').classList.toggle('hidden', role !== 'alumno');
    document.getElementById('setup-maestro-extra').classList.toggle('hidden', role !== 'maestro');
}

function finishSetup() {
    const name = document.getElementById('setup-name').value;
    const phone = document.getElementById('setup-phone').value;
    
    if (!name || !phone || !userData.role) {
        alert("Por favor completa todos los campos obligatorios (*)");
        return;
    }

    if (userData.role === 'maestro') {
        const code = document.getElementById('maestro-code').value;
        if (code !== "1234") {
            alert("Código Ministerial Inválido");
            return;
        }
    } else {
        const maestro = document.getElementById('select-maestro').value;
        if (!maestro) {
            alert("Debes elegir un maestro para que corrija tus tareas");
            return;
        }
    }

    // Guardar datos y entrar
    userData.name = name;
    document.getElementById('display-name').innerText = name;
    document.getElementById('user-avatar').innerText = name.charAt(0).toUpperCase();
    
    if (userData.role === 'alumno') {
        renderBooks();
        showView('view-student-home');
    } else {
        alert("¡Bienvenido Maestro! Cargando panel...");
        // Aquí iría el panel de maestro
    }
}

function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = BOOKS_DATA.map(book => `
        <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 ${book.status === 'bloqueado' ? 'opacity-50' : ''}">
            <div class="w-14 h-14 ${book.color} rounded-2xl flex items-center justify-center text-white">
                <span class="material-symbols-outlined">${book.status === 'bloqueado' ? 'lock' : 'book'}</span>
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-gray-900">${book.title}</h4>
                <p class="text-xs text-gray-400">${book.chapters} Capítulos</p>
            </div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
    `).join('');
}

function logout() {
    location.reload(); // Reinicia la app para el ejemplo
}
