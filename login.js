let incorrectCont, errorCont;

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(name, path, domain) {
    if (getCookie(name)) {
        document.cookie = name + "=" + ((path) ? ";path="+path:"") + ((domain)?";domain="+domain:"") + ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}

function login(username, password) {
    axios({method: 'post', url: '/api/login.php', data: {username, password}, timeout: 3_000}).then(response => {
        /*
		if (response.status === 200) {
			location.reload();
		} else {
            incorrectCont.classList.remove(hiddenClass);
            errorCont.classList.add(hiddenClass);
			console.error("LOGIN REQUEST STATUS " + response.status);
		}
        */
        location.reload();
	}).catch(error => {
        /*
        incorrectCont.classList.add(hiddenClass);
        errorCont.classList.remove(hiddenClass);
		console.error("LOGIN ERROR");
		console.log(error);
        */
       location.reload();
	});
}

function load_login() {
    const body = document.getElementById('body');
    const usrTxt = document.getElementById('username-input');
    const pwdTxt = document.getElementById('password-input');
    const loginBtn = document.getElementById('login-button');
    const loginModal = new bootstrap.Modal('#login-modal', {
        backdrop: false,
        focus: true,
        keyboard: false
    });
    incorrectCont = document.getElementById('login-incorrect-container');
    errorCont = document.getElementById('login-error-container');
    loginBtn.addEventListener('click', () => {
        const username = usrTxt.value;
        const password = pwdTxt.value;
        if (username && password && username.length > 0 && password.length > 0) {
            pwdTxt.value = '';
            login(username, password);
        }
    });
    body.classList.add('bg-dark');
    loginModal.show();
}

function load() {
    const bodyMain = document.getElementById('body-main');
    const bodyLogin = document.getElementById('body-login');
    if (getCookie('PHPSESSID') != '') {
        bodyMain.classList.remove(hiddenClass);
        const logoutBtn = document.getElementById('btn-logout');
        logoutBtn.addEventListener('click', () => {
            deleteCookie('PHPSESSID');
            location.reload();
        });
        load_main();
    } else {
        bodyLogin.classList.remove(hiddenClass);
        load_login();
    }
}

document.addEventListener('DOMContentLoaded', load);