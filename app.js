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

// LOGIN

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

// SALVAR DEPÓSITO

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

    document.getElementById("valor").value = "";

    carregar();

  } catch (erro) {

    console.error(erro);
    alert("Erro ao salvar: " + erro.message);

  }
};

// EXCLUIR

window.excluir = async (id) => {

  try {

    await deleteDoc(doc(db, "depositos", id));

    carregar();

  } catch (erro) {

    console.error(erro);
    alert("Erro ao excluir: " + erro.message);

  }
};

// META

window.salvarMeta = () => {

  const meta =
    Number(document.getElementById("meta")?.value || 0);

  if (!meta) return;

  localStorage.setItem("metaTrevisol", meta);

  carregar();
};

function atualizarMeta(total) {

  const barra =
    document.getElementById("barra");

  const percentualMeta =
    document.getElementById("percentualMeta");

  if (!barra || !percentualMeta) return;

  const meta =
    Number(localStorage.getItem("metaTrevisol")) || 0;

  if (meta <= 0) {
    barra.style.width = "0%";
    percentualMeta.innerText = "Meta não definida";
    return;
  }

  const percentual =
    Math.min((total / meta) * 100, 100);

  barra.style.width =
    percentual + "%";

  percentualMeta.innerText =
    percentual.toFixed(1) + "% da meta";
}

// CARREGAR DADOS

async function carregar() {

  try {

    const usuario = auth.currentUser;

    if (!usuario) return;

    const tabela =
      document.getElementById("historico");

    tabela.innerHTML = "";

    let total = 0;
    let maior = 0;
    let quantidade = 0;

    const q = query(
      collection(db, "depositos"),
      where("uid", "==", usuario.uid)
    );

    const snap = await getDocs(q);

    snap.forEach((item) => {

      const dado = item.data();

      total += Number(dado.guardado || 0);

      if (Number(dado.guardado || 0) > maior) {
        maior = Number(dado.guardado || 0);
      }

      quantidade++;

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

    document.getElementById("total").innerText =
      "R$ " + total.toFixed(2);

    // DASHBOARD

    const dashTotal =
      document.getElementById("dashTotal");

    const dashMaior =
      document.getElementById("dashMaior");

    const dashQtd =
      document.getElementById("dashQtd");

    const dashMedia =
      document.getElementById("dashMedia");

    if (dashTotal)
      dashTotal.innerText =
        "R$ " + total.toFixed(2);

    if (dashMaior)
      dashMaior.innerText =
        "R$ " + maior.toFixed(2);

    if (dashQtd)
      dashQtd.innerText =
        quantidade;

    if (dashMedia)
      dashMedia.innerText =
        "R$ " +
        (quantidade > 0
          ? total / quantidade
          : 0
        ).toFixed(2);

    atualizarMeta(total);

  } catch (erro) {

    console.error(erro);
    alert("Erro ao carregar: " + erro.message);

  }
}

// LOGIN AUTOMÁTICO

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
