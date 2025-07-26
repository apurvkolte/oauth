// import axios from 'axios';
import axios from '../../utils/axiosInstance';
import {
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    DELETE_USER_FAIL,
    DELETE_USER_REQUEST,
    CLEAR_ERRORS,
    DELETE_USER_SUCCESS,
    LOGOUT_FAIL,
    LOGOUT_SUCCESS,
    EMAIL_VERIFY_REQUEST,
    EMAIL_VERIFY_SUCCESS,
    EMAIL_VERIFY_RESET,
    EMAIL_VERIFY_FAIL,
    MOBILE_VERIFY_REQUEST,
    MOBILE_VERIFY_SUCCESS,
    MOBILE_VERIFY_RESET,
    MOBILE_VERIFY_FAIL,
    EMAIL_OTP_VERIFY_REQUEST,
    EMAIL_OTP_VERIFY_SUCCESS,
    EMAIL_OTP_VERIFY_RESET,
    EMAIL_OTP_VERIFY_FAIL,
    MOBILE_OTP_VERIFY_REQUEST,
    MOBILE_OTP_VERIFY_SUCCESS,
    MOBILE_OTP_VERIFY_RESET,
    MOBILE_OTP_VERIFY_FAIL,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_FAIL

} from '../constants/userConstants'


export const authRegister = (userData) => async (dispatch) => {
    try {

        dispatch({ type: REGISTER_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/auth/saveUser', userData, config);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error?.response?.data?.message || error?.message

        })
    }
}


export const authLinkedInRegister = (code) => async (dispatch) => {
    try {

        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const { data } = await axios.post('/api/auth/linkedin', { code }, config);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data
        });

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error?.response?.data?.message || error?.message
        });
    }
};

export const authGoogleRegister = (token) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true, // important if you're using HTTP-only cookies for auth
        };

        const { data } = await axios.post('/api/auth/google', { token }, config);

        console.log("data", data);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};


export const authGithubRegister = () => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.get('/api/auth/github', config);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};


export const authFacebookRegister = (code) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('/api/auth/facebook', { code }, config);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};


export const authTwitterRegister = (code) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('/api/auth/twitter', { code }, config);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};


export const authInstagramRegister = (code) => async (dispatch) => {
    try {
        dispatch({ type: REGISTER_USER_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('/api/auth/instagram', { code }, config);

        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error?.response?.data?.message || error?.message,
        });
    }
};





// Register user
export const register = (userData) => async (dispatch) => {
    try {

        dispatch({ type: REGISTER_USER_REQUEST })
        const config = {
            headers: {
                // 'Content-Type': 'multipart/form-data'
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/auth/register', userData, config);


        dispatch({
            type: REGISTER_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: REGISTER_USER_FAIL,
            payload: error?.response?.data?.message || error?.message

        })
    }
}

//email verfication otp
export const verificationEmailOTP = (userData) => async (dispatch) => {
    try {

        dispatch({ type: EMAIL_VERIFY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/auth/verification/email', userData, config);


        dispatch({
            type: EMAIL_VERIFY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EMAIL_VERIFY_FAIL,
            payload: error?.response?.data?.message || error?.message

        })
    }
}

//verifyEmail
export const verifyEmail = (userData) => async (dispatch) => {
    try {

        dispatch({ type: EMAIL_OTP_VERIFY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/auth/verify-email', userData, config);
        console.log("data", data);


        dispatch({
            type: EMAIL_OTP_VERIFY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EMAIL_OTP_VERIFY_FAIL,
            payload: error?.response?.data?.message || error?.message

        })
    }
}

//email verfication otp
export const verificationMobileOTP = (userData) => async (dispatch) => {
    try {

        dispatch({ type: MOBILE_VERIFY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/auth/verification/sms', userData, config);


        dispatch({
            type: MOBILE_VERIFY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: MOBILE_VERIFY_FAIL,
            payload: error?.response?.data?.message || error?.message

        })
    }
}


//verifyMobile
export const verifyMobile = (userData) => async (dispatch) => {
    try {

        dispatch({ type: MOBILE_OTP_VERIFY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.post('/api/auth/verify-mobile', userData, config);


        dispatch({
            type: MOBILE_OTP_VERIFY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: MOBILE_OTP_VERIFY_FAIL,
            payload: error?.response?.data?.message || error?.message

        })
    }
}



// get user
export const login = (userData) => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST })
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const { data } = await axios.post('/api/auth/login', userData, config);


        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: error?.response?.data?.message || error?.message
        })
    }
}

export const logout = () => async (dispatch) => {
    try {

        await axios.get('/api/auth/logout');

        dispatch({
            type: LOGOUT_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: LOGOUT_FAIL,
            payload: error?.response?.data?.message || error?.message
        })
    }
}

export const loadUser = () => async (dispatch) => {
    try {
        dispatch({ type: LOAD_USER_REQUEST });
        const { data } = await axios.get('/api/auth/me', { withCredentials: true });

        dispatch({
            type: LOAD_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: LOAD_USER_FAIL,
            payload: ''
        })
    }
}

// Get all user
export const allUsers = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_USERS_REQUEST })

        const { data } = await axios.get('/api/auth/user');

        dispatch({
            type: ALL_USERS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: ALL_USERS_FAIL,
            payload: error?.response?.data?.message || error?.message
        })
    }
}

// Delete user - ADMIN
export const deleteUser = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_USER_REQUEST })

        const { data } = await axios.delete(`/api/auth/update/${id}`);

        dispatch({
            type: DELETE_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DELETE_USER_FAIL,
            payload: error?.response?.data?.message || error?.message
        })
    }
}

export const updateUser = (id, userData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_USER_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`/api/auth/update/${id}`, userData, config);

        dispatch({
            type: UPDATE_USER_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: UPDATE_USER_FAIL,
            payload: error?.response?.data?.message || error?.message
        })
    }
}


//Clear Error
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}