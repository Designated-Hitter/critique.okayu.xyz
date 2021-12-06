async function tryJoin() {
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const passwordConfirm = document.querySelector('input[name="password-confirm"]').value;
    const nickname = document.querySelector('input[name="nickname"]').value;

    if (!email|| !password || !nickname) {
        alert('항목을 빠짐없이 입력해주십시오.');
        return;
    }

    if (password !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    if(nickname.length > 20) {
        alert('닉네임이 20글자를 초과했습니다.');
        return;
    }

    const result = await axios({
        "method": "POST",
        "url": "https://api.critique.okayu.xyz/user/join",
        "data": {
            "email": email,
            "password": password,
            "nickname": nickname
        }
    });

    if (result.data.success){
        alert(result.data.message);
        location.href = 'login.html';
    }else {
        alert(result.data.error);
    }

}
