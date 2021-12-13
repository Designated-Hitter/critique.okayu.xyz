async function tryUpdateInfo() {
    const token = localStorage.getItem("token");

    const oldPassword = document.querySelector('input[name="old-password"]').value;
    const newPassword = document.querySelector('input[name="password"]').value;
    const newPasswordConfirm = document.querySelector('input[name="password-confirm"]').value;
    const newNickname = document.querySelector('input[name="nickname"]').value;

    if (newPassword !== newPasswordConfirm) {
        alert('새로운 비밀번호가 일치하지 않습니다.');
        return;
    }

    if(newNickname.length > 20) {
        alert('닉네임이 20글자를 초과했습니다.');
        return;
    }

    const result = await axios({
        "method": "POST",
        "url": "https://api.critique.okayu.xyz/user/update",
        "data": {
            "oldPassword": oldPassword,
            "newPassword": newPassword,
            "newNickname": newNickname
        },
        "headers": { "Authorization": token }
    });

    if (result.data.success){
        alert(result.data.message);
        location.href = 'index.html';
    }else {
        alert(result.data.error);
    }

}
