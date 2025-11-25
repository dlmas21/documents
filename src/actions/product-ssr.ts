import axios, { endpoints } from 'src/lib/axios';

// ----------------------------------------------------------------------

export async function getProducts() {
  const res = await axios.get(endpoints.product.list);

  return res.data;
}

// ----------------------------------------------------------------------

export async function getProduct(id: string) {
  if (!id) {
    throw new Error('Product ID is required');
  }

  const URL = `${endpoints.product.details}?productId=${encodeURIComponent(id)}`;

  const res = await axios.get(URL);

  return res.data;
}
