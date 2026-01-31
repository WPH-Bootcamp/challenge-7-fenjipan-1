"use client";

import { useRouter } from "next/navigation";
import { useLogin, useRegister } from "@/services/queries";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type TabType = "signin" | "signup";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormTouched {
  name?: boolean;
  email?: boolean;
  phone?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
}

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const register = useRegister();

  // Form state
  const [activeTab, setActiveTab] = useState<TabType>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  useEffect(() => {
    if (login.isSuccess || register.isSuccess) {
      router.push("/menu");
    }
  }, [login.isSuccess, register.isSuccess, router]);

  // Reset form when switching tabs
  useEffect(() => {
    setErrors({});
    setTouched({});
  }, [activeTab]);

  // Validation functions
  const validateName = (value: string) => {
    if (!value) return "Name is required";
    if (value.length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
    return undefined;
  };

  const validatePhone = (value: string) => {
    if (!value) return "Phone number is required";
    if (!/^[0-9]{10,13}$/.test(value.replace(/[^0-9]/g, "")))
      return "Invalid phone number";
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return "Please confirm your password";
    if (value !== password) return "Passwords do not match";
    return undefined;
  };

  // Handle field changes
  const handleFieldChange = (
    field: keyof FormErrors,
    value: string,
    validator: (v: string) => string | undefined
  ) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
    }

    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validator(value) }));
    }
  };

  const handleBlur = (
    field: keyof FormErrors,
    validator: (v: string) => string | undefined,
    value: string
  ) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validator(value) }));
  };

  // Handle login submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setTouched({ email: true, password: true });
    setErrors({ email: emailError, password: passwordError });

    if (!emailError && !passwordError) {
      login.mutate({ email, password });
    }
  };

  // Handle register submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    setTouched({
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });
    setErrors({
      name: nameError,
      email: emailError,
      phone: phoneError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (
      !nameError &&
      !emailError &&
      !phoneError &&
      !passwordError &&
      !confirmPasswordError
    ) {
      register.mutate({ name, email, phone, password });
    }
  };

  const isLoading = login.isPending || register.isPending;

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left side - Hero Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/images/hero-burger.png"
          alt="Delicious burger with fries"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="flex w-full max-w-93.5 flex-col gap-5">
          {/* Logo */}
          <div className="flex items-center gap-3.75">
            <div className="relative h-10.5 w-10.5">
              <Image
                src="/images/foody-logo.svg"
                alt="Foody Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[32px] font-extrabold leading-10.5 text-gray-950">
              Foody
            </span>
          </div>

          {/* Welcome Text */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-extrabold leading-9 text-gray-950">
              Welcome Back
            </h1>
            <p className="text-sm font-medium leading-7 text-gray-950">
              Good to see you again! Let&apos;s eat
            </p>
          </div>

          {/* Tabs */}
          <div className="flex h-12 gap-2 rounded-2xl bg-gray-100 p-2">
            <button
              type="button"
              onClick={() => setActiveTab("signin")}
              className={`flex h-9 flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm tracking-[-0.28px] transition-all ${
                activeTab === "signin"
                  ? "bg-white font-bold text-gray-950 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]"
                  : "font-medium text-gray-600"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("signup")}
              className={`flex h-9 flex-1 items-center justify-center rounded-lg px-3 py-2 text-sm tracking-[-0.28px] transition-all ${
                activeTab === "signup"
                  ? "bg-white font-bold text-gray-950 shadow-[0px_0px_20px_0px_rgba(203,202,202,0.25)]"
                  : "font-medium text-gray-600"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Sign In Form */}
          {activeTab === "signin" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              {/* Email Input */}
              <div className="flex flex-col gap-1">
                <div
                  className={`flex h-12 items-center gap-2 rounded-xl border px-3 py-2 ${
                    errors.email && touched.email
                      ? "border-primary-600"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                      handleFieldChange("email", e.target.value, validateEmail)
                    }
                    onBlur={() => handleBlur("email", validateEmail, email)}
                    className="flex-1 bg-transparent text-sm font-normal leading-7 tracking-[-0.28px] text-gray-950 placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="text-xs font-semibold text-primary-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1">
                <div
                  className={`flex h-12 items-center gap-2 rounded-xl border px-3 py-2 ${
                    errors.password && touched.password
                      ? "border-primary-600"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      handleFieldChange(
                        "password",
                        e.target.value,
                        validatePassword
                      )
                    }
                    onBlur={() =>
                      handleBlur("password", validatePassword, password)
                    }
                    className="flex-1 bg-transparent text-sm font-normal leading-7 tracking-[-0.28px] text-gray-950 placeholder:text-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-xs font-semibold text-primary-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                    rememberMe
                      ? "border-primary-600 bg-primary-600"
                      : "border-gray-800"
                  }`}
                >
                  {rememberMe && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 3L4.5 8.5L2 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-sm font-medium leading-7 text-gray-950">
                  Remember Me
                </span>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 items-center justify-center rounded-full bg-primary-600 p-2 text-base font-bold leading-7.5 tracking-[-0.32px] text-gray-25 transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {login.isPending ? "Loading..." : "Login"}
              </button>
            </form>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <form
              onSubmit={handleRegisterSubmit}
              className="flex flex-col gap-4"
            >
              {/* Name Input */}
              <div className="flex flex-col gap-1">
                <div
                  className={`flex h-12 items-center gap-2 rounded-xl border px-3 py-2 ${
                    errors.name && touched.name
                      ? "border-primary-600"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                      handleFieldChange("name", e.target.value, validateName)
                    }
                    onBlur={() => handleBlur("name", validateName, name)}
                    className="flex-1 bg-transparent text-sm font-normal leading-7 tracking-[-0.28px] text-gray-950 placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
                {errors.name && touched.name && (
                  <p className="text-xs font-semibold text-primary-600">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Input */}
              <div className="flex flex-col gap-1">
                <div
                  className={`flex h-12 items-center gap-2 rounded-xl border px-3 py-2 ${
                    errors.email && touched.email
                      ? "border-primary-600"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                      handleFieldChange("email", e.target.value, validateEmail)
                    }
                    onBlur={() => handleBlur("email", validateEmail, email)}
                    className="flex-1 bg-transparent text-sm font-normal leading-7 tracking-[-0.28px] text-gray-950 placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="text-xs font-semibold text-primary-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone Input */}
              <div className="flex flex-col gap-1">
                <div
                  className={`flex h-12 items-center gap-2 rounded-xl border px-3 py-2 ${
                    errors.phone && touched.phone
                      ? "border-primary-600"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type="tel"
                    placeholder="Number Phone"
                    value={phone}
                    onChange={(e) =>
                      handleFieldChange("phone", e.target.value, validatePhone)
                    }
                    onBlur={() => handleBlur("phone", validatePhone, phone)}
                    className="flex-1 bg-transparent text-sm font-normal leading-7 tracking-[-0.28px] text-gray-950 placeholder:text-gray-500 focus:outline-none"
                  />
                </div>
                {errors.phone && touched.phone && (
                  <p className="text-xs font-semibold text-primary-600">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-1">
                <div
                  className={`flex h-12 items-center gap-2 rounded-xl border px-3 py-2 ${
                    errors.password && touched.password
                      ? "border-primary-600"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      handleFieldChange(
                        "password",
                        e.target.value,
                        validatePassword
                      )
                    }
                    onBlur={() =>
                      handleBlur("password", validatePassword, password)
                    }
                    className="flex-1 bg-transparent text-sm font-normal leading-7 tracking-[-0.28px] text-gray-950 placeholder:text-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && touched.password && (
                  <p className="text-xs font-semibold text-primary-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="flex flex-col gap-1">
                <div
                  className={`flex h-12 items-center gap-2 rounded-xl border px-3 py-2 ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-primary-600"
                      : "border-gray-300"
                  }`}
                >
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) =>
                      handleFieldChange(
                        "confirmPassword",
                        e.target.value,
                        validateConfirmPassword
                      )
                    }
                    onBlur={() =>
                      handleBlur(
                        "confirmPassword",
                        validateConfirmPassword,
                        confirmPassword
                      )
                    }
                    className="flex-1 bg-transparent text-sm font-normal leading-7 tracking-[-0.28px] text-gray-950 placeholder:text-gray-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="text-xs font-semibold text-primary-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 items-center justify-center rounded-full bg-primary-600 p-2 text-base font-bold leading-7.5 tracking-[-0.32px] text-gray-25 transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {register.isPending ? "Loading..." : "Register"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
