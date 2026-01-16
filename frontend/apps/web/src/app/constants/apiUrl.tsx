
export const API_BASE = {
  AUTH:"/api/auth",
  ADMIN: "/api/admin",
  ADDRESS: "/api/users",
  PRODUCT: "/api/products",
  ORDER: "/api/orders",
  BLOGS:"/api/blogs",
  CART:"/api/cart",
  PAYMENT:"/api/payment",
  SEARCH:"/api/search",
  FEEDBACK:"/api/feedback",
};

export const ADMIN = {
    LOGIN: `${API_BASE.ADMIN}/login`,
    REGISTER: `${API_BASE.ADMIN}/register`,
    GET_USERS: `${API_BASE.ADMIN}/users`,
    DELETE_USER:`${API_BASE.ADMIN}/delete/:userId`,
    BULK_DELETE_USER:`${API_BASE.ADMIN}/users/bulk-delete`,
    GET_ALL_ORDERS:`${API_BASE.ADMIN}/orders`,
    TOP_PRODUCTS:`${API_BASE.ADMIN}/top-products`,
    ADMIN_PROFILE:`${API_BASE.ADMIN}/profile`
};

export const AUTH = {
    SIGNUP:`${API_BASE.AUTH}/register`,
    VERIFY_OTP:`${API_BASE.AUTH}/verify-otp`,
    RESEND_OTP:`${API_BASE.AUTH}/resend-otp`,
    LOGIN:`${API_BASE.AUTH}/login`,
    ME:`${API_BASE.AUTH}/me`,
    UPDATE_USER:`${API_BASE.AUTH}/update`,
    UPDATE_PASSWORD:`${API_BASE.AUTH}/update-password`,
    VERIFY_USER:`${API_BASE.AUTH}/verify`,
    DELETE_USER:`${API_BASE.AUTH}/delete`,
}

export const BLOG = {
    CREATE_BLOG:`${API_BASE.BLOGS}`,
    GET_SINGLE_BLOG:`${API_BASE.BLOGS}/:id`,
}

export const ADDRESS = {
    ADD_ADDRESS:`${API_BASE.ADDRESS}/address`,
}

export const ORDER = {
    GET_ORDER:`${API_BASE.ORDER}`,
}

export const PAYMENT = {
    CREATE_PAYMENT:`${API_BASE.PAYMENT}/create-order`,
    VERIFY_PAYMENT:`${API_BASE.PAYMENT}/verify-payment`,
}

export const PRODUCT = {
    CREATE_PRODUCT : `${API_BASE.PRODUCT}/create`,
    UPDATE_PRODUCT:`${API_BASE.PRODUCT}/update`,
    DELETE_PRODUCT:`${API_BASE.PRODUCT}/delete`,
    BULK_DELETE:`${API_BASE.PRODUCT}/bulk-delete`
}