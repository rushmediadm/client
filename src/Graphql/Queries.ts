import { gql } from "@apollo/client";

export const GET_ALL_CUSTOMER_INFORMATIONS = gql`
  query getAllCustomerInformations {
    getAllCustomerInformations {
        id
        firstName
        lastName
        birthdate
        gender
        address
        email
        contactNumber
        passwordHash
        qrCodePath
    }
  }
`;