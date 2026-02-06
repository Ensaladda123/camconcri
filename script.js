let userData = { email: "", name: "", phone: "", role: "", maestro: "", photo: null };

const BOOKS_DATA = [
    { id: 1, title: 'Libro 1: Fundamentos de Fe', chapters: 5, status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: Vida de Oración', chapters: 4, status: 'bloqueado', color: 'bg-gray-300' },
    { id: 3, title: 'Libro 3: Carácter de Cristo', chapters: 6, status: 'bloqueado', color: 'bg-gray-300' }
];

let forumPosts = [
    { id: 1, author: "Pastor Juan", role: "maestro", text: "Bienvenidos hermanos. Cualquier duda con las lecciones, pregunten aquí.", replies: [] }
];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(viewId);
    if(target) target.classList.remove('hidden');
    if(viewId === 'view-community') renderForum();
}

function goToProfile() {
    userData.email = document.getElementById('auth-email').value || "invitado@cristo.com";
    showView('view-profile-setup');
}

function setProfileRole(role) {
    userData.role = role;
    document.getElementById('btn-role-alumno').className = role === 'alumno' ? 'p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl font-bold text-xs text-blue-600' : 'p-4 border border-gray-200 rounded-2xl font-bold text-xs text-gray-400';
    document.getElementById('btn-role-maestro').className = role === 'maestro' ? 'p-4 border-2 border-blue-600 bg-blue-50 rounded-2xl font-bold text-xs text-blue-600' : 'p-4 border border-gray-200 rounded-2xl font-bold text-xs text-gray-400';
}

function finishSetup() {
    const name = document.getElementById('setup-name').value;
    const phone = document.getElementById('setup-phone').value;
    if (!name || !phone || !userData.role) { alert("⚠️ Completa los campos"); return; }
    
    userData.name = name; userData.phone = phone;
    updateUI();
    renderBooks();
    showView('view-student-home');
}

function updateUI() {
    const initial = userData.name[0].toUpperCase();
    const pic = `<span>${initial}</span>`;
    document.getElementById('user-avatar-home').innerHTML = pic;
    document.getElementById('profile-img-detail').innerHTML = pic;
    document.getElementById('display-name').innerText = userData.name;
    document.getElementById('detail-name').innerText = userData.name;
    document.getElementById('detail-phone').innerText = userData.phone;
    document.getElementById('detail-role').innerText = userData.role;
}

function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = BOOKS_DATA.map(book => `
        <div onclick="handleBookClick(${book.id})" class="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm active:scale-95 transition-all">
            <div class="w-12 h-12 ${book.color} rounded-2xl flex items-center justify-center text-white font-bold italic shadow-inner">${book.id}</div>
            <div class="flex-1">
                <p class="font-bold text-sm text-gray-800">${book.title}</p>
                <p class="text-[9px] text-gray-400 font-bold uppercase">${book.chapters} Capítulos</p>
            </div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
    `).join('');
}

function handleBookClick(id) {
    const book = BOOKS_DATA.find(b => b.id === id);
    if(book.status === 'disponible') {
        document.getElementById('chapter-title').innerText = book.title;
        showView('view-chapter');
    } else {
        alert("🔒 Libro bloqueado. Debes terminar el anterior.");
    }
}

// Lógica de Foro
function renderForum(filter = "") {
    const container = document.getElementById('forum-container');
    container.innerHTML = "";
    const filtered = forumPosts.filter(p => p.text.toLowerCase().includes(filter.toLowerCase()));

    filtered.forEach(post => {
        const div = document.createElement('div');
        div.className = "bg-white p-5 rounded-3xl border border-gray-50 space-y-3 shadow-sm";
        div.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-[10px]">${post.author[0]}</div>
                <p class="text-xs font-bold text-gray-800">${post.author} <span class="text-[8px] text-gray-400 uppercase ml-1">${post.role}</span></p>
            </div>
            <p class="text-sm text-gray-600">${post.text}</p>
            <div class="flex gap-2 pt-2 border-t border-gray-50">
                <input type="text" id="reply-${post.id}" placeholder="Escribe..." class="flex-1 bg-gray-50 px-3 py-2 rounded-xl text-xs outline-none">
                <button onclick="addReply(${post.id})" class="text-blue-600 font-bold text-xs">Responder</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function postQuestion() {
    const input = document.getElementById('new-question-text');
    if(!input.value.trim()) return;
    forumPosts.unshift({ id: Date.now(), author: userData.name, role: userData.role, text: input.value, replies: [] });
    input.value = "";
    closeModal('modal-question');
    renderForum();
}

function addReply(postId) {
    const input = document.getElementById(`reply-${postId}`);
    if(!input.value.trim()) return;
    const post = forumPosts.find(p => p.id === postId);
    post.replies.push({ author: userData.name, role: userData.role, text: input.value });
    input.value = "";
    renderForum();
}

function filterForum() { renderForum(document.getElementById('search-input').value); }
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
