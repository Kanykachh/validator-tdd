import { useState } from 'react';
import { validateAge, validatePostalCode, validateName, validateEmail, validateCity, validateForm } from './validator';
import './App.css';

function App() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    city: '',
    postalCode: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  // met a jour le champ qui change
  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    // on enleve l'erreur du champ quand l'user tape
    setErrors({ ...errors, [e.target.name]: '' });
    setSuccess(false);
  };

  // validation quand on quitte un champ (blur)
  const validators = {
    firstName: validateName,
    lastName: validateName,
    email: validateEmail,
    birthDate: validateAge,
    city: validateCity,
    postalCode: validatePostalCode
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const validate = validators[name];
    if (!validate) return;

    const result = validate(value);
    if (!result.valid) {
      setErrors({ ...errors, [name]: result.error });
    }
  };

  // verifie si le formulaire est valide pour activer le bouton
  const isFormValid = () => {
    // si un champ est vide c'est pas bon
    if (Object.values(form).some(val => val.trim() === '')) return false;
    // on verifie tout avec validateForm
    return validateForm(form);
  };

  // validation et sauvegarde
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    const firstNameCheck = validateName(form.firstName);
    if (!firstNameCheck.valid) newErrors.firstName = firstNameCheck.error;

    const lastNameCheck = validateName(form.lastName);
    if (!lastNameCheck.valid) newErrors.lastName = lastNameCheck.error;

    const emailCheck = validateEmail(form.email);
    if (!emailCheck.valid) newErrors.email = emailCheck.error;

    const ageCheck = validateAge(form.birthDate);
    if (!ageCheck.valid) newErrors.birthDate = ageCheck.error;

    const cityCheck = validateCity(form.city);
    if (!cityCheck.valid) newErrors.city = cityCheck.error;

    const postalCheck = validatePostalCode(form.postalCode);
    if (!postalCheck.valid) newErrors.postalCode = postalCheck.error;

    // si y'a des erreurs on les affiche et on arrete
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
      return;
    }

    // tout est bon, on sauvegarde dans le localStorage
    localStorage.setItem('userData', JSON.stringify(form));
    setSuccess(true);
    setErrors({});
    // on vide le formulaire
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      birthDate: '',
      city: '',
      postalCode: ''
    });
  };

  return (
    <div className="App">
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.firstName && <div className="error">{errors.firstName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.lastName && <div className="error">{errors.lastName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">Date de naissance</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.birthDate && <div className="error">{errors.birthDate}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="city">Ville</label>
          <input
            type="text"
            id="city"
            name="city"
            value={form.city}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.city && <div className="error">{errors.city}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">Code postal</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.postalCode && <div className="error">{errors.postalCode}</div>}
        </div>

        <button type="submit" disabled={!isFormValid()}>S'inscrire</button>
      </form>

      {success && <div className="success" role="alert">Inscription enregistrée !</div>}
    </div>
  );
}

export default App;
