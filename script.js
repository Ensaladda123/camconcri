// script.js actualizado
let userData = {
    email: "",
    name: "",
    phone: "",
    role: "",
    maestro: "",
    photo: null
};

const BOOKS_DATA = [
    { id: 1, title: 'Libro 1: Fundamentos', chapters: 5, status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: La Oración', chapters: 4, status: 'bloqueado', color: 'bg-gray-400' },
    { id: 3, title: 'Libro 3: Carácter', chapters: 6, status: 'bloqueado', color: 'bg-gray-400' },
];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

// Lógica de Foto desde Galería
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userData.photo = e.target.result;
            const preview = document.getElementById('profile-preview');
            preview.innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function goToProfile() {
    userData.email = document.getElementById('auth-email').value || "invitado@cristo.com";
    showView('view-profile-setup');
}

function setProfileRole(role) {
    userData.role = role;
    document.getElementById('btn-role-alumno').className = role === 'alumno' ? 'p-3 border-2 border-blue-600 bg-blue-50 rounded-xl font-bold text-sm' : 'p-3 border-2 border-gray-100 rounded-xl font-bold text-sm';
    document.getElementById('btn-role-maestro').className = role === 'maestro' ? 'p-3 border-2 border-blue-600 bg-blue-50 rounded-xl font-bold text-sm' : 'p-3 border-2 border-gray-100 rounded-xl font-bold text-sm';
    
    document.getElementById('setup-alumno-extra').classList.toggle('hidden', role !== 'alumno');
    document.getElementById('setup-maestro-extra').classList.toggle('hidden', role !== 'maestro');
}

function finishSetup() {
    const name = document.getElementById('setup-name').value;
    const phone = document.getElementById('setup-phone').value;
    
    if (!name || !phone || !userData.role) {
        alert("Completa los campos obligatorios");
        return;
    }

    userData.name = name;
    userData.phone = phone;
    userData.maestro = document.getElementById('select-maestro').value;

    // Actualizar UI del Perfil y Home
    updateProfileUI();

    if (userData.role === 'alumno') {
        renderBooks();
        showView('view-student-home');
    } else {
        alert("¡Bienvenido Maestro!");
    }
}

function updateProfileUI() {
    // Foto en Home y Detalles
    const avatarHome = document.getElementById('user-avatar-home');
    const avatarDetail = document.getElementById('profile-img-detail');
    
    const content = userData.photo ? `<img src="${userData.photo}" class="w-full h-full object-cover">` : userData.name.charAt(0);
    avatarHome.innerHTML = content;
    avatarDetail.innerHTML = content;

    // Textos
    document.getElementById('display-name').innerText = userData.name;
    document.getElementById('detail-name').innerText = userData.name;
    document.getElementById('detail-email').innerText = userData.email;
    document.getElementById('detail-phone').innerText = userData.phone;
    document.getElementById('detail-role').innerText = userData.role;
    document.getElementById('detail-maestro').innerText = userData.maestro || "N/A";
    document.getElementById('detail-maestro-row').classList.toggle('hidden', userData.role !== 'alumno');
}

function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = BOOKS_DATA.map(book => `
        <div onclick="${book.status === 'disponible' ? `openBook('${book.title}')` : `alert('Libro bloqueado hasta corregir el anterior')`}" 
             class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-95 transition-all cursor-pointer">
            <div class="w-12 h-12 ${book.color} rounded-2xl flex items-center justify-center text-white">
                <span class="material-symbols-outlined text-sm">${book.status === 'bloqueado' ? 'lock' : 'book_2'}</span>
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-gray-900 text-sm">${book.title}</h4>
                <p class="text-[9px] font-bold text-gray-400 uppercase">${book.chapters} Capítulos</p>
            </div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
    `).join('');
}

function openBook(title) {
    document.getElementById('chapter-title').innerText = title;
    showView('view-chapter');
}

function submitLesson() {
    alert("¡Tarea enviada a " + userData.maestro + "!");
    showView('view-student-home');
}

function logout() {
    location.reload();
}
