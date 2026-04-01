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

// Senin güncel Firebase yapılandırman
const firebaseConfig = {
  apiKey: "AIzaSyDj8JY0IcljAhVtprPyJGCNn81vbllbGOA",
  authDomain: "deneme-49ca2.firebaseapp.com",
  databaseURL: "https://deneme-49ca2-default-rtdb.firebaseio.com",
  projectId: "deneme-49ca2",
  storageBucket: "deneme-49ca2.firebasestorage.app",
  messagingSenderId: "67012979472",
  appId: "1:67012979472:web:b3923f8678fc82ce6b9395",
  measurementId: "G-58HGZCP093"
};

// Firebase'i Başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const list = document.getElementById("bookList");

// 1. Verileri Getirme (Load)
async function loadBooks() {
    if (!list) return; // Liste elementi yoksa hata vermemesi için
    list.innerHTML = "Yükleniyor..."; 
    
    try {
        const querySnapshot = await getDocs(collection(db, "books"));
        list.innerHTML = ""; // Yükleniyor yazısını temizle

        querySnapshot.forEach((d) => {
            const data = d.data();
            const li = document.createElement("li");
            
            li.innerHTML = `
                <span><strong>${data.title}</strong> - ${data.author}</span>
                <div>
                    <button onclick="editBook('${d.id}', '${data.title}', '${data.author}')">Düzenle</button>
                    <button onclick="deleteBook('${d.id}')" style="color: red;">Sil</button>
                </div>
                <hr>
            `;
            list.appendChild(li);
        });
    } catch (error) {
        console.error("Veri çekilirken hata oluştu: ", error);
        list.innerHTML = "Veriler yüklenemedi. Lütfen kuralları kontrol edin.";
    }
}

// 2. Veri Ekleme (Create)
window.addBook = async function () {
    const titleInput = document.getElementById("title");
    const authorInput = document.getElementById("author");

    const title = titleInput.value;
    const author = authorInput.value;

    if (!title || !author) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    try {
        await addDoc(collection(db, "books"), {
            title: title,
            author: author,
            createdAt: new Date() // Sıralama için tarih eklendi
        });

        // Formu temizle
        titleInput.value = "";
        authorInput.value = "";
        
        loadBooks(); // Listeyi yenile
    } catch (error) {
        alert("Ekleme hatası: " + error.message);
    }
};

// 3. Veri Silme (Delete)
window.deleteBook = async function (id) {
    if (confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
        try {
            await deleteDoc(doc(db, "books", id));
            loadBooks();
        } catch (error) {
            alert("Silme hatası: " + error.message);
        }
    }
};

// 4. Veri Güncelleme (Update)
window.editBook = async function (id, oldTitle, oldAuthor) {
    const title = prompt("Yeni kitap adı:", oldTitle);
    const author = prompt("Yeni yazar:", oldAuthor);

    if (!title || !author) return;

    try {
        await updateDoc(doc(db, "books", id), {
            title: title,
            author: author
        });
        loadBooks();
    } catch (error) {
        alert("Güncelleme hatası: " + error.message);
    }
};

// Sayfa açıldığında verileri yükle
loadBooks();
