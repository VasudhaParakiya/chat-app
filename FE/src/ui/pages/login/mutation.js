import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation LoginUser($input: loginUserInput) {
    loginUser(input: $input) {
      token
    }
  }
`;

export const SIGNUP = gql`
  mutation Mutation($input: createUserInput) {
    createUser(input: $input) {
      _id
      firstName
      lastName
      email
      password
      gender
      createdAt
      updatedAt
    }
  }
`;

export const GENERATE_QRCODE = gql`
  mutation GenerateTwoFASecret($email: String) {
    generateTwoFASecret(email: $email) {
      secret
      qrCode
    }
  }
`;

export const VERIFY_TWOFA = gql`
  mutation VerifyTwoFA($secretKey: String, $code: String, $email: String) {
    verifyTwoFA(secretKey: $secretKey, code: $code, email: $email) {
      token
    }
  }
`;
