export const getShortPlayerName = (name) => {
  const [firstName, lastName] = name.split(' ')
  return `${firstName.charAt(0).toUpperCase()}. ${lastName}`
}
