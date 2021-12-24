;(async() => {
    const token = localStorage.getItem("token");
    const decoded = parseJWT(token);
    const verified = decoded.verified;

    if(!token){
        alert("로그인 후 이용할 수 있는 기능입니다.");
        location.href = 'index.html';
        return;
    };

    if(!verified) {
        alert('이메일 인증 후 이용할 수 있는 기능입니다.');
        location.href = `myPage.html`;
        return;
    };

    const qs = new URLSearchParams(location.search)
    const authorData = qs.get("author");
    const coverAddress = qs.get("cover");
    
    const cover = document.querySelector('img.cover');
    cover.src = coverAddress;
    const author = document.querySelector('label.author');
    author.innerHTML = "작가: " + authorData;
    // const drawStar = (target) => {
    //     document.querySelector(`.star span`).style.width = `${target.value * 10}%`;
    // }

})();

async function writeDocument() {
    const token = localStorage.getItem("token");
    const qs = new URLSearchParams(location.search)
    const itemId = qs.get("itemId");

    const starGrade = document.querySelector('input[name="star-grade"]').value;
    const comment = document.querySelector('input[name="comment"]').value;
    const critique = document.querySelector('textarea[name="critique"]').value;

    const result = await axios({
        method: "POST",
        url: "https://api.critique.okayu.xyz/critique/write",
        data: {
            "bookId": itemId,
            "starGrade": starGrade,
            "comment": comment,
            "critique": critique
        },
        headers: { "Authorization": token }
    })

    if(result.data.error){
        alert(result.data.error)
        return;
    }

    alert(result.data.message);
    location.href = `readOneCritique.html?critique_no=${result.data.critique_no}`;   
}

function parseJWT (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
