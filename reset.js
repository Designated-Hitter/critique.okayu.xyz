async function tryReset() {
    const newPassword = document.querySelector('input[name="password"]').value;
    const passwordConfirm = document.querySelector('input[name="password-confirm"]').value;
    if (newPassword !== passwordConfirm) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }

    const vCode = new URLSearchParams(location.search).get("code");
    
    const result = await axios({
        method: "POST",
        url: `https://api.critique.okayu.xyz/user/reset?code=${vCode}`,
        data: { newPassword: newPassword }
    })

    if(result.data.success){
        alert(result.data.message);
        location.href = "index.html";
    } else {
        alert(result.data.error);
        return;
    };

}
