// --- ESTADO DE LA APP ---
let currentUser = JSON.parse(localStorage.getItem('user_session')) || null;

const BOOKS = [
    { id: 1, title: 'Libro 1: Fundamentos de Fe', status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: Vida de Oración', status: 'bloqueado', color: 'bg-gray-300' },
    { id: 3, title: 'Libro 3: El Carácter de Cristo', status: 'bloqueado', color: 'bg-gray-300' }
];

// --- AL INICIAR LA APP ---
window.onload = () => {
    if (currentUser) {
        showMainApp();
    } else {
        showView('view-auth');
    }
};

// --- NAVEGACIÓN ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

function navTo(viewId) {
    showView(viewId);
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('nav-' + viewId.split('-')[1]).classList.add('active');
}

// --- LOGICA DE AUTH ---
function loginSocial(provider) {
    // Simulación de login exitoso
    const email = document.getElementById('auth-email').value || `usuario_${provider.toLowerCase()}@test.com`;
    if(!email.includes('@')) return alert("Por favor, escribe un correo para simular el acceso.");
    
    // Si ya existe en memoria, entra directo, si no, va a setup
    if(currentUser) showMainApp();
    else showView('view-setup');
}

function checkEmail() {
    const email = document.getElementById('auth-email').value;
    if(!email.includes('@')) return alert("Correo no válido");
    showView('view-setup');
}

let tempRole = "";
function selectRole(role) {
    tempRole = role;
    document.getElementById('card-alumno').className = "role-card p-4 rounded-2xl text-center font-bold text-sm " + (role === 'alumno' ? 'active' : '');
    document.getElementById('card-maestro').className = "role-card p-4 rounded-2xl text-center font-bold text-sm " + (role === 'maestro' ? 'active' : '');
    
    document.getElementById('extra-alumno').classList.toggle('hidden', role !== 'alumno');
    document.getElementById('extra-maestro').classList.toggle('hidden', role !== 'maestro');
}

function completeRegistration() {
    const name = document.getElementById('setup-name').value;
    const phone = document.getElementById('setup-phone').value;
    
    if(!name || !phone || !tempRole) return alert("Completa todos los datos, por favor.");
    
    // Crear objeto de usuario
    currentUser = {
        name: name,
        phone: phone,
        role: tempRole,
        email: document.getElementById('auth-email').value,
        maestro: document.getElementById('setup-maestro').value
    };

    // GUARDAR SESIÓN (Para que no se borre al refrescar)
    localStorage.setItem('user_session', JSON.stringify(currentUser));
    
    showMainApp();
}

// --- LÓGICA DE LA APP DENTRO ---
function showMainApp() {
    showView('view-home');
    document.getElementById('main-nav').classList.remove('hidden');
    updateUI();
    renderBooks();
}

function updateUI() {
    const initial = currentUser.name[0].toUpperCase();
    document.getElementById('avatar-circle').innerText = initial;
    document.getElementById('profile-big-avatar').innerText = initial;
    document.getElementById('user-name-display').innerText = currentUser.name;
    document.getElementById('user-role-display').innerText = currentUser.role;
    
    // Perfil
    document.getElementById('p-name').innerText = currentUser.name;
    document.getElementById('p-phone').innerText = currentUser.phone;
}

function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = BOOKS.map(b => `
        <div class="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all">
            <div class="w-14 h-14 ${b.color} rounded-2xl flex items-center justify-center text-white font-bold italic shadow-inner">${b.id}</div>
            <div class="flex-1">
                <p class="font-bold text-gray-800">${b.title}</p>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">${b.status}</p>
            </div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
    `).join('');
}

function logout() {
    localStorage.removeItem('user_session');
    location.reload();
}
