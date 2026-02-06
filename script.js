// 1. ESTADO DE LA APP (Simulando una base de datos)
let currentUser = {
    role: null,
    name: 'Daniel',
    booksProgress: [
        { id: 1, title: 'Fundamentos de Fe', status: 'completado', color: 'bg-blue-600' },
        { id: 2, title: 'Vida de Oración', status: 'pendiente', color: 'bg-gray-400' }, // Bloqueado hasta que M1 sea corregido
        { id: 3, title: 'Carácter de Cristo', status: 'bloqueado', color: 'bg-gray-400' },
    ]
};

const STUDENTS_FOR_TEACHER = [
    { id: 1, name: 'Juan Delgado', current: 'Módulo 1', status: 'Necesita Corrección', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'María Castro', current: 'Módulo 1', status: 'Al día', avatar: 'https://i.pravatar.cc/150?u=2' }
];

// 2. INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    setupInputs();
    renderBooks();
    renderStudents();
});

// 3. NAVEGACIÓN MEJORADA
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const targetView = document.getElementById(viewId);
    if (targetView) targetView.classList.remove('hidden');
}

function selectRole(role) {
    currentUser.role = role;
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('active'));
    document.getElementById(`role-${role}`).classList.add('active');
    
    const subtitle = document.getElementById('login-subtitle');
    const teacherCode = document.getElementById('teacher-code-container');

    if (role === 'maestro') {
        subtitle.innerText = 'VERIFICACIÓN MINISTERIAL';
        teacherCode.classList.remove('hidden');
    } else {
        subtitle.innerText = 'EMPIEZA MI CAMINO';
        teacherCode.classList.add('hidden');
    }
}

function handleLogin() {
    if (!currentUser.role) {
        alert("Por favor selecciona un rol para continuar");
        return;
    }
    
    if (currentUser.role === 'alumno') {
        // Simulamos que el alumno entra a su Home
        showView('view-student-home');
    } else {
        const code = Array.from(document.querySelectorAll('.pin-input')).map(i => i.value).join('');
        if (code === "1234") { // Código de prueba para el maestro
            showView('view-teacher-panel');
        } else {
            alert("Código Ministerial Incorrecto. Pídeselo a tu administrador.");
        }
    }
}

// 4. RENDERIZADO DE LÓGICA DE NEGOCIO (Libros)
function renderBooks() {
    const container = document.getElementById('books-container');
    if(!container) return;

    container.innerHTML = currentUser.booksProgress.map(book => {
        const isLocked = book.status === 'bloqueado' || book.status === 'pendiente';
        return `
        <div onclick="${isLocked ? `alert('Este libro estará disponible cuando el maestro corrija el anterior')` : `openBook('${book.title}')`}" 
             class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 flex transition-all active:scale-95 ${isLocked ? 'opacity-50 grayscale' : 'cursor-pointer hover:border-ministerial-blue'}">
            <div class="w-24 ${isLocked ? 'bg-gray-300' : book.color} flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-3xl">${isLocked ? 'lock' : 'menu_book'}</span>
            </div>
            <div class="flex-1 p-5">
                <h4 class="font-bold text-gray-900">${book.title}</h4>
                <p class="text-[10px] ${isLocked ? 'text-orange-500' : 'text-emerald-500'} font-bold uppercase mt-1">
                    ${book.status.toUpperCase()}
                </p>
            </div>
        </div>
    `}).join('');
}

function renderStudents() {
    const container = document.getElementById('students-list');
    if(!container) return;

    container.innerHTML = STUDENTS_FOR_TEACHER.map(st => `
        <div class="student-row flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-50 active:scale-95 transition-all cursor-pointer">
            <img src="${st.avatar}" class="w-12 h-12 rounded-full border-2 border-ministerial-gold shadow-sm">
            <div class="flex-1">
                <h5 class="font-bold text-sm text-gray-900">${st.name}</h5>
                <p class="text-[10px] text-gray-400 font-bold">${st.current}</p>
            </div>
            <span class="text-[9px] font-bold px-2 py-1 rounded-full ${st.status === 'Al día' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}">
                ${st.status}
            </span>
        </div>
    `).join('');
}

// 5. ACCIONES
function openBook(title) {
    document.getElementById('chapter-title').innerText = title;
    showView('view-chapter');
}

function submitLesson() {
    // Aquí simulamos el envío que me comentaste
    alert("¡Tarea enviada! Ahora el libro quedará en revisión hasta que tu maestro lo apruebe.");
    showView('view-student-home');
}

function logout() {
    showView('view-login');
    document.querySelectorAll('.pin-input').forEach(i => i.value = '');
    currentUser.role = null;
}

function setupInputs() {
    const inputs = document.querySelectorAll('.pin-input');
    inputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            if (e.target.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
    });
}
