;(() => {
    const token = localStorage.getItem(token)
    if(token) {
        const decoded = parseJWT(token);
        const nickname = decoded.nickname;
        const myPage = document.querySelector('a');
        myPage.innerHTML = nickname + " 님";
    }
    
});

async function search(keyword) {
    const keyword = document.querySelector('input[name="book-search"]').value;
    if(!keyword.trim) {
        alert("검색어를 입력해주세요.");
        return;
    }
    location.href=`search.html?keyword=${keyword}`;
}

function parseJWT (token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch(e) {
        return null;
    }
}

async function tryJoin() {
    location.href = 'join.html';
}

async function tryLogin() {
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const result = await axios({
        "method": "POST",
        "url": "https://api.chat.okayu.xyz/user/login",
        "data": {
            "email": email,
            "password": password
        }
    });

    if (result.data.success){
        document.getElementById('login-box').style.display="none"
        document.getElementById('my-page').style.display=""
        location.reload();
    } else {
        alert(result.data.error);
    }
}

async function myPage() {
    location.href="myPage.html"
}

async function updateInfo() {
    location.href="personalInfo.html"
}

async function iForgot() {
    location.href="forgot.html"
}

async function enterkey() {
	if (window.event.keyCode == 13) {
    	tryLogin()
    }
}