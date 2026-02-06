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
    { id: 3, title: 'Libro 3: Carácter', chapters: 6, status: 'bloqueado', color: 'bg-gray-400' }
];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            userData.photo = e.target.result;
            document.getElementById('profile-preview').innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
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
    const nameInput = document.getElementById('setup-name');
    const phoneInput = document.getElementById('setup-phone');
    
    if (!nameInput.value || !phoneInput.value || !userData.role) {
        alert("⚠️ Completa Nombre, Celular y Rol");
        return;
    }

    if (userData.role === 'maestro') {
        if (document.getElementById('maestro-code').value !== "1234") {
            alert("❌ Código incorrecto");
            return;
        }
    } else if (!document.getElementById('select-maestro').value) {
        alert("⚠️ Selecciona un maestro");
        return;
    }

    userData.name = nameInput.value;
    userData.phone = phoneInput.value;
    userData.maestro = document.getElementById('select-maestro').value;

    updateUI();
    
    if (userData.role === 'alumno') {
        renderBooks();
        showView('view-student-home');
    } else {
        alert("Panel Maestro en construcción");
    }
}

function updateUI() {
    const content = userData.photo ? `<img src="${userData.photo}" class="w-full h-full object-cover">` : `<span class="text-white">${userData.name[0]}</span>`;
    
    document.getElementById('user-avatar-home').innerHTML = content;
    document.getElementById('profile-img-detail').innerHTML = content;
    document.getElementById('display-name').innerText = userData.name;
    document.getElementById('detail-name').innerText = userData.name;
    document.getElementById('detail-email').innerText = userData.email;
    document.getElementById('detail-phone').innerText = userData.phone;
    document.getElementById('detail-role').innerText = userData.role;
}

function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = BOOKS_DATA.map(book => `
        <div onclick="${book.status === 'disponible' ? `alert('Cargando lectura...')` : `alert('Bloqueado')`}" 
             class="bg-white p-4 rounded-3xl shadow-sm border flex items-center gap-4">
            <div class="w-12 h-12 ${book.color} rounded-2xl flex items-center justify-center text-white italic font-bold">L${book.id}</div>
            <div class="flex-1 text-sm font-bold">${book.title}</div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
    `).join('');
}

function logout() { location.reload(); }
