// helpers/formValidation.js

const { validate } = require('rut.js');
const validator = require("validator");
//validar que un campo no este vacio y su largo sea mayor a 3

const validarCampos = (parametros) => {
  let validarTelefono = !validator.isEmpty(parametros.telefono) && validator.isLength(parametros.telefono, { min: 9, max: 13 });
  let validarRut = validate(parametros.rut);
  let validarDireccion = !validator.isEmpty(parametros.direccion) && validator.isLength(parametros.direccion, { min: 2, max: 30 });
  let validarCiudad = !validator.isEmpty(parametros.ciudad) && validator.isLength(parametros.ciudad, { min: 2, max: 30 });
  let validarComuna = !validator.isEmpty(parametros.comuna) && validator.isLength(parametros.comuna, { min: 2, max: 30 });
  let validarRegion = !validator.isEmpty(parametros.region) && validator.isLength(parametros.region, { min: 2, max: 30 });
  let validarNombre = !validator.isEmpty(parametros.nombreCompleto) && validator.isLength(parametros.nombreCompleto, { min: 2, max: 50 });
  //console.log(validarRut)
  if (validarTelefono === false || validarRut === false || validarDireccion === false || validarCiudad === false || validarComuna === false || validarRegion === false || validarNombre === false) {
   return 'campos no valido';
  }
  return null;
}

const validarNombre = (nombreCompleto) =>{

  const validarNombre = !validator.isEmpty(nombreCompleto) && validator.isLength(nombreCompleto, {min: 3, max: 50});

  if (validarNombre === false) {
    return 'nombre incorrecto'
  }
  return null;

}


// Validar el formato del RUT (ejemplo básico)
const validarRut = (rut) => {
  // Implementa la lógica de validación del RUT
  // Devuelve un mensaje de error si no es válido
  // De lo contrario, retorna null
  const validarRut = validate(rut);
  if (validarRut === false) {
    return 'rut invalido'
  }

  return null

};

// Validar el formato del teléfono (ejemplo básico)
const validarTelefono = (telefono) => {
  // Implementa la lógica de validación del teléfono
  // Devuelve un mensaje de error si no es válido
  // De lo contrario, retorna null
  const telefonoRegex = /^[+]?[0-9]+$/;

  if (!validator.isEmpty(telefono) && validator.isLength(telefono, { min: 9, max: 12 }) && telefonoRegex.test(telefono)) {
    return null; // El número de teléfono es válido
  } else {
    return false;
  }
};

export {
  validarCampos,
  validarNombre,
  validarRut,
  validarTelefono,
  // ... otras funciones de validación ...
};