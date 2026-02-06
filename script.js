let userData = { email: "", name: "", phone: "", role: "", maestro: "", photo: null };

const BOOKS = [
    { id: 1, title: 'Libro 1: Fundamentos de Fe', status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: Vida de Oración', status: 'bloqueado', color: 'bg-gray-300' }
];

let forumPosts = [
    { id: 1, author: "Pastor Juan", text: "¡Bienvenidos al muro ministerial!", role: "Maestro", replies: [] }
];

// NAVEGACIÓN
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'view-community') renderForum();
    if(id === 'view-user-details') fillProfileEdit();
}

// FOTO DE PERFIL
function previewImage(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userData.photo = e.target.result;
            document.getElementById(previewId).innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// LOGIN
function goToProfile() {
    const email = document.getElementById('auth-email').value;
    if(!email.includes('@')) { alert("Ingresa un correo válido"); return; }
    userData.email = email;
    showView('view-profile-setup');
}

// ROL
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
    if(!name || !phone || !userData.role) return alert("Faltan datos");
    
    if(userData.role === 'maestro' && document.getElementById('maestro-code').value !== "1234") return alert("Código incorrecto");

    userData.name = name; userData.phone = phone;
    updateUI();
    renderBooks();
    showView('view-student-home');
}

// ACTUALIZAR INTERFAZ GLOBAL
function updateUI() {
    const imgHtml = userData.photo ? `<img src="${userData.photo}" class="w-full h-full object-cover">` : `<span class="text-white font-bold">${userData.name[0].toUpperCase()}</span>`;
    document.getElementById('user-avatar-home').innerHTML = imgHtml;
    document.getElementById('detail-avatar-preview').innerHTML = imgHtml;
    document.getElementById('display-name').innerText = userData.name;
    document.getElementById('display-role').innerText = userData.role;
}

// PERFIL (EDICIÓN)
function fillProfileEdit() {
    document.getElementById('edit-name').value = userData.name;
    document.getElementById('edit-phone').value = userData.phone;
}

function saveProfileChanges() {
    userData.name = document.getElementById('edit-name').value;
    userData.phone = document.getElementById('edit-phone').value;
    updateUI();
    alert("Perfil actualizado");
    showView('view-student-home');
}

// LIBROS
function renderBooks() {
    document.getElementById('books-container').innerHTML = BOOKS.map(b => `
        <div onclick="openBook(${b.id})" class="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all">
            <div class="w-12 h-12 ${b.color} rounded-2xl flex items-center justify-center text-white font-bold italic shadow-inner">${b.id}</div>
            <div class="flex-1 font-bold text-sm text-gray-800">${b.title}</div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
    `).join('');
}

function openBook(id) {
    const b = BOOKS.find(x => x.id === id);
    if(b.status === 'disponible') {
        document.getElementById('chapter-title').innerText = b.title;
        showView('view-chapter');
    } else alert("Libro bloqueado");
}

// COMUNIDAD (FORO + RESPUESTAS)
function renderForum() {
    const container = document.getElementById('forum-container');
    container.innerHTML = forumPosts.map(p => `
        <div class="bg-white p-4 rounded-2xl border border-gray-100 space-y-3 shadow-sm">
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                    ${p.author[0].toUpperCase()}
                </div>
                <p class="text-xs font-bold text-gray-800">${p.author} <span class="text-[8px] text-gray-400">(${p.role})</span></p>
            </div>
            <p class="text-sm text-gray-600">${p.text}</p>
            
            <div class="pl-4 space-y-2 border-l-2 border-blue-50">
                ${p.replies.map(r => `
                    <div class="bg-gray-50 p-2 rounded-lg text-xs">
                        <span class="font-bold text-blue-600">${r.author}:</span> ${r.text}
                    </div>
                `).join('')}
            </div>

            <div class="flex gap-2 pt-2 border-t border-gray-50">
                <input type="text" id="reply-to-${p.id}" placeholder="Escribe un comentario..." class="flex-1 bg-gray-50 px-3 py-2 rounded-xl text-[10px] outline-none border border-gray-100">
                <button onclick="addReply(${p.id})" class="text-blue-600 font-bold text-[10px]">Comentar</button>
            </div>
        </div>
    `).join('');
}

function postQuestion() {
    const text = document.getElementById('new-question-text').value;
    if(!text.trim()) return;
    forumPosts.unshift({ id: Date.now(), author: userData.name, text: text, role: userData.role, replies: [] });
    document.getElementById('new-question-text').value = "";
    closeModal('modal-question');
    renderForum();
}

function addReply(postId) {
    const input = document.getElementById(`reply-to-${postId}`);
    if(!input.value.trim()) return;
    const post = forumPosts.find(p => p.id === postId);
    post.replies.push({ author: userData.name, text: input.value });
    input.value = "";
    renderForum();
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
