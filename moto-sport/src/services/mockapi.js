const BASE_URL = process.env.VUE_APP_API_BASE_URL || 'https://6a11b00e3e35d0f37ee38bb8.mockapi.io'

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || response.statusText)
  }
  return response.json()
}

async function fetchFirst(urls, options = {}) {
  let lastError = null

  for (const url of urls) {
    const response = await fetch(url, options)
    if (response.ok) {
      return response.json()
    }

    if (response.status === 404) {
      continue
    }

    try {
      await handleResponse(response)
    } catch (err) {
      lastError = err
    }
    throw lastError
  }

  throw new Error(`Resource not found: ${urls.join(', ')}`)
}

function formatImageUrl(image) {
  if (!image) return ''
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image
  }
  const encoded = encodeURIComponent(image)
  return `https://via.placeholder.com/600x400?text=${encoded}`
}

function normalizeProduct(product) {
  return {
    id: product.id,
    nombre: product.nombre || product.title || product.name || '',
    precio: product.precio || product.price || product.cost || '',
    marca: product.marca || product.brand || '',
    cilindraje: product.cilindraje || product.cc || '',
    imagen: formatImageUrl(product.imagen || product.image || product.img || ''),
    descripcion: product.descripcion || product.description || 'Descripción no disponible.'
  }
}

function buildProductPayload(product) {
  return {
    nombre: product.nombre,
    price: product.precio,
    marca: product.marca,
    cilindraje: product.cilindraje,
    imagen: product.imagen,
    descripcion: product.descripcion
  }
}

function normalizeUser(user) {
  return {
    id: user.id,
    name: user.name || user.userName || user.nombre || '',
    password: user.password || '',
    userName: user.userName || user.name || user.nombre || '',
    role: user.role || 'user'
  }
}

export function getUserByUsername(userName) {
  const encoded = encodeURIComponent(userName)
  const urls = [
    `${BASE_URL}/usuarios?name=${encoded}`,
    `${BASE_URL}/usuarios?userName=${encoded}`,
    `${BASE_URL}/users?name=${encoded}`
  ]

  return fetchFirst(urls).then(users => {
    const user = users[0] || null
    if (!user) return null
    return normalizeUser(user)
  })
}

export function getUsers() {
  const urls = [`${BASE_URL}/usuarios`, `${BASE_URL}/users`]
  return fetchFirst(urls).then(users => users.map(normalizeUser))
}

export function createUser(user) {
  const payload = {
    name: user.name,
    userName: user.userName,
    password: user.password,
    role: user.role || 'user'
  }
  const body = JSON.stringify(payload)
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  }

  const urls = [`${BASE_URL}/usuarios`, `${BASE_URL}/users`]
  return fetchFirst(urls, options).then(normalizeUser)
}

export function updateUser(user) {
  const encodedId = encodeURIComponent(user.id)
  const payload = {
    name: user.name,
    userName: user.userName,
    password: user.password,
    role: user.role || 'user'
  }
  const body = JSON.stringify(payload)
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body
  }

  const urls = [`${BASE_URL}/usuarios/${encodedId}`, `${BASE_URL}/users/${encodedId}`]
  return fetchFirst(urls, options).then(normalizeUser)
}

export function deleteUser(id) {
  const encodedId = encodeURIComponent(id)
  const urls = [`${BASE_URL}/usuarios/${encodedId}`, `${BASE_URL}/users/${encodedId}`]
  return fetchFirst(urls, { method: 'DELETE' })
}

export function getProducts() {
  const urls = [`${BASE_URL}/productos`, `${BASE_URL}/products`]
  return fetchFirst(urls).then(products => products.map(normalizeProduct))
}

export function createProduct(product) {
  const payload = buildProductPayload(product)
  const body = JSON.stringify(payload)
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  }

  const urls = [`${BASE_URL}/productos`, `${BASE_URL}/products`]
  return fetchFirst(urls, options).then(normalizeProduct)
}

export function updateProduct(product) {
  const encodedId = encodeURIComponent(product.id)
  const payload = buildProductPayload(product)
  const body = JSON.stringify(payload)
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body
  }

  const urls = [`${BASE_URL}/productos/${encodedId}`, `${BASE_URL}/products/${encodedId}`]
  return fetchFirst(urls, options).then(normalizeProduct)
}

export function deleteProduct(id) {
  const encodedId = encodeURIComponent(id)
  const urls = [`${BASE_URL}/productos/${encodedId}`, `${BASE_URL}/products/${encodedId}`]
  return fetchFirst(urls, { method: 'DELETE' })
}
