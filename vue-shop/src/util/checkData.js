function checkEmail (rule, value, callback) {
  const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
  if (reg.test(value)) {
    callback()
  } else if (value !== '') {
    callback(new Error('请输入正确的邮箱格式!'))
  }
  callback()
}

function checkPhone (rule, value, callback) {
  const reg = /^(0|86|17951)?(13[0-9]|14[056789]|15[012356789]|16[6]|17[345678]|18[0-9]|19[89])[0-9]{8}$/
  if (reg.test(value)) {
    callback()
  } else if (value !== '' && value !== null) {
    callback(new Error('请输入正确的手机号!'))
  }
  callback()
}

export default {
  checkEmail,
  checkPhone
}
