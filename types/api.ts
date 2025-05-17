export interface ISignUp {
  name: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IResetPassword {
  token: string;
  password: string;
}

export interface IUpdateProfile {
  token: string;
  name: string;
  email: string;
  mobile: string;
}
