// auth-core.js — único cerebro de autenticación (Google + Email/Password + Firestore)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = window.firebaseConfig;
if (!firebaseConfig) throw new Error("Falta window.firebaseConfig antes de importar auth-core.js");

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

async function upsertUser(user, extra = {}) {
  const ref = doc(db, "users", user.uid);
  const base = {
    uid: user.uid,
    name: user.displayName || extra.name || "Usuario",
    email: user.email || extra.email || "",
    photoURL: user.photoURL || "",
    provider: user.providerData?.[0]?.providerId || "unknown",
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, { ...base, ...extra }, { merge: true });
}

function setLocalPerfil(user) {
  const perfil = {
    uid: user.uid,
    name: user.displayName || "Usuario",
    email: user.email || "",
    photoURL: user.photoURL || "",
    lastLogin: Date.now(),
  };
  localStorage.setItem("argenville_user", JSON.stringify(perfil));
  return perfil;
}

function clearLocalPerfil() {
  localStorage.removeItem("argenville_user");
}

function q(id) { return id ? document.getElementById(id) : null; }

export const Auth = {
  async googleLogin() {
    const res = await signInWithPopup(auth, provider);
    await upsertUser(res.user);
    return res.user;
  },
  async logout() {
    await signOut(auth);
    clearLocalPerfil();
  },
  onState(cb) {
    return onAuthStateChanged(auth, cb);
  },

  bindHeaderGoogle(opts) {
    const btnGoogleLogin = q(opts.btnGoogleLoginId);
    const btnMiCuenta = q(opts.btnMiCuentaId);
    const btnLogout = q(opts.btnLogoutId);
    const userChip = q(opts.userChipId);
    const userName = q(opts.userNameId);
    const userPhoto = q(opts.userPhotoId);

    function showOut() {
      btnGoogleLogin?.classList.remove("hidden");
      btnMiCuenta?.classList.add("hidden");
      btnLogout?.classList.add("hidden");
      userChip?.classList.add("hidden");
    }
    function showIn(user) {
      const perfil = setLocalPerfil(user);
      btnGoogleLogin?.classList.add("hidden");
      btnMiCuenta?.classList.remove("hidden");
      btnLogout?.classList.remove("hidden");
      userChip?.classList.remove("hidden");
      if (userName) userName.textContent = perfil.name;
      if (userPhoto) userPhoto.src = perfil.photoURL || "./img/logo-argenville.png";
      if (btnMiCuenta && opts.miCuentaHref) btnMiCuenta.setAttribute("href", opts.miCuentaHref);
    }

    btnGoogleLogin?.addEventListener("click", async () => {
      try { await Auth.googleLogin(); }
      catch (e) {
        console.error(e);
        alert("No se pudo iniciar sesión con Google. Revisá pop-ups bloqueados y volvé a intentar.");
      }
    });

    btnLogout?.addEventListener("click", async () => {
      try { await Auth.logout(); }
      catch (e) {
        console.error(e);
        alert("No se pudo cerrar sesión. Probá de nuevo.");
      }
    });

    Auth.onState((user) => {
      if (user) showIn(user);
      else showOut();
    });

    showOut();
  },

  bindCuentaPage(opts) {
    const loginForm = q(opts.loginFormId);
    const altaForm  = q(opts.altaFormId);
    const btnReset  = q(opts.resetBtnId);

    const loginEmail = q(opts.loginEmailId);
    const loginPass  = q(opts.loginPassId);

    const altaNombre = q(opts.altaNombreId);
    const altaWhatsapp = q(opts.altaWhatsappId);
    const altaEmail = q(opts.altaEmailId);
    const altaPais = q(opts.altaPaisId);
    const altaPerfil = q(opts.altaPerfilId);
    const altaMarca = q(opts.altaMarcaId);
    const altaWeb = q(opts.altaWebId);
    const altaPass = q(opts.altaPassId);
    const altaPass2 = q(opts.altaPass2Id);
    const altaMensaje = q(opts.altaMensajeId);
    const altaTerms = q(opts.altaTermsId);

    loginForm?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = (loginEmail?.value || "").trim();
      const pass  = (loginPass?.value || "").trim();
      if (!email || !pass) return alert("Completá email y contraseña.");

      try {
        const res = await signInWithEmailAndPassword(auth, email, pass);
        await upsertUser(res.user);
        alert("✅ Sesión iniciada. Bienvenido/a.");
      } catch (err) {
        console.error(err);
        alert("❌ No pudimos iniciar sesión. Revisá email/clave o recuperá contraseña.");
      }
    });

    btnReset?.addEventListener("click", async () => {
      const email = (loginEmail?.value || "").trim();
      if (!email) return alert("Escribí tu email arriba y tocá de nuevo.");
      try {
        await sendPasswordResetEmail(auth, email);
        alert("✅ Listo. Te mandé un mail para resetear contraseña.");
      } catch (err) {
        console.error(err);
        alert("❌ No se pudo enviar el mail. Revisá el email o configuración de Firebase.");
      }
    });

    altaForm?.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (altaTerms && !altaTerms.checked) {
        return alert("Tenés que aceptar Términos y Privacidad para continuar.");
      }

      const email = (altaEmail?.value || "").trim();
      const p1 = (altaPass?.value || "").trim();
      const p2 = (altaPass2?.value || "").trim();
      if (!email || !p1) return alert("Completá email y contraseña.");
      if (p1.length < 8) return alert("La contraseña debe tener mínimo 8 caracteres.");
      if (p1 !== p2) return alert("Las contraseñas no coinciden.");

      try {
        const res = await createUserWithEmailAndPassword(auth, email, p1);

        const displayName = (altaNombre?.value || "").trim() || "Usuario";
        await updateProfile(res.user, { displayName });

        const extra = {
          name: displayName,
          email,
          whatsapp: (altaWhatsapp?.value || "").trim(),
          location: (altaPais?.value || "").trim(),
          perfil: (altaPerfil?.value || "").trim(),
          marca: (altaMarca?.value || "").trim(),
          web: (altaWeb?.value || "").trim(),
          mensaje: (altaMensaje?.value || "").trim(),
          termsAcceptedAt: serverTimestamp(),
          status: "lead"
        };

        await upsertUser(res.user, extra);

        alert("✅ Alta enviada. Te vamos a contactar para el onboarding.");
      } catch (err) {
        console.error(err);
        alert("❌ No se pudo crear la cuenta. Capaz ese email ya existe.");
      }
    });

    Auth.onState((user) => {
      if (user) setLocalPerfil(user);
    });
  }
};
