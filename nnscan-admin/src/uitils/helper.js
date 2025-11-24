import axios from 'axios'
import Cookies from 'js-cookie';
import config from './config';

// const loginData = (!localStorage.getItem('ddTokenUserPanel')) ? [] : JSON.parse(localStorage.getItem('ddTokenUserPanel'));
const getToken = () => Cookies.get("token");


const serverPath = config.API_URL;
export const request = (path, data, method) => {
    const token = getToken();
    try {
        var options = {
            method: method,
            url: `${serverPath}/${path}`,
            headers: {
                'Content-Type': 'application/json'
            },
            dataType: 'json'
        };
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`
        }
        if (method === 'GET') {
            options['params'] = data
        } else {
            options['data'] = data
        }
        let res = axios(options)
        res.then(res1 => { })
        return res
    } catch (error) {
        console.log('errr', error)
    }

}

export const requestFormData = (path, data, method) => {
  const token = getToken();
  const form_data = new FormData();

  for (const key in data) { 
    const value = data[key];

    if (value instanceof File) {
      form_data.append(key, value);
    }
    else if (Array.isArray(value)) {
      value.forEach(item => {
        form_data.append(key, item);
      });
    }
    else if (typeof value === "object" && value !== null) {
      form_data.append(key, JSON.stringify(value));
    }
    else if (value !== undefined && value !== null) {
      form_data.append(key, value);
    }
  }

  const options = {
    method,
    url: `${serverPath}/${path}`,
    data: form_data,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };

  return axios(options);
};

export const postRequest = async (path, data) => await request(path, data, 'POST')
export const PutRequest = async (path, data) => await request(path, data, 'PUT')
export const PatchRequest = async (path, data) => await request(path, data, 'PATCH')
export const deleteRequest = async (path, data) => await request(path, data, 'DELETE')
export const getRequest = async (path, data) => await request(path, data, 'GET')
export const postRequestFormData = async (path, data) => await requestFormData(path, data, 'POST')
export const putRequestFormData = async (path, data) => await requestFormData(path, data, 'PUT')
export const patchRequestFormData = async (path, data) => await requestFormData(path, data, 'PATCH')


// export const postRequestUrl = async (endpoint, data) => {
//   try {
//     console.log("Sending POST:", `${serverPath}/${endpoint}`, data); // 👈 debug log
//     const response = await axios.post(
//       `${serverPath}/${endpoint}`,
//       data,
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       }
//     );
//     return response;
//   } catch (error) {
//     console.error("POST request failed:", error);
//     throw error;
//   }
// };

export const postRequestUrl = async (endpoint, data) => {
  try {
    console.log("🔹 Sending POST:", `http://localhost:5000/api/${endpoint}`, data);

    const response = await axios.post(
      `http://localhost:5000/api/${endpoint}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response;
  } catch (error) {
    console.error("❌ POST request failed:", error.response?.data || error.message);
    throw error;
  }
};