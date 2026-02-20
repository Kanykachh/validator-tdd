import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateAge, validatePostalCode, validateName, validateEmail, validateCity, validateForm } from './validator';
import { useUsers } from './UserContext';
import './App.css';

function App() {
  const navigate = useNavigate();
  const { addUser } = useUsers();

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

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    setErrors({ ...errors, [e.target.name]: '' });
    setSuccess(false);
  };

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

  const isFormValid = () => {
    if (Object.values(form).some(val => val.trim() === '')) return false;
    return validateForm(form);
  };

  const handleSubmit = async (e) => {
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccess(false);
      return;
    }

    const result = await addUser(form);

    if (result.success) {
      setSuccess(true);
      setErrors({});
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        city: '',
        postalCode: ''
      });
    } else {
      setErrors({ api: result.error });
      setSuccess(false);
    }
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
            data-cy="firstName"
            value={form.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.firstName && <div className="error" data-cy="error-firstName">{errors.firstName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Nom</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            data-cy="lastName"
            value={form.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.lastName && <div className="error" data-cy="error-lastName">{errors.lastName}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            name="email"
            data-cy="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.email && <div className="error" data-cy="error-email">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">Date de naissance</label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            data-cy="birthDate"
            value={form.birthDate}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.birthDate && <div className="error" data-cy="error-birthDate">{errors.birthDate}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="city">Ville</label>
          <input
            type="text"
            id="city"
            name="city"
            data-cy="city"
            value={form.city}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.city && <div className="error" data-cy="error-city">{errors.city}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">Code postal</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            data-cy="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.postalCode && <div className="error" data-cy="error-postalCode">{errors.postalCode}</div>}
        </div>

        {errors.api && <div className="error" data-cy="error-api">{errors.api}</div>}
        <button type="submit" data-cy="submit" disabled={!isFormValid()}>S'inscrire</button>
      </form>

      {success && (
        <div className="success" role="alert" data-cy="success">
          Inscription enregistrée !
          <br />
          <button onClick={() => navigate('/')} data-cy="link-home">Retour à l'accueil</button>
        </div>
      )}
    </div>
  );
}

export default App;
