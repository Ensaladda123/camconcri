let userData = { email: "", name: "", phone: "", role: "", maestro: "", photo: null };

const BOOKS_DATA = [
    { id: 1, title: 'Libro 1: Fundamentos de Fe', chapters: 5, status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: Vida de Oración', chapters: 4, status: 'bloqueado', color: 'bg-gray-400' },
    { id: 3, title: 'Libro 3: Carácter de Cristo', chapters: 6, status: 'bloqueado', color: 'bg-gray-400' }
];

let forumPosts = [
    { id: 1, author: "Pastor Juan", role: "maestro", text: "¡Bienvenidos! Usen este espacio para cualquier duda ministerial o de los libros.", replies: [] }
];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    const target = document.getElementById(viewId);
    if(target) target.classList.remove('hidden');
    if(viewId === 'view-community') renderForum();
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
    const n = document.getElementById('setup-name').value;
    const p = document.getElementById('setup-phone').value;
    if (!n || !p || !userData.role) { alert("⚠️ Completa tus datos"); return; }
    
    userData.name = n; userData.phone = p;
    userData.maestro = document.getElementById('select-maestro').value;
    updateUI();
    renderBooks();
    showView('view-student-home');
}

function updateUI() {
    const pic = userData.photo ? `<img src="${userData.photo}" class="w-full h-full object-cover">` : `<span class="text-white text-xl">${userData.name[0].toUpperCase()}</span>`;
    document.getElementById('user-avatar-home').innerHTML = pic;
    document.getElementById('profile-img-detail').innerHTML = pic;
    document.getElementById('display-name').innerText = userData.name;
    document.getElementById('detail-name').innerText = userData.name;
    document.getElementById('detail-email').innerText = userData.email;
    document.getElementById('detail-phone').innerText = userData.phone;
    document.getElementById('detail-role').innerText = userData.role;
}

function renderBooks() {
    const container = document.getElementById('books-container');
    container.innerHTML = BOOKS_DATA.map(book => `
        <div onclick="${book.status === 'disponible' ? `alert('Abriendo Libro...')` : `alert('Libro bloqueado')`}" class="bg-white p-5 rounded-3xl border border-gray-50 flex items-center gap-4 shadow-sm active:scale-95 transition-transform">
            <div class="w-12 h-12 ${book.color} rounded-2xl flex items-center justify-center text-white font-bold italic shadow-inner">${book.id}</div>
            <div class="flex-1 font-bold text-sm text-gray-800">${book.title}</div>
            <span class="material-symbols-outlined text-gray-300">chevron_right</span>
        </div>
    `).join('');
}

// --- COMUNIDAD ---
function renderForum(filter = "") {
    const container = document.getElementById('forum-container');
    container.innerHTML = "";
    const filtered = forumPosts.filter(p => p.text.toLowerCase().includes(filter.toLowerCase()));

    filtered.forEach(post => {
        const div = document.createElement('div');
        div.className = "bg-white p-5 rounded-3xl shadow-sm border border-gray-50 space-y-3";
        div.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">${post.author[0].toUpperCase()}</div>
                <div>
                    <p class="text-xs font-bold text-gray-800">${post.author}</p>
                    <p class="text-[8px] text-blue-500 font-bold uppercase tracking-widest">${post.role}</p>
                </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">${post.text}</p>
            <div class="pl-4 space-y-2">
                ${post.replies.map(r => `
                    <div class="bg-gray-50 p-3 rounded-2xl border-l-4 border-blue-200">
                        <p class="text-[9px] font-bold text-gray-400 uppercase">${r.author}</p>
                        <p class="text-xs text-gray-700">${r.text}</p>
                    </div>
                `).join('')}
            </div>
            <div class="flex gap-2 pt-2 border-t border-gray-50">
                <input type="text" id="reply-${post.id}" placeholder="Escribe una respuesta..." class="flex-1 bg-gray-50 px-4 py-2 rounded-xl text-xs outline-none">
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
function logout() { location.reload(); }
