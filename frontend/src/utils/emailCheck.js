const { constants } = global;
const { emailReg } = constants;
export default function(str) {
  if (!emailReg) return true;
  const reg = new RegExp(emailReg, "gi");
  return reg.test((str || "").toLowerCase());
}
