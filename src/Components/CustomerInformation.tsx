import './CustomerInformation.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CREATE_CUSTOMER_INFORMATION } from '../Graphql/Mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { GET_ALL_CUSTOMER_INFORMATIONS } from '../Graphql/Queries';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
  Other = 'OTHER',
}

interface CreateCustomerInformationInput {
  firstName: string;
  lastName: string;
  passwordHash: string;
  birthdate: string;
  gender: Gender;
  address: string;
  email: string;
  contactNumber: string;
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  passwordHash: Yup.string().required('Password is required'),
  birthdate: Yup.date().required('Birth Date is required'),
  gender: Yup.string().required('Gender is required').oneOf(Object.values(Gender), 'Invalid Gender'),
  address: Yup.string().required('Address is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  contactNumber: Yup.string().matches(/^[0-9]+$/, 'Invalid Contact Number')
    .required('Contact Number is required'),
});

function CustomerInformation() {
  const [createCustomerInformation] = useMutation(CREATE_CUSTOMER_INFORMATION);
  const { data, refetch } = useQuery(GET_ALL_CUSTOMER_INFORMATIONS);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [qrCodeLoc, setQrCodeLoc] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [popup, setPopup] = useState<boolean>(false);

  useEffect(() => {
    if (submitted && data) {
        const { getAllCustomerInformations } = data;
        if (getAllCustomerInformations.length > 0) {
            setQrCodeLoc(getAllCustomerInformations[getAllCustomerInformations.length - 1].qrCodePath);
            setShowQR(true);
        }
    }
  }, [submitted, data]);

  const formik = useFormik<CreateCustomerInformationInput>({
    initialValues: {
      firstName: '',
      lastName: '',
      passwordHash: '',
      birthdate: '',
      gender: Gender.Male,
      address: '',
      email: '',
      contactNumber: '',
    },
    validationSchema,
    onSubmit: async (values) => {
        try {
            const response = await createCustomerInformation({
                variables: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    passwordHash: values.passwordHash,
                    birthdate: values.birthdate,
                    gender: values.gender,
                    address: values.address,
                    email: values.email,
                    contactNumber: values.contactNumber,
                },
            });
            if (response.errors) {
                handleGraphQLErrors(Array.from(response.errors), setErrorMessage);
                setPopup(!popup);
            } else {
                console.log('Form submitted successfully');
                refetch();
                setSubmitted(true);
                setPopup(!popup);
            }
        } catch (error) {
            if (isError(error as Error)) {
              console.log((error as Error).message);
              setPopup(!popup);
              setErrorMessage((error as Error).message);
            } else {
                console.log(error);
                setPopup(!popup);
                setErrorMessage(error as SetStateAction<string>);
            }
        }
    },
    
  });

  const { values, handleChange, handleSubmit, errors, touched } = formik;

  return (<>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ flexBasis: '48%', marginRight: '2%' }}>
        <h2 style={{ textAlign: 'center' }}>Customer Information</h2>
        <form className="createUser" onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '10px auto', padding: '20px 40px 20px 20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <input
            type="text"
            placeholder="First Name"
            onChange={handleChange('firstName')}
            value={values.firstName}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', border: touched.firstName && errors.firstName ? '1px solid red' : '' }}
          />
          {touched.firstName && errors.firstName && <div style= {{ padding: '0 0 5px 0', color: 'red' }} >{errors.firstName}</div>}

          <input
            type="text"
            placeholder="Last Name"
            onChange={handleChange('lastName')}
            value={values.lastName}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', border: touched.lastName && errors.lastName ? '1px solid red' : '' }}
          />
          {touched.lastName && errors.lastName && <div style= {{ padding: '0 0 5px 0', color: 'red' }}>{errors.lastName}</div>}

          <input
            type="password"
            placeholder="Password"
            onChange={handleChange('passwordHash')}
            value={values.passwordHash}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', border: touched.passwordHash && errors.passwordHash ? '1px solid red' : '' }}
          />
          {touched.passwordHash && errors.passwordHash && <div style= {{ padding: '0 0 5px 0', color: 'red' }}>{errors.passwordHash}</div>}

          <input
            type="date"
            placeholder="Birth Date"
            onChange={handleChange('birthdate')}
            value={values.birthdate}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', border: touched.birthdate && errors.birthdate ? '1px solid red' : '' }}
          />
          {touched.birthdate && errors.birthdate && <div style= {{ padding: '0 0 5px 0', color: 'red' }}>{errors.birthdate}</div>}

          <select
            onChange={handleChange('gender')}
            value={values.gender}
            style={{ marginBottom: '10px', padding: '8px', width: '100%' }}>
            <option value="" disabled>Select Gender</option>
            <option value={Gender.Male}>Male</option>
            <option value={Gender.Female}>Female</option>
            <option value={Gender.Other}>Other</option>
            </select>
          <input
            type="text"
            placeholder="Address"
            onChange={handleChange('address')}
            value={values.address}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', border: touched.address && errors.address ? '1px solid red' : '' }}
          />
          {touched.address && errors.address && <div style= {{ padding: '0 0 5px 0', color: 'red' }}>{errors.address}</div>}

          <input
            type="email"
            placeholder="Email"
            onChange={handleChange('email')}
            value={values.email}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', border: touched.email && errors.email ? '1px solid red' : '' }}
          />
          {touched.email && errors.email && <div style= {{ padding: '0 0 5px 0', color: 'red' }}>{errors.email}</div>}

          <input
            type="text"
            placeholder="Contact Number"
            onChange={handleChange('contactNumber')}
            value={values.contactNumber}
            style={{ marginBottom: '10px', padding: '8px', width: '100%', border: touched.contactNumber && errors.contactNumber ? '1px solid red' : '' }}
          />
          {touched.contactNumber && errors.contactNumber && <div style= {{ padding: '0 0 5px 0', color: 'red' }}>{errors.contactNumber}</div>}

          <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px', borderRadius: '4px', cursor: 'pointer', width: '105%' }}>Create Customer Information</button>
        </form>
      </div>
      <div style={{ flexBasis: '48%' }}>
      <h2 style={{ textAlign: 'center' }}>QR Code</h2>
        {showQR && (
          <div style={{ display: 'block', textAlign: 'center' }}>
            <img style={{ margin: '10px auto', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', maxWidth: '100%', height: 'auto' }} src={`http://localhost:3001/${qrCodeLoc}`} alt="QR Code" />
          </div>
        )}
      </div>
      {
        popup && <div className={ errorMessage === '' ? 'success-popup' : 'error-popup'}>
          <p>{errorMessage !== '' ? errorMessage : 'Create Successfully'}</p>
          <button onClick={() => setPopup(!popup)}>Close</button>
        </div>
      }
    </div>
  </>);
}

function isError(obj: Object): obj is Error {
    return obj instanceof Error;
}

function handleGraphQLErrors(errors: GraphQLError[], setErrorMessage: Dispatch<SetStateAction<string>>) {
  const errorMessage = errors.map(error => error.message).join(', ');
  setErrorMessage(errorMessage);
  console.log('GraphQL Errors:', errors);
}

export default CustomerInformation;
