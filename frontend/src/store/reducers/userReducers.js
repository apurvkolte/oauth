import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    RESET_SUCCESS,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    LOGOUT_SUCCESS,
    LOGOUT_FAIL,
    ALL_USERS_REQUEST,
    ALL_USERS_SUCCESS,
    ALL_USERS_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_RESET,
    DELETE_USER_FAIL,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_RESET,
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
    FORGOT_PASSWORD_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants'


const initialState = {
    loading: true,          // ✅ Start in loading state
    user: null,             // ✅ Start with no user
    isAuthenticated: false, // ✅ Explicitly false
    error: null,
    success: false,
    message: '',
};

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_USER_REQUEST:
        case LOAD_USER_REQUEST:
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
            };

        case LOGIN_SUCCESS:
        case REGISTER_USER_SUCCESS:
        case LOAD_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload.success,
                user: action.payload.user,
                message: action.payload.message,
                isAuthenticated: true,
            };

        case LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                user: null,
                isAuthenticated: false,
                error: null,
                message: '',
            };

        case LOAD_USER_FAIL:
            return {
                ...state,
                loading: false,
                user: null,
                isAuthenticated: false,
                error: action.payload,
            };

        case LOGOUT_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        case LOGIN_FAIL:
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                user: null,
                error: action.payload,
            };

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                message: '',
            };

        case RESET_SUCCESS:
            return {
                ...state,
                success: false,
                message: '',
            };

        default:
            return state;
    }
};


export const allUsersReducer = (state = { users: [] }, action) => {
    switch (action.type) {

        case ALL_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case ALL_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload.users
            }

        case ALL_USERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const updateUserReducer = (state = {}, action) => {
    switch (action.type) {

        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
            return {
                ...state,
                loading: true
            }

        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isUpdated: action.payload.isUpdated,
                success: action.payload.success,
                message: action.payload.message
            }

        case DELETE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                isDeleted: true,
                success: action.payload.success,
                message: action.payload.message
            }

        case UPDATE_USER_RESET:
            return {
                ...state,
                isUpdated: false,
                message: false
            }

        case DELETE_USER_RESET:
            return {
                ...state,
                isDeleted: false,
                message: false
            }

        case DELETE_USER_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                isDeleted: false,
                isUpdated: false,
                message: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}


export const emailOtpReducer = (state = {}, action) => {
    switch (action.type) {

        case EMAIL_VERIFY_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case EMAIL_VERIFY_SUCCESS:
            return {
                ...state,
                loading: false,
            }

        case EMAIL_VERIFY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const mobileOtpReducer = (state = {}, action) => {
    switch (action.type) {

        case MOBILE_VERIFY_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case MOBILE_VERIFY_SUCCESS:
            return {
                ...state,
                loading: false,
                users: action.payload.users
            }

        case MOBILE_VERIFY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null
            }

        default:
            return state;
    }
}

export const emailVerifyReducer = (state = {}, action) => {
    switch (action.type) {

        case EMAIL_OTP_VERIFY_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case EMAIL_OTP_VERIFY_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                emailOtp: action.payload.emailOtp
            }

        case EMAIL_OTP_VERIFY_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                emailOtp: false
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                emailOtp: false,
                message: ""
            }

        default:
            return state;
    }
}

export const mobileVerifyReducer = (state = {}, action) => {
    switch (action.type) {

        case MOBILE_OTP_VERIFY_REQUEST:
            return {
                ...state,
                loading: true,
            }

        case MOBILE_OTP_VERIFY_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                mobileOtp: action.payload.mobileOtp
            }

        case MOBILE_OTP_VERIFY_FAIL:
            return {
                ...state,
                loading: false,
                mobileOtp: false,
                error: action.payload
            }

        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
                mobileOtp: false,
                message: ""
            }

        default:
            return state;
    }
}