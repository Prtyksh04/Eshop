let redirectToLogin = () => {
    window.location.href = "/login";
}

export const setRedirectHandler = (handler: () => void) => {
    redirectToLogin = handler;
}

export const runRedirectToLogin = () => {
    redirectToLogin();
}