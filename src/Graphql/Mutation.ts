import gql from 'graphql-tag';

export const CREATE_CUSTOMER_INFORMATION = gql`
  mutation createCustomerInformation(
    $firstName: String!,
    $lastName: String!,
    $birthdate: String!,
    $passwordHash: String!,
    $gender: GenderMutations!,
    $address: String!,
    $email: String!,
    $contactNumber: String!
  ) {
    createCustomerInformation(
      firstName: $firstName,
      lastName: $lastName,
      birthdate: $birthdate,
      passwordHash: $passwordHash,
      gender: $gender,
      address: $address,
      email: $email,
      contactNumber: $contactNumber
    ) {
      firstName
      lastName
      birthdate
      gender
      address
      email
      contactNumber
      passwordHash
    }
  }
`;