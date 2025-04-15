import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin): Promise<string> => {
  console.log('userInfo',userInfo);
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userInfo),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log('errorData',errorData);
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  return data.token;
};

export { login };