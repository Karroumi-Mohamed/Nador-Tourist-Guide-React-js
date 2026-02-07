import * as yup from 'yup';

export const placeSchema = yup.object({
  name: yup.string().required('Le nom est obligatoire').min(3, 'Minimum 3 caractères'),
  category: yup.string().required('La catégorie est obligatoire'),
  description: yup.string().required('La description est obligatoire').min(10, 'Minimum 10 caractères'),
  address: yup.string(),
  image: yup.string().url('URL invalide').required('Au moins une photo est obligatoire'),
  images: yup.array().of(yup.string().url('URL invalide')),
  hours: yup.string(),
  price: yup.string(),
  transport: yup.string(),
});

export const loginSchema = yup.object({
  username: yup.string().required('Le nom d\'utilisateur est obligatoire'),
  password: yup.string().required('Le mot de passe est obligatoire').min(4, 'Minimum 4 caractères'),
});
