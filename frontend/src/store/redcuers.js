import { combineReducers } from 'redux';
import {
    authReducer, allUsersReducer, updateUserReducer,
    emailOtpReducer, mobileOtpReducer, emailVerifyReducer, mobileVerifyReducer
} from './reducers/userReducers';

const reducer = combineReducers({
    auth: authReducer,
    allUsers: allUsersReducer,
    updateUser: updateUserReducer,
    emailOtp: emailOtpReducer,
    mobileOtp: mobileOtpReducer,
    emailVerify: emailVerifyReducer,
    mobileVerify: mobileVerifyReducer,
});

export default reducer;
