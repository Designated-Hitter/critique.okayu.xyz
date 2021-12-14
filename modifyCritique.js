;(async() => {
    const token = localStorage.getItem("token");
    const decoded = parseJWT(token);
    const verified = decoded.verified;

    if(!token){
        alert("로그인 후 이용할 수 있는 기능입니다.");
        location.href = 'index.html';
    };

    if(!verified) {
        alert('이메일 인증 후 이용할 수 있는 기능입니다.');
        location.href = 'mypage.html';
    };

    const qs = new URLSearchParams(location.search)
   
    const critiqueNo = qs.get("critique_no")
    const result = await axios({
        method: "GET",
        url: `https://api.critique.okayu.xyz/critique/critique_no/${critiqueNo}`
    })
    const bookData = result.data.result;
    
    const cover = document.querySelector('img.cover');
    cover.src = bookData.cover;
    const author = document.querySelector('label.author');
    author.innerHTML = "작가: " + bookData.author;
    const starGrade = document.querySelector('input[name="star-grade"]');
    starGrade.value = bookData.star_grade;
    const comment = document.querySelector('input[name="comment"]');
    comment.value = bookData.comment;
    const critique = document.querySelector('textarea[name="critique"]');
    critique.value = bookData.critique;

    // const drawStar = (target) => {
    //     document.querySelector(`.star span`).style.width = `${target.value * 10}%`;
    // }

})();

async function modifyDocument() {
    const token = localStorage.getItem("token");
    const qs = new URLSearchParams(location.search)
    const critiqueNo = qs.get("critique_no")

    const starGrade = document.querySelector('input[name="star-grade"]').value;
    const comment = document.querySelector('input[name="comment"]').value;
    const critique = document.querySelector('textarea[name="critique"]').value;

    const result = await axios({
        method: "PUT",
        url: "https://api.critique.okayu.xyz/critique/update",
        data: {
            "critiqueNo": critiqueNo,
            "newStarGrade": starGrade,
            "newComment": comment,
            "newCritique": critique
        },
        headers: { "Authorization": token }
    })

    if(!result.data.success){
        alert(result.data.error)
        return;
    }

    alert(result.data.message);
    location.href = `readOneCritique.html?critique_no=${critiqueNo}`;   
}

function parseJWT (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
