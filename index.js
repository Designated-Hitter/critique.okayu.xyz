;(async() => {
    const token = localStorage.getItem("token");
    if(token) {
        const decoded = parseJWT(token);
        const nickname = decoded.nickname;
        const myPage = document.querySelector('a');
        myPage.innerHTML = nickname + " 님";
    }
    const recentCritique = document.querySelector('div.recent-critique');
    
    const result = await axios({
        "method": "get",
        "url": "https://api.critique.okayu.xyz/critique/recent"  
    })
    const recentList = result.data.result;
    console.log(recentList)

    for(const item of recentList) {
        const article = document.createElement('div');
        const articleNo = item.critique_no;
        article.classList.add(`${articleNo}`);
        
        const cover = item.cover;
        const recentCover = document.createElement('img');
        recentCover.classList.add("cover")
        recentCover.src = cover;

        const nickname = item.nickname;
        const recentNickname = document.createElement('div');
        recentNickname.classList.add('nickname');
        recentNickname.innerText = nickname;

        const starGrade = item.star_grade;
        const recentStarGrade = document.createElement('div');
        recentStarGrade.classList.add('star-grade');
        recentStarGrade.innerhtml = starGrade

        const comment = item.comment;
        const recentComment = document.createElement('div');
        recentComment.classList.add('comment');
        recentComment.innerText = comment;

        article.append(recentCover, recentNickname, recentStarGrade, recentComment)
        recentCritique.append(article)
    }
})();

async function search() {
    const searchword = document.querySelector('input[name="book-search"]').value.trim();
    if(!searchword) {
        alert("검색어를 입력해주세요.");
        return;
    }
    location.href=`search.html?keyword=${searchword}`;
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
        "url": "https://api.critique.okayu.xyz/user/login",
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