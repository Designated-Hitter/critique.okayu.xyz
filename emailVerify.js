;(async () => {
    const vCode = new URLSearchParams(location.search).get("code");
    const result = await axios({
        method: "POST",
        url: `https://api.critique.okayu.xyz/user/verify?code=${vCode}`
    })

    if(result.data.success){
        alert(result.data.message);
        location.href = "index.html";
    } else {
        alert(result.data.error);
        return;
        
    };

    
})();