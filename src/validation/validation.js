 const validation = async (req, res, next) => {
  const { firstName, lastName, email, password, age, gender, skills} = req.body;

  // 1️⃣ Required fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).send("Please fill all the required fields");
  }

  // 2️⃣ Name length
  if (firstName.length < 3 || lastName.length < 3) {
    return res.status(400).send("First name and Last name should be at least 3 characters long");
  }

  // 3️⃣ Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).send("Please provide a valid email address");
  }

  // 4️⃣ Password validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).send("Password must be at least 6 characters long and contain at least one letter and one number");
  }

  // 5️⃣ Age validation
  if (age < 18 || age > 100) {
    return res.status(400).send("Age should be between 18 and 100");
  }

  // 6️⃣ Gender validation
  const validGenders = ["male", "female", "other"];
  if (!validGenders.includes(gender)) {
    return res.status(400).send("Gender should be male, female, or other");
  }

  // 7️⃣ Skills validation
  if (!Array.isArray(skills) || skills.length < 5) {
    return res.status(400).send("Please provide at least 5 skills");
  }

  // If all validations pass
  next();
};
 const editValidations = async (req, res, next) => {
  // Allowed fields
  const allowedToEdit = ["firstName", "lastName", "age", "skills", "about"];
console.log(allowedToEdit)
  // Get incoming fields
  const incomingFields = Object.keys(req.body);
console.log(incomingFields)
  // Check if all incoming fields are allowed
  const isValid = incomingFields.every((field) =>
    allowedToEdit.includes(field)
  );

  if (!isValid) {
    return res.status(400).send("You are not allowed to edit these fields");
  }

  next();
}
module.exports = {
  validation,
  editValidations
};
