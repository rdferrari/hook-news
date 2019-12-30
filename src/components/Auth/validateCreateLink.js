export default function validateCreateLink(values) {
  let errors = {};

  if (!values.description) {
    errors.email = "Description required!";
  } else if (values.description.length < 10) {
    errors.description = "Description must have more than 10 characters";
  }

  if (!values.url) {
    errors.url = "Url required!";
  } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(values.url)) {
    errors.url = "URL must be valid";
  }

  return errors;
}
