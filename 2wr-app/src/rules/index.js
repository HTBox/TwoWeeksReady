export function required(msg) {
  if (!msg) msg = "Required.";
  return (v) => !!v || msg;
}

export function minLength(len, msg) {
  if (!msg) msg = "Length Required.";
  return (v) => v.length >= len || msg;
}

export function maxLength(len, msg) {
  if (!msg) msg = `Must be less than ${len} characters.`
  return (v) => v.length < len || msg;
}

export function phoneNumber(msg) {
  if (!msg) msg = "Must be a valid phone number. (e.g. (404) 555-1212, 404-555-1212)";
  return  (v) => !v || /^(\([0-9]{3}\)\s?|[0-9]{3}-)[0-9]{3}-[0-9]{4}$/.test(v) || msg;
} 


export function email(msg) {
  if (!msg) msg = "Must be a valid email.";
  return  (v) => !v || /^[^@]+@[^@]+\.[^@]+$/.test(v) || msg;
} 

export function zipCode(msg) {
  if (!msg) msg = "Must be a valid zipcode.";
  return (v) => !v || /^[0-9]{5}(?:-[0-9]{4})?$$/.test(v) || msg;
}
