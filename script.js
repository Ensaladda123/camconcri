// DATOS MOCK
const BOOKS = [
    { id: 1, title: 'Fundamentos de Fe', module: 'Módulo 1', progress: 65, locked: false, color: 'bg-blue-600' },
    { id: 2, title: 'Vida de Oración', module: 'Módulo 2', progress: 0, locked: true, color: 'bg-gray-400' },
    { id: 3, title: 'Carácter de Cristo', module: 'Módulo 3', progress: 0, locked: true, color: 'bg-gray-400' },
    { id: 4, title: 'El Gran Mandato', module: 'Módulo 4', progress: 0, locked: true, color: 'bg-gray-400' },
    { id: 5, title: 'Liderazgo Eficaz', module: 'Módulo 5', progress: 0, locked: true, color: 'bg-gray-400' },
    { id: 6, title: 'Misiones Mundiales', module: 'Módulo 6', progress: 0, locked: true, color: 'bg-gray-400' }
];

const STUDENTS = [
    { id: 1, name: 'Juan Delgado', current: 'Módulo 2', pending: true, avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'María Castro', current: 'Módulo 1', pending: false, avatar: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, name: 'Roberto Sánchez', current: 'Módulo 3', pending: true, avatar: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, name: 'Elena López', current: 'Módulo 4', pending: false, avatar: 'https://i.pravatar.cc/150?u=4' }
];

// ESTADO GLOBAL
let currentRole = null;

// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {
    setupInputs();
    renderBooks();
    renderStudents();
});

// NAVEGACIÓN
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
}

function selectRole(role) {
    currentRole = role;
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('active'));
    document.getElementById(`role-${role}`).classList.add('active');
    
    const subtitle = document.getElementById('login-subtitle');
    const teacherCode = document.getElementById('teacher-code-container');

    if (role === 'maestro') {
        subtitle.innerText = 'Verificación Ministerial';
        teacherCode.classList.remove('hidden');
    } else {
        subtitle.innerText = 'Empieza mi camino';
        teacherCode.classList.add('hidden');
    }
}

function handleLogin() {
    if (!currentRole) {
        alert("Por favor selecciona un rol");
        return;
    }
    
    if (currentRole === 'alumno') {
        showView('view-student-home');
    } else {
        // Validación de código dummy
        const code = Array.from(document.querySelectorAll('.pin-input')).map(i => i.value).join('');
        if (code.length < 4) {
            alert("Ingresa el código completo");
            return;
        }
        showView('view-teacher-panel');
    }
}

function logout() {
    showView('view-login');
    // Reset inputs
    document.querySelectorAll('.pin-input').forEach(i => i.value = '');
    document.querySelectorAll('.role-card').forEach(c => c.classList.remove('active'));
    currentRole = null;
}

// RENDERIZADO
function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = BOOKS.map(book => `
        <div onclick="${book.locked ? '' : `openBook('${book.title}')`}" 
             class="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50 flex transition-transform active:scale-95 ${book.locked ? 'opacity-60 grayscale' : 'cursor-pointer'}">
            <div class="w-24 ${book.color} flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-3xl">${book.locked ? 'lock' : 'menu_book'}</span>
            </div>
            <div class="flex-1 p-5">
                <h4 class="font-bold text-gray-900">${book.title}</h4>
                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-3">${book.module}</p>
                <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div class="bg-ministerial-blue h-full" style="width: ${book.progress}%"></div>
                </div>
                <div class="flex justify-between mt-1">
                    <span class="text-[8px] font-bold text-gray-400">PROGRESO</span>
                    <span class="text-[8px] font-bold text-ministerial-blue">${book.progress}%</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderStudents() {
    const container = document.getElementById('students-list');
    container.innerHTML = STUDENTS.map(st => `
        <div class="student-row flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-50 active:scale-[0.98] transition-all cursor-pointer">
            <img src="${st.avatar}" class="w-12 h-12 rounded-full border-2 border-white shadow-sm">
            <div class="flex-1">
                <h5 class="font-bold text-sm text-gray-900">${st.name}</h5>
                <p class="text-[10px] text-gray-400 font-bold">${st.current}</p>
            </div>
            <div class="flex items-center gap-2">
                ${st.pending ? `<span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>` : ''}
                <span class="material-symbols-outlined text-gray-300 text-lg">chevron_right</span>
            </div>
        </div>
    `).join('');
}

// ACCIONES DE CURSO
function openBook(title) {
    document.getElementById('chapter-title').innerText = title;
    showView('view-chapter');
}

function submitLesson() {
    alert("¡Tu respuesta ha sido enviada al maestro!");
    showView('view-student-home');
}

// LÓGICA DE INPUTS (PIN)
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