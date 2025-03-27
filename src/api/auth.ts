interface LoginResponse {
  token: string;
  userid: number;
  error: number;
  // 可以根据实际响应添加其他字段
}

// 自定义错误类，包含错误代码
export class AuthError extends Error {
  errorCode: number;
  
  constructor(message: string, errorCode: number) {
    super(message);
    this.name = 'AuthError';
    this.errorCode = errorCode;
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  try {
    const response = await fetch('/api/login/', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    // 处理403状态码，检查是否是因为邮箱格式不合法
    if (response.status === 403 && data.error === 1) {
      throw new AuthError('账号不是一个合法的邮箱格式', data.error);
    }
    
    // 处理其他非200状态码
    if (!response.ok) {
      throw new Error(`login返回状态码: ${response.status}`);
    }
    
    // 根据错误代码处理不同情况
    switch(data.error) {
      case 0:
        return data; // 正常情况，返回数据
      case 2:
        throw new AuthError('密码错误', data.error);
      case 4:
        throw new AuthError('账号不存在', data.error);
      default:
        throw new AuthError('登录失败，未知原因，请稍后重试', data.error);
    }
    
  } catch (error) {
    console.error('登录请求失败:', error);
    throw error;
  }
}
