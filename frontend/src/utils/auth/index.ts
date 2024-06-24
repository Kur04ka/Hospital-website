import { jwtDecode } from 'jwt-decode';

interface AuthStatus {
    auth: boolean;
    role: string | null;
}

export const checkAuth = (): Promise<AuthStatus> => {
    return new Promise((resolve) => {
        const jwt = localStorage.getItem('jwt');
        if (!jwt) {
            resolve({ auth: false, role: null });
            return;
        }

        try {
            const decoded: any = jwtDecode(jwt);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                localStorage.removeItem('jwt');
                localStorage.removeItem('role');
                resolve({ auth: false, role: null });
            } else {
                // TODO: Запрос роли с бэка при каждома запросе
                // Optionally, you can fetch user role from server
                // For simplicity, using localStorage role
                const role = localStorage.getItem('role');
                resolve({ auth: true, role: role });
            }
        } catch (error) {
            console.error('Invalid token');
            localStorage.removeItem('jwt');
            localStorage.removeItem('role');
            resolve({ auth: false, role: null });
        }
    });
};