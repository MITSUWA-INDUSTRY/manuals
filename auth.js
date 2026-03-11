if(sessionStorage.getItem("auth") !== "ok"){

    let pass = prompt("パスワードを入力してください");

    if(pass === "2738"){
        sessionStorage.setItem("auth","ok");
    }else{
        alert("パスワードが違います");
        location.href="https://google.com";
    }

}