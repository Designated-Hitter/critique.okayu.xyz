;(async() => {
    const token = localStorage.getItem("token");
    if(token) {
        const decoded = parseJWT(token);
        const nickname = decoded.nickname;
        const myPage = document.querySelector('a.myPage');
        myPage.innerHTML = nickname + " 님";
        const loginBox = document.querySelector('div.login-box');
        loginBox.style.display = "none";
        const myPageBox = document.querySelector('div.my-page');
        myPageBox.style.display = "";
    }
    const recentCritique = document.querySelector('div.recent-critique');
    
    const result = await axios({
        "method": "get",
        "url": "https://api.critique.okayu.xyz/critique/recent"  
    })
    const recentList = result.data.result;

    for(const item of recentList) {
        const a = document.createElement('a');
        a.classList.add('to-critique')
        a.href = `readOneCritique.html?critique_no=${item.critique_no}`
        const article = document.createElement('div');
        const articleNo = item.critique_no;
        article.id = `${articleNo}`
        article.classList.add(`recent-article`);
        
        const imgBox = document.createElement('div');
        imgBox.classList.add('imgBox');
        const cover = item.cover;
        const recentCover = document.createElement('img');
        recentCover.classList.add("cover")
        recentCover.src = cover;
        imgBox.append(recentCover)

        const nickname = item.nickname;
        const recentNickname = document.createElement('div');
        recentNickname.classList.add('nickname');
        recentNickname.innerText = nickname + " 님";

        const starGrade = item.star_grade;
        const recentStarGrade = document.createElement('div');
        recentStarGrade.classList.add('star-grade');
        recentStarGrade.innerhtml = starGrade

        const comment = item.comment;
        const recentComment = document.createElement('div');
        recentComment.classList.add('comment');
        recentComment.innerText = comment;

        article.append(imgBox, recentNickname, recentStarGrade, recentComment)
        a.append(article)
        recentCritique.append(a)
    }
})();

async function search() {
    const searchword = document.querySelector('input#book-search').value.trim();
    if(!searchword) {
        alert("검색어를 입력해주세요.");
        return;
    }
    location.href=`search.html?keyword=${searchword}`;
}

function parseJWT (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


async function tryJoin() {
    location.href = 'join.html';
}

async function tryLogin() {
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const result = await axios({
        "method": "POST",
        "url": "https://api.critique.okayu.xyz/user/login",
        "data": {
            "email": email,
            "password": password
        }
    });

    if (result.data.success){
        const token = result.data.token;
        localStorage.setItem("token", token);
        location.reload();
    } else {
        alert(result.data.error);
    }
}

async function tryLogout() {
    localStorage.removeItem("token")
    location.href = "index.html"
}

async function myPage() {
    location.href = `myPage.html`
}

async function updateInfo() {
    location.href = "personalInfo.html"
}

async function iForgot() {
    location.href = "forgot.html"
}

async function enterkeyLogin() {
	if (window.event.keyCode == 13) {
    	tryLogin()
    }
}

async function enterkeySearch() {
    if (window.event.keyCode == 13) {
    	search()
    }
}