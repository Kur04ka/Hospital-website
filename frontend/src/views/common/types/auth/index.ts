export interface IRegisterForm {
	email: string;
	password: string;
	repeat_password: string;
	name: string;
	surname: string;
	birth_date: Date;
	sex: string;
	phone: string;
}

export interface IAuthState {
	user: IPublicUser;
	isLogged: boolean;
}

interface IPublicUser {
	email: string;
	name: string;
	surname: string;
	sex: string;
	birth_date: string;
	phone_number: string;
	created_at: string;
}
