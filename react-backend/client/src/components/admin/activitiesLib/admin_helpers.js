const handleFetchError = (res) => {
  if (res.status === 500) throw new Error(500);
  if (res.status === 401) throw new Error(401);
};

const handleAuthenticatedFetch = (res) => {
  const token = res.headers.get('authorization');

  if (!token) throw new Error('No admin token');
  if (res.status === 500) throw new Error(500);
  if (res.status === 401) throw new Error(401);

  return { res, token };
};

const authenticatedFetch = method => async (url, body) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Not logged in');

    const headers = {
      Authorization: token,
      'Content-Type': 'application/json',
    };
    const opts = body ? { method, headers, body: JSON.stringify(body) } : { method, headers };

    const response = await fetch(url, opts);
    handleFetchError(response);

    return response;
  } catch (error) {
    throw error;
  }
};

export const authenticatedPost = async (url, body) => {
  try {
    const response = await authenticatedFetch('POST')(url, body);
    const responseBody = response.json();
    return responseBody;
  } catch (error) {
    throw error;
  }
};

const adminFetch = method => async (that, url, body) => {
  try {
    const adminToken = that.props.auth;
    if (!adminToken) throw new Error('No admin token');

    const headers = {
      Authorization: adminToken,
      'Content-Type': 'application/json',
    };
    const opts = body ? { headers, method, body: JSON.stringify(body) } : { headers, method };

    const response = await fetch(url, opts);
    const { res, token } = handleAuthenticatedFetch(response);

    const responseData = await res.json();

    await that.props.updateAdminToken(token);

    return responseData;
  } catch (err) {
    const redirectTo =
      {
        500: '/internalServerError',
        401: '/admin/login',
        'No admin token': '/admin/login',
      }[err.message] || '/internalServerError';

    that.props.history.push(redirectTo);
    throw err;
  }
};

export const adminPost = adminFetch('POST');
export const adminGet = adminFetch('GET');

export const checkAdmin = that => adminPost(that, '/api/admin/check');
