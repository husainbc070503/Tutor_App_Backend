const { z } = require('zod');

const Register = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .trim(),

    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email address" }),

    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be atleast 8 characters long!" })
        .refine((value) => /[a-z]/.test(value), { message: 'Password must contain atleast one lowercase alphabet.' })
        .refine((value) => /[A-Z]/.test(value), { message: 'Password must contain atleast one uppercase alphabet.' })
        .refine((value) => /[0-9]/.test(value), { message: 'Password must contain atleast one digit.' })
        .refine((value) => /[^a-zA-Z0-9]/.test(value), { message: 'Password must contain atleast one special character.' }),

    avatar: z
        .string({ required_error: "Profile picture is required" })
        .trim(),

    role: z
        .string({ required_error: "Role is required" })
});

const Login = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .trim()
        .email({ message: "Invalid email address" }),

    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be atleast 8 characters long!" })
        .refine((value) => /[a-z]/.test(value), { message: 'Password must contain atleast one lowercase alphabet.' })
        .refine((value) => /[A-Z]/.test(value), { message: 'Password must contain atleast one uppercase alphabet.' })
        .refine((value) => /[0-9]/.test(value), { message: 'Password must contain atleast one digit.' })
        .refine((value) => /[^a-zA-Z0-9]/.test(value), { message: 'Password must contain atleast one special character.' }),

    role: z
        .string({ required_error: "Role is required" })
});

const SendOtp = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" })
});

const PasswordChange = z.object({
    email: z
        .string({ required_error: "Email is required" })
        .email({ message: "Invalid email address" }),

    password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be atleast 8 characters long!" })
        .refine((value) => /[a-z]/.test(value), { message: 'Password must contain atleast one lowercase alphabet.' })
        .refine((value) => /[A-Z]/.test(value), { message: 'Password must contain atleast one uppercase alphabet.' })
        .refine((value) => /[0-9]/.test(value), { message: 'Password must contain atleast one digit.' })
        .refine((value) => /[^a-zA-Z0-9]/.test(value), { message: 'Password must contain atleast one special character.' }),

    otp: z
        .string({ required_error: "OTP is required" })
});

module.exports = { Register, Login, SendOtp, PasswordChange };