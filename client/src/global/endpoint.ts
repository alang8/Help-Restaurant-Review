const devEndpoint = 'http://localhost:5001/' // change this to 5000 if needed

const prodEndpoint = 'https://calm-mesa-01359.herokuapp.com/'

export const endpoint = process.env.NODE_ENV === 'production' ? prodEndpoint : devEndpoint
