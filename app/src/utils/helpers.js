const scrollToTop = () => {
	window.scrollTo(0, 0);
};

/* eslint-disable */
const emailRegEx = RegExp(
	/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
const pwdRegex = RegExp(
	'^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,}$'
);

export { scrollToTop, emailRegEx, pwdRegex };
