let userData = { email: "", name: "", phone: "", role: "", maestro: "", photo: null };

const BOOKS_DATA = [
    { id: 1, title: 'Libro 1: Fundamentos de Fe', status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: Vida de Oración', status: 'bloqueado', color: 'bg-gray-400' },
    { id: 3, title: 'Libro 3: Carácter de Cristo', status: 'bloqueado', color: 'bg-gray-400' }
];

let forumPosts = [
    { id: 1, author: "Pastor Juan", role: "maestro", text: "¡Bienvenidos al muro de consultas!", replies: [] }
];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    if(viewId === 'view-community') renderForum();
}

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            userData.photo = e.target.result;
            document.getElementById('profile-preview').innerHTML = `<img src="${e.target.result}" class="w-full h-full object-cover">`;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function goToProfile() {
    userData.email = document.getElementById('auth-email').value || "user@app.com";
    showView('view-profile-setup');
}

function setProfileRole(role) {
    userData.role = role;
    document.getElementById('btn-role-alumno').className = role === 'alumno' ? 'p-3 border-2 border-blue-600 bg-blue-50 rounded-xl font-bold text-xs text-blue-600' : 'p-3 border-gray-200 border rounded-xl font-bold text-xs text-gray-400';
    document.getElementById('btn-role-maestro').className = role === 'maestro' ? 'p-3 border-2 border-blue-600 bg-blue-50 rounded-xl font-bold text-xs text-blue-600' : 'p-3 border-gray-200 border rounded-xl font-bold text-xs text-gray-400';
    document.getElementById('setup-alumno-extra').classList.toggle('hidden', role !== 'alumno');
}

function finishSetup() {
    const name = document.getElementById('setup-name').value;
    const phone = document.getElementById('setup-phone').value;
    if (!name || !phone || !userData.role) { alert("Completa tus datos"); return; }
    
    userData.name = name; userData.phone = phone;
    updateUI();
    renderBooks();
    showView('view-student-home');
}

function updateUI() {
    const pic = userData.photo ? `<img src="${userData.photo}" class="w-full h-full object-cover">` : `<span>${userData.name[0]}</span>`;
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
            <div class="w-12 h-12 ${book.color} rounded-2xl flex items-center justify-center text-white font-bold italic">${book.id}</div>
            <div class="flex-1 font-bold text-sm text-gray-800">${book.title}</div>
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
        alert("Termina el libro anterior para desbloquear este.");
    }
}

// FORO
function renderForum(filter = "") {
    const container = document.getElementById('forum-container');
    container.innerHTML = "";
    forumPosts.filter(p => p.text.toLowerCase().includes(filter.toLowerCase())).forEach(post => {
        const d = document.createElement('div');
        d.className = "bg-white p-4 rounded-2xl border border-gray-100 space-y-2 shadow-sm";
        d.innerHTML = `
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">${post.author[0]}</div>
                <p class="text-xs font-bold">${post.author} <span class="text-[8px] text-gray-400 uppercase">(${post.role})</span></p>
            </div>
            <p class="text-sm text-gray-600">${post.text}</p>
            <div class="flex gap-2 pt-2 border-t border-gray-50">
                <input type="text" id="reply-${post.id}" placeholder="Responder..." class="flex-1 text-xs bg-gray-50 p-2 rounded-lg outline-none">
                <button onclick="addReply(${post.id})" class="text-blue-600 font-bold text-xs">Enviar</button>
            </div>
        `;
        container.appendChild(d);
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

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function logout() { location.reload(); }
