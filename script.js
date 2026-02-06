let userData = {
    email: "",
    name: "",
    phone: "",
    role: "",
    maestro: "",
    photo: null
};

const BOOKS_DATA = [
    { id: 1, title: 'Libro 1: Fundamentos de Fe', chapters: 5, status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: Vida de Oración', chapters: 4, status: 'bloqueado', color: 'bg-gray-400' },
    { id: 3, title: 'Libro 3: Carácter de Cristo', chapters: 6, status: 'bloqueado', color: 'bg-gray-400' }
];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const view = document.getElementById(viewId);
    if(view) view.classList.remove('hidden');
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
    userData.email = document.getElementById('auth-email').value || "usuario@ejemplo.com";
    showView('view-profile-setup');
}

function setProfileRole(role) {
    userData.role = role;
    document.getElementById('btn-role-alumno').className = role === 'alumno' ? 'p-3 border-2 border-blue-600 bg-blue-50 rounded-xl font-bold text-sm text-blue-600' : 'p-3 border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-400';
    document.getElementById('btn-role-maestro').className = role === 'maestro' ? 'p-3 border-2 border-blue-600 bg-blue-50 rounded-xl font-bold text-sm text-blue-600' : 'p-3 border-2 border-gray-100 rounded-xl font-bold text-sm text-gray-400';
    
    document.getElementById('setup-alumno-extra').classList.toggle('hidden', role !== 'alumno');
    document.getElementById('setup-maestro-extra').classList.toggle('hidden', role !== 'maestro');
}

function finishSetup() {
    const nameVal = document.getElementById('setup-name').value;
    const phoneVal = document.getElementById('setup-phone').value;
    
    if (!nameVal || !phoneVal || !userData.role) {
        alert("⚠️ Completa los campos obligatorios");
        return;
    }

    if (userData.role === 'maestro' && document.getElementById('maestro-code').value !== "1234") {
        alert("❌ Código incorrecto");
        return;
    }

    userData.name = nameVal;
    userData.phone = phoneVal;
    userData.maestro = document.getElementById('select-maestro').value;

    updateUI();
    
    if (userData.role === 'alumno') {
        renderBooks();
        showView('view-student-home');
    } else {
        alert("Panel Maestro: En desarrollo");
    }
}

function updateUI() {
    const content = userData.photo ? `<img src="${userData.photo}" class="w-full h-full object-cover">` : `<span class="text-white text-xl">${userData.name[0].toUpperCase()}</span>`;
    
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
        <div onclick="${book.status === 'disponible' ? `openBook('${book.title}')` : `alert('Este libro se desbloqueará cuando el maestro corrija el anterior.')`}" 
             class="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-4 active:scale-95 transition-all cursor-pointer">
            <div class="w-14 h-14 ${book.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg italic shadow-sm">
                ${book.id}
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-gray-900 text-sm">${book.title}</h4>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">${book.chapters} Capítulos</p>
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
    alert("¡Excelente! Tu reflexión ha sido enviada al maestro: " + (userData.maestro || "Asignado") + ". Recibirás una notificación cuando sea corregida.");
    showView('view-student-home');
}

function logout() { location.reload(); }
