import { useEffect, useState } from "react";
import { register as registerUserAction, verificationEmailOTP, verificationMobileOTP, verifyEmail, verifyMobile } from '../../store/actions/userActions';
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { RESET_SUCCESS } from "../../store/constants/userConstants";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { CLEAR_ERRORS } from "../../store/constants/userConstants";

export default function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: basic info, 2: email OTP, 3: mobile OTP
    const [emailOTP, setEmailOTP] = useState('');
    const [mobileOTP, setMobileOTP] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [mobileVerified, setMobileVerified] = useState(false);

    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();

    const { success, error, isAuthenticated } = useSelector((state) => state.auth);

    const { message: emailVerifyMessage, emailOtp } = useSelector((state) => state.emailVerify);
    const { message: mobileVerifyMessage, mobileOtp } = useSelector((state) => state.mobileVerify);


    const MySwal = withReactContent(Swal);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }

        if (success) {
            MySwal.fire({
                title: "Account created!",
                text: "Account created successfully!",
                icon: "success",
                timer: 3000,
                showConfirmButton: false,
            }).then(() => {
                navigate("/");
            });
            dispatch({ type: RESET_SUCCESS });
        }

        if (error) {
            toast.error(error);
            dispatch({ type: CLEAR_ERRORS });
        }


        if (emailVerifyMessage && emailOtp) {
            toast.success(emailVerifyMessage);
            setEmailVerified(true);
            setStep(3);
            sendMobileOTP();
            dispatch({ type: CLEAR_ERRORS });
        }

        if (mobileVerifyMessage && mobileOtp) {
            toast.success(mobileVerifyMessage);
            setMobileVerified(true);
            submitForm();
            dispatch({ type: CLEAR_ERRORS });
        }
    }, [success, error, dispatch, navigate, isAuthenticated, emailOtp, mobileOtp, emailVerifyMessage, mobileVerifyMessage]);


    const sendEmailOTP = () => {
        const { email } = getValues();
        dispatch(verificationEmailOTP({ email }));
        setStep(2);
    };

    const sendMobileOTP = () => {
        const { mobile } = getValues();
        dispatch(verificationMobileOTP({ mobile }));
        setStep(3);
    };

    const verifyEmailOTP = () => {
        dispatch(verifyEmail({ email: getValues().email, otp: emailOTP }));
    };

    const verifyMobileOTP = () => {
        dispatch(verifyMobile({ mobile: getValues().mobile, otp: mobileOTP }));
    };



    const submitForm = () => {
        const formData = getValues();
        dispatch(registerUserAction({
            email: formData.email,
            mobile: formData.mobile,
            password: formData.password,
        }));
    };

    const onSubmit = async (data) => {
        // First step - validate basic info
        sendEmailOTP();
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-sm border shadow-lg mt-10 bg-gray-50">
            <div>
                <img className="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Sign up to your account</h2>
            </div>

            <div className="mt-10">
                {step === 1 && (
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    type="email"
                                    className={`block w-full rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email format",
                                        },
                                    })}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{String(errors.email.message)}</p>}
                            </div>
                        </div>

                        {/* Mobile Field */}
                        <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-gray-900">Mobile Number</label>
                            <div className="mt-2">
                                <input
                                    id="mobile"
                                    type="tel"
                                    className={`block w-full rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none border ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    {...register("mobile", {
                                        required: "Mobile number is required",
                                        pattern: {
                                            value: /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}$/,
                                            message: "Invalid mobile number (10 digits required)",
                                        },
                                    })}
                                />
                                {errors.mobile && <p className="mt-1 text-sm text-red-500">{String(errors.mobile.message)}</p>}
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                                </div>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    type="password"
                                    className={`block w-full rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none border ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{String(errors.password.message)}</p>}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none"
                            >
                                Continue
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <h3 className="text-center text-lg font-medium text-gray-900">Verify Email</h3>
                        <p className="text-sm text-gray-600">We've sent an OTP to your email address</p>

                        <div>
                            <label htmlFor="emailOTP" className="block text-sm font-medium text-gray-900">Email OTP</label>
                            <div className="mt-2">
                                <input
                                    id="emailOTP"
                                    type="text"
                                    value={emailOTP}
                                    onChange={(e) => setEmailOTP(e.target.value)}
                                    className="block w-full rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none border border-gray-300"
                                    maxLength="4"
                                />
                            </div>
                        </div>

                        <div>
                            {!emailVerified && (
                                <button onClick={verifyEmailOTP} className="text-sm text-indigo-500 hover:text-indigo-700">
                                    Verify Email
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setStep(1)}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Back to form
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <h3 className="text-center text-lg font-medium text-gray-900">Verify Mobile</h3>
                        <p className="text-sm text-gray-600">We've sent an OTP to your mobile number</p>

                        <div>
                            <label htmlFor="mobileOTP" className="block text-sm font-medium text-gray-900">Mobile OTP</label>
                            <div className="mt-2">
                                <input
                                    id="mobileOTP"
                                    type="text"
                                    value={mobileOTP}
                                    onChange={(e) => setMobileOTP(e.target.value)}
                                    className="block w-full rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none border border-gray-300"
                                    maxLength="4"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                onClick={verifyMobileOTP}
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none"
                            >
                                Verify Mobile & Submit
                            </button>
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="text-sm text-indigo-600 hover:text-indigo-500"
                        >
                            Back to email verification
                        </button>
                    </div>
                )}

                <p className="mt-10 text-center text-sm text-gray-500">
                    Already a member?{' '}
                    <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign in</a>
                </p>
            </div>
        </div>
    );
}