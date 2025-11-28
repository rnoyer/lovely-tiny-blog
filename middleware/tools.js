export function unicID() {
  let id=""
  const char = 'abcdefghijklmnopqrstuvwxyz0123456789'
  for (let index = 0; index < 8; index++) {
    const randomNumber = Math.floor(Math.random() * char.length)
    const randomChar = char[randomNumber]
    id = id.concat(randomChar)
  }
  return id
}

export function dateStamp() {
    const date = new Date()
    const formattedDate = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    return formattedDate
}

export function stringToArray(content) {
  const re = /[\r\n]/;
  const rawSplit = content.split(re)
  const stringArray = rawSplit.filter((string) => string !== "")
  return stringArray
}

export function concatArray(array){
  const content = array.join("\n")
  return content
}