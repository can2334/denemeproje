import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "BURAYA",
  authDomain: "BURAYA",
  projectId: "BURAYA",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const list = document.getElementById("bookList");

// kitapları getir
async function loadBooks() {
  list.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "books"));

  querySnapshot.forEach((d) => {
    const data = d.data();

    const li = document.createElement("li");
    li.innerHTML = `
      ${data.title} - ${data.author}
      <button onclick="deleteBook('${d.id}')">Sil</button>
      <button onclick="editBook('${d.id}', '${data.title}', '${data.author}')">Düzenle</button>
    `;

    list.appendChild(li);
  });
}

// ekleme
window.addBook = async function () {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;

  if (!title || !author) return;

  await addDoc(collection(db, "books"), {
    title,
    author
  });

  loadBooks();
};

// silme
window.deleteBook = async function (id) {
  await deleteDoc(doc(db, "books", id));
  loadBooks();
};

// güncelleme
window.editBook = async function (id, oldTitle, oldAuthor) {
  const title = prompt("Yeni kitap adı:", oldTitle);
  const author = prompt("Yeni yazar:", oldAuthor);

  if (!title || !author) return;

  await updateDoc(doc(db, "books", id), {
    title,
    author
  });

  loadBooks();
};

// ilk yükleme
loadBooks();
