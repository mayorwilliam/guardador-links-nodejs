const bcrypt = require('bcryptjs')


const helpers = {}

helpers.encryptPasswords = async (password) => {
      const salt = await bcrypt.genSalt(10) // 10 es el número que se ejecuta el codigo, entre más veces pongas más seguro el cifrado de la contraseña pero también tarda más
      const hash = await bcrypt.hash(password,salt)
      return hash
}

helpers.matchPassword = async (password, savedPassword) => {
  try {
      return await bcrypt.compare(password,savedPassword)
  } catch (e) {
    console.log(e)
  }
}


module.exports = helpers