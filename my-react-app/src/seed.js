import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

export const seedDatabase = async () => {
  const books = [
    { title: "Чистий код", author: "Роберт Мартін", price: 850, genre: "IT", img: "images/book3.jpg" },
    { title: "Чиста архітектура", author: "Роберт Мартін", price: 920, genre: "IT", img: "images/book4.jpg" },
    { title: "Кобзар", author: "Тарас Шевченко", price: 650, genre: "Класика", img: "images/book1.jpg" },
    { title: "Не озирайся і мовчи", author: "Макс Кідрук", price: 290, genre: "Трилер", img: "images/book2.jpg" },
    { title: "Гаррі Поттер", author: "Дж. К. Роулінг", price: 350, genre: "Фентезі", img: "images/book5.jpg" }
  ];

  try {
    const booksCol = collection(db, "books"); // Посилання на колекцію [cite: 230, 243]
    for (const book of books) {
      await addDoc(booksCol, book); // Додавання документа з авто-ID [cite: 232, 248]
    }
    alert("База успішно наповнена книгами!");
  } catch (e) {
    console.error("Помилка при завантаженні: ", e);
  }
};