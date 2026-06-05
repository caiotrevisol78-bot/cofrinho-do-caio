```javascript
import { auth, db, provider } from "./firebase.js";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

window.login = async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (erro) {
    console.error(erro);
    alert("Erro no login: " + erro.message);
  }
};

window.logout = async () => {
  await signOut(auth);
};

window.salvar = async () => {

  try {

    const valor =
      parseFloat(document.getElementById("valor").value) || 0;

    const percentual =
      parseFloat(document.getElementById("percentual").value) || 0;

    const guardado = valor * percentual / 100;

    const usuario = auth.currentUser;

    if (!usuario) {
      alert("Faça login primeiro.");
      return;
    }

    await addDoc(collection(db, "depositos"), {
      uid: usuario.uid,
      nome: usuario.displayName,
      valor,
      percentual,
      guardado,
      data: new Date()
    });

    alert("Depósito salvo com sucesso!");

    document.getElementById("valor").value = "";

    carregar();

  } catch (erro) {

    console.error(erro);
    alert("Erro ao salvar: " + erro.message);

  }
};

window.excluir = async (id) => {

  try {

    await deleteDoc(doc(db, "depositos", id));

    carregar();

  } catch (erro) {

    console.error(erro);
    alert("Erro ao excluir: " + erro.message);

  }
};

async function carregar() {

  try {

    const usuario = auth.currentUser;

    if (!usuario) return;

    const tabela =
      document.getElementById("historico");

    tabela.innerHTML = "";

    let total = 0;

    const q = query(
      collection(db, "depositos"),
      where("uid", "==", usuario.uid)
    );

    const snap = await getDocs(q);

    snap.forEach((item) => {

      const dado = item.data();

      total += Number(dado.guardado || 0);

      tabela.innerHTML += `
        <tr>
          <td>R$ ${Number(dado.valor).toFixed(2)}</td>
          <td>${dado.percentual}%</td>
          <td>R$ ${Number(dado.guardado).toFixed(2)}</td>
          <td>
            <button onclick="excluir('${item.id}')">
              Excluir
            </button>
          </td>
        </tr>
      `;
    });

    document.getElementById("total")
      .innerText = "R$ " + total.toFixed(2);

  } catch (erro) {

    console.error(erro);
    alert("Erro ao carregar: " + erro.message);

  }
}

onAuthStateChanged(auth, (user) => {

  if (user) {

    document.getElementById("usuario").innerHTML =
      `
      <h3>Olá, ${user.displayName}</h3>

      <button onclick="logout()">
        Sair
      </button>
      `;

    carregar();

  } else {

    document.getElementById("usuario").innerHTML =
      `
      <button onclick="login()">
        Entrar com Google
      </button>
      `;
  }
});
```
