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
  await signInWithPopup(auth, provider);
};

window.logout = async () => {
  await signOut(auth);
};

window.salvar = async () => {

  const valor =
    parseFloat(document.getElementById("valor").value) || 0;

  const percentual =
    parseFloat(document.getElementById("percentual").value) || 0;

  const guardado = valor * percentual / 100;

  const usuario = auth.currentUser;

  await addDoc(collection(db, "depositos"), {
    uid: usuario.uid,
    nome: usuario.displayName,
    valor,
    percentual,
    guardado,
    data: new Date()
  });

  carregar();
};

window.excluir = async (id) => {
  await deleteDoc(doc(db, "depositos", id));
  carregar();
};

async function carregar() {

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

    total += dado.guardado;

    tabela.innerHTML += `
      <tr>
        <td>R$ ${dado.valor.toFixed(2)}</td>
        <td>${dado.percentual}%</td>
        <td>R$ ${dado.guardado.toFixed(2)}</td>
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
}

onAuthStateChanged(auth, (user) => {

  if (user) {

    document.getElementById("usuario").innerHTML =
      `
      <h3>${user.displayName}</h3>
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
