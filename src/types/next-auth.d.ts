import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      mustResetPassword: boolean;
    };
  }

  interface User {
    role?: string;
    mustResetPassword?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    mustResetPassword: boolean;
  }
}
