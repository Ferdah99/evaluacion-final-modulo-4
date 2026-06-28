class UserManager {
  constructor(url) {
    this._data = [];
    this._load(url);
  }

  _load(url) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = () => {
      if (xhr.status === 200) {
        this._data = JSON.parse(xhr.responseText);
        this._onReady();
      } else {
        this._onError(xhr.status);
      }
    };
    xhr.onerror = () => this._onError('Red');
    xhr.send();
  }

  _onReady() {
    const status = document.getElementById('status');
    status.textContent = `✓ ${this._data.length} usuarios cargados`;
    status.className = 'ready';
    document.querySelectorAll('button').forEach(b => b.disabled = false);
  }

  _onError(code) {
    const status = document.getElementById('status');
    status.textContent = `✗ Error al cargar datos (${code})`;
    status.className = 'error';
  }

  _find(nombre) {
    const q = nombre.trim().toLowerCase();
    return this._data.find(u => u.name.toLowerCase() === q) || null;
  }

  listarNombres() {
    console.group('📋 Nombres de todos los usuarios');
    this._data.forEach((u, i) => console.log(`${i + 1}. ${u.name}`));
    console.groupEnd();
  }

  infoBasica() {
    const nombre = prompt('Nombre del usuario (ej: Leanne Graham):');
    if (!nombre) return;
    const u = this._find(nombre);
    if (!u) { console.warn(`No se encontró el usuario "${nombre}"`); return; }
    console.group(`👤 Info básica — ${u.name}`);
    console.log('Username:', u.username);
    console.log('Email:   ', u.email);
    console.groupEnd();
  }

  direccion() {
    const nombre = prompt('Nombre del usuario:');
    if (!nombre) return;
    const u = this._find(nombre);
    if (!u) { console.warn(`No se encontró el usuario "${nombre}"`); return; }
    const { street, suite, city, zipcode, geo } = u.address;
    console.group(`🏠 Dirección — ${u.name}`);
    console.log('Calle:        ', street);
    console.log('Suite:        ', suite);
    console.log('Ciudad:       ', city);
    console.log('Código postal:', zipcode);
    console.log('Geo — lat:', geo.lat, '| lng:', geo.lng);
    console.groupEnd();
  }

  infoAvanzada() {
    const nombre = prompt('Nombre del usuario:');
    if (!nombre) return;
    const u = this._find(nombre);
    if (!u) { console.warn(`No se encontró el usuario "${nombre}"`); return; }
    const { name: compName, catchPhrase, bs } = u.company;
    console.group(`🔍 Info avanzada — ${u.name}`);
    console.log('Teléfono:  ', u.phone);
    console.log('Sitio web: ', u.website);
    console.group('Compañía');
    console.log('Nombre:      ', compName);
    console.log('Catchphrase: ', catchPhrase);
    console.log('BS:          ', bs);
    console.groupEnd();
    console.groupEnd();
  }

  listarCompanias() {
    console.group('🏢 Compañías y catchphrases');
    this._data.forEach((u, i) => {
      console.log(`${i + 1}. ${u.company.name} — "${u.company.catchPhrase}"`);
    });
    console.groupEnd();
  }

  nombresOrdenados() {
    const ordenados = [...this._data].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    console.group('🔤 Nombres ordenados alfabéticamente');
    ordenados.forEach((u, i) => console.log(`${i + 1}. ${u.name}`));
    console.groupEnd();
  }
}

const manager = new UserManager('https://jsonplaceholder.typicode.com/users');

document.getElementById('btn-nombres').addEventListener('click', () => manager.listarNombres());
document.getElementById('btn-basica').addEventListener('click', () => manager.infoBasica());
document.getElementById('btn-direccion').addEventListener('click', () => manager.direccion());
document.getElementById('btn-avanzada').addEventListener('click', () => manager.infoAvanzada());
document.getElementById('btn-companias').addEventListener('click', () => manager.listarCompanias());
document.getElementById('btn-ordenados').addEventListener('click', () => manager.nombresOrdenados());
