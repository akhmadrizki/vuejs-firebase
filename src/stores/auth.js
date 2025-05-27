import { ref } from "vue";

const STATIC_CREDENTIAL = {
    username: 'admin',
    password: 'rahasia',
}

const isAuthenticated = ref(false);
const currentUser = ref(null);

// pake locasl storage untuk simpen data login user
const checkAuthStatus = () => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('currentUser');

    if (savedAuth === 'true' && savedUser) {
        isAuthenticated.value = true;
        currentUser.value = JSON.parse(savedUser);
    }
};

// fngsi login
const login = (username, password) => {
    if (username === STATIC_CREDENTIAL.username && password === STATIC_CREDENTIAL.password) {
        isAuthenticated.value = true;
        currentUser.value = {username};

        // save local storage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('currentUser', JSON.stringify({ username }));

        return { success: true };
    } else {
        return { success: false, message: 'Username / Password Salah' };
    }
};

// fungsi logout
const logout = () => {
    isAuthenticated.value = false;
    currentUser.value = null;

    // hapus data dari local storage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
};

checkAuthStatus();

export {
    isAuthenticated,
    currentUser,
    login,
    logout
};