function isValidEmail(mail) {
  return /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
}

const validateEmail = (correo, setIsEmailValid) => {
  if (correo === "") {
    setIsEmailValid(true);
  } else {
    setIsEmailValid(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(correo));

  }
};

export {
  isValidEmail,
  validateEmail
}