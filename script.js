let userData = {
    email: "",
    name: "",
    phone: "",
    role: "",
    maestro: "",
    photo: null // Aquí guardaremos la imagen en Base64
};

const BOOKS_DATA = [
    { id: 1, title: 'Libro 1: Fundamentos', chapters: 5, status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: La Oración', chapters: 4, status: 'bloqueado', color: 'bg-gray-400' },
];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

// Validación de correo obligatoria
function validateAndGo() {
    const emailInput = document.getElementById('auth-email').value;
    if (!emailInput.includes('@') || emailInput.length < 5) {
        alert("Por favor, ingresa un correo electrónico válido para continuar.");
        return;
    }
    userData.email = emailInput;
    showView('view-profile-setup');
}

// Simulación social
function goToProfileSocial(provider) {
    userData.email = `${provider.toLowerCase()}@user.com`;
    showView('view-profile-setup');
}

// Manejo de la foto de galería
function handlePhoto(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userData.photo = e.target.result;
            document.getElementById('preview-container').innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover rounded-full">`;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function setProfileRole(role) {
    userData.role = role;
    document.getElementById('btn-role-alumno').className = role === 'alumno' ? 'p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl font-bold text-blue-600' : 'p-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400';
    document.getElementById('btn-role-maestro').className = role === 'maestro' ? 'p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl font-bold text-blue-600' : 'p-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-400';
    
    document.getElementById('setup-alumno-extra').classList.toggle('hidden', role !== 'alumno');
    document.getElementById('setup-maestro-extra').classList.toggle('hidden', role !== 'maestro');
}

function finishSetup() {
    const name = document.getElementById('setup-name').value;
    const phone = document.getElementById('setup-phone').value;
    
    if (!name || !phone || !userData.role) {
        alert("Por favor completa los campos obligatorios (*)");
        return;
    }

    if (userData.role === 'maestro') {
        if (document.getElementById('maestro-code').value !== "1234") {
            alert("Código Ministerial Inválido");
            return;
        }
    } else {
        const maestro = document.getElementById('select-maestro').value;
        if (!maestro) {
            alert("Elige un maestro para corregir tus tareas");
            return;
        }
        userData.maestro = maestro;
    }

    userData.name = name;
    userData.phone = phone;

    // Actualizar UI del Home
    document.getElementById('display-name').innerText = name;
    document.getElementById('display-role-label').innerText = userData.role === 'alumno' ? 'Alumno en formación' : 'Maestro Ministerial';
    
    // Si hay foto la pone, si no, pone la inicial
    const avatarDiv = document.getElementById('user-avatar');
    if (userData.photo) {
        avatarDiv.innerHTML = `<img src="${userData.photo}">`;
    } else {
        avatarDiv.innerText = name.charAt(0).toUpperCase();
    }
    
    renderBooks();
    showView('view-student-home');
}

function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = BOOKS_DATA.map(book => `
        <div class="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 ${book.status === 'bloqueado' ? 'opacity-50' : 'active:scale-95 transition-transform cursor-pointer'}">
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
    if(confirm("¿Cerrar sesión?")) location.reload();
}
