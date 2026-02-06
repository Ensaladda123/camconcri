let userData = { email: "", name: "", phone: "", role: "", photo: null };

const BOOKS = [
    { id: 1, title: 'Libro 1: Fundamentos de Fe', status: 'disponible', color: 'bg-blue-600' },
    { id: 2, title: 'Libro 2: Vida de Oración', status: 'bloqueado', color: 'bg-gray-300' }
];

let forumPosts = [{ id: 1, author: "Pastor Juan", text: "Bienvenidos hermanos.", role: "Maestro" }];

function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'view-community') renderForum();
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
    userData.email = document.getElementById('auth-email').value || "user@test.com";
    showView('view-profile-setup');
}

function setProfileRole(role) {
    userData.role = role;
    document.getElementById('btn-role-alumno').className = role === 'alumno' ? 'p-3 border-2 border-blue-600 bg-blue-50 rounded-xl text-xs font-bold text-blue-600' : 'p-3 border rounded-xl text-xs font-bold text-gray-400';
    document.getElementById('btn-role-maestro').className = role === 'maestro' ? 'p-3 border-2 border-blue-600 bg-blue-50 rounded-xl text-xs font-bold text-blue-600' : 'p-3 border rounded-xl text-xs font-bold text-gray-400';
}

function finishSetup() {
    const name = document.getElementById('setup-name').value;
    const phone = document.getElementById('setup-phone').value;
    if(!name || !phone || !userData.role) return alert("Completa los datos");
    
    userData.name = name; userData.phone = phone;
    updateUI();
    renderBooks();
    showView('view-student-home');
}

function updateUI() {
    const imgHtml = userData.photo ? `<img src="${userData.photo}" class="w-full h-full object-cover">` : `<span>${userData.name[0]}</span>`;
    document.getElementById('user-avatar-home').innerHTML = imgHtml;
    document.getElementById('profile-img-detail').innerHTML = imgHtml;
    document.getElementById('display-name').innerText = userData.name;
    document.getElementById('detail-name').innerText = userData.name;
    document.getElementById('detail-phone').innerText = userData.phone;
}

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
    const b = BOOKS.find(x => x.id === id);
    if(b.status === 'disponible') {
        document.getElementById('chapter-title').innerText = b.title;
        showView('view-chapter');
    } else alert("Libro bloqueado");
}

function renderForum() {
    const container = document.getElementById('forum-container');
    container.innerHTML = forumPosts.map(p => `
        <div class="bg-white p-4 rounded-2xl border border-gray-100 space-y-2">
            <p class="text-xs font-bold text-blue-600">${p.author} <span class="text-[8px] text-gray-400">(${p.role})</span></p>
            <p class="text-sm text-gray-600">${p.text}</p>
        </div>
    `).join('');
}

function postQuestion() {
    const text = document.getElementById('new-question-text').value;
    if(!text) return;
    forumPosts.unshift({ id: Date.now(), author: userData.name, text: text, role: userData.role });
    document.getElementById('new-question-text').value = "";
    closeModal('modal-question');
    renderForum();
}

function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
