let userData = { email: "", name: "", phone: "", role: "", maestro: "" };

const BOOKS = [
    { id: 1, title: 'Libro 1: Fundamentos de Fe', status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: Vida de Oración', status: 'bloqueado', color: 'bg-gray-300' },
    { id: 3, title: 'Libro 3: Carácter de Cristo', status: 'bloqueado', color: 'bg-gray-300' }
];

let forumPosts = [{ id: 1, author: "Admin", text: "¡Bienvenidos a la comunidad!", role: "Sistema" }];

// NAVEGACIÓN
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'view-community') renderForum();
}

// LOGIN
function goToProfile() {
    const email = document.getElementById('auth-email').value;
    if(!email.includes('@')) { alert("Ingresa un correo válido"); return; }
    userData.email = email;
    showView('view-profile-setup');
}

// SELECCIÓN DE ROL
function setRole(role) {
    userData.role = role;
    document.getElementById('role-alumno').classList.toggle('active-role', role === 'alumno');
    document.getElementById('role-maestro').classList.toggle('active-role', role === 'maestro');
    
    document.getElementById('extra-alumno').classList.toggle('hidden', role !== 'alumno');
    document.getElementById('extra-maestro').classList.toggle('hidden', role !== 'maestro');
}

// FINALIZAR SETUP
function finishSetup() {
    const name = document.getElementById('setup-name').value;
    const phone = document.getElementById('setup-phone').value;
    
    if(!name || !phone || !userData.role) {
        alert("⚠️ Completa todos los campos obligatorios");
        return;
    }

    if(userData.role === 'alumno') {
        const maestro = document.getElementById('select-maestro').value;
        if(!maestro) { alert("Selecciona un maestro"); return; }
        userData.maestro = maestro;
    } else if(userData.role === 'maestro') {
        const code = document.getElementById('maestro-code').value;
        if(code !== "1234") { alert("Código de maestro incorrecto"); return; }
    }

    userData.name = name;
    userData.phone = phone;
    
    updateUI();
    renderBooks();
    showView('view-student-home');
}

// ACTUALIZAR INTERFAZ
function updateUI() {
    const initial = userData.name[0].toUpperCase();
    document.getElementById('user-avatar-home').innerText = initial;
    document.getElementById('profile-img-detail').innerText = initial;
    document.getElementById('display-name').innerText = userData.name;
    document.getElementById('display-role').innerText = userData.role;
    document.getElementById('detail-name').innerText = userData.name;
    document.getElementById('detail-phone').innerText = userData.phone;
    document.getElementById('detail-role').innerText = userData.role;
}

// RENDERIZAR LIBROS
function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = BOOKS.map(b => `
        <div onclick="openBook(${b.id})" class="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all">
            <div class="w-12 h-12 ${b.color} rounded-2xl flex items-center justify-center text-white font-bold italic">${b.id}</div>
            <div class="flex-1 font-bold text-sm text-gray-800">${b.title}</div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
    `).join('');
}

function openBook(id) {
    const book = BOOKS.find(x => x.id === id);
    if(book.status === 'disponible') {
        document.getElementById('chapter-title').innerText = book.title;
        showView('view-chapter');
    } else {
        alert("🔒 Este libro se desbloquea al terminar el anterior.");
    }
}

// FORO
function renderForum() {
    const container = document.getElementById('forum-container');
    container.innerHTML = forumPosts.map(p => `
        <div class="bg-white p-4 rounded-2xl border border-gray-100 space-y-2 shadow-sm">
            <p class="text-[10px] font-bold text-blue-600 uppercase">${p.author} <span class="text-gray-300">| ${p.role}</span></p>
            <p class="text-sm text-gray-700">${p.text}</p>
        </div>
    `).join('');
}

function postQuestion() {
    const text = document.getElementById('new-question-text').value;
    if(!text.trim()) return;
    forumPosts.unshift({ id: Date.now(), author: userData.name, text: text, role: userData.role });
    document.getElementById('new-question-text').value = "";
    closeModal('modal-question');
    renderForum();
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
